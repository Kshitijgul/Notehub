import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { createServer } from 'http';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || '';
const GITHUB_REPO = process.env.GITHUB_REPO || '';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_CONTENT_PATH = (process.env.GITHUB_CONTENT_PATH || '').trim();
const PORT = Number(process.env.PORT || 3001);

const octokit = new Octokit({
  auth: GITHUB_TOKEN || undefined,
});

app.use(cors());
app.use(express.json());

// ── Helpers ───────────────────────────────────────────────────────────────────

function ensureConfig() {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error('Missing GITHUB_OWNER or GITHUB_REPO in environment variables');
  }
}

function sortTree(nodes) {
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

async function getGithubContent(targetPath) {
  const response = await octokit.repos.getContent({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: targetPath,
    ref: GITHUB_BRANCH,
  });

  return response.data;
}

/** Recursively build a file tree from GitHub Content folder */
async function buildGithubTree(relativePath = '') {
  const absolutePath = GITHUB_CONTENT_PATH
    ? (relativePath ? `${GITHUB_CONTENT_PATH}/${relativePath}` : GITHUB_CONTENT_PATH)
    : relativePath;

  const data = await getGithubContent(absolutePath);
  if (!Array.isArray(data)) return [];

  const nodes = [];
  for (const item of data) {
    if (item.type === 'dir') {
      const childRelPath = relativePath ? `${relativePath}/${item.name}` : item.name;
      nodes.push({
        id: childRelPath,
        name: item.name,
        type: 'folder',
        children: await buildGithubTree(childRelPath),
      });
    }

    if (item.type === 'file' && item.name.endsWith('.md')) {
      const fileRelPath = relativePath ? `${relativePath}/${item.name}` : item.name;
      nodes.push({
        id: fileRelPath,
        name: item.name,
        type: 'file',
        path: fileRelPath,
      });
    }
  }

  return sortTree(nodes);
}

/** Read markdown content from GitHub */
async function readMarkdownFile(relativePath) {
  const safePath = String(relativePath || '').replace(/\\/g, '/').replace(/^\/+/, '');
  if (!safePath || safePath.includes('..') || !safePath.endsWith('.md')) return null;

  const githubPath = GITHUB_CONTENT_PATH ? `${GITHUB_CONTENT_PATH}/${safePath}` : safePath;
  const data = await getGithubContent(githubPath);
  if (Array.isArray(data) || data.type !== 'file') return null;

  if (data.content && data.encoding === 'base64') {
    return Buffer.from(data.content, 'base64').toString('utf-8');
  }

  if (data.download_url) {
    const response = await fetch(data.download_url);
    if (!response.ok) return null;
    return await response.text();
  }

  return null;
}

// ── REST API ──────────────────────────────────────────────────────────────────

/** GET /api/tree → full file tree */
app.get('/api/tree', async (_req, res) => {
  try {
    ensureConfig();
    const tree = await buildGithubTree();
    res.json({ tree });
  } catch (err) {
    console.error('[API] Error building tree:', err);
    res.status(500).json({ error: 'Failed to read Content from GitHub' });
  }
});

/** GET /api/file?path=Folder/file.md → file content */
app.get('/api/file', async (req, res) => {
  const filePath = req.query.path;
  if (!filePath) return res.status(400).json({ error: 'Missing ?path param' });

  let content = null;
  try {
    ensureConfig();
    content = await readMarkdownFile(filePath);
  } catch (err) {
    console.error('[API] Error reading file:', err);
  }

  if (content === null) return res.status(404).json({ error: 'File not found' });
  res.json({ content });
});

// ── HTTP + WebSocket server ───────────────────────────────────────────────────

const server = createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[WS] Client connected  (total: ${clients.size})`);
  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected (total: ${clients.size})`);
  });
});

function broadcast(event) {
  const msg = JSON.stringify(event);
  for (const client of clients) {
    if (client.readyState === 1 /* OPEN */) client.send(msg);
  }
}

// ── GitHub polling watcher ────────────────────────────────────────────────────

let lastTreeSignature = '';

async function pollGithubTree() {
  try {
    ensureConfig();
    const tree = await buildGithubTree();
    const signature = JSON.stringify(tree);

    if (!lastTreeSignature) {
      lastTreeSignature = signature;
      return;
    }

    if (signature !== lastTreeSignature) {
      lastTreeSignature = signature;
      console.log('[Watcher] GitHub content changed, broadcasting update');
      broadcast({
        type: 'TREE_UPDATED',
        tree,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error('[Watcher] Poll error:', err.message);
  }
}

setInterval(pollGithubTree, 30000);
pollGithubTree();


// Production static serving
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// ── Start ─────────────────────────────────────────────────────────────────────

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Notes server running on port ${PORT}`);
});