import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { createServer } from 'http';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Load .env from multiple possible locations ────────────────────────────────
const envPaths = [
  path.resolve(process.cwd(), '.env'),      // Current working directory
  path.resolve(__dirname, '../.env'),       // One level up from server file
  path.resolve(__dirname, '.env'),          // Same folder as server file
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`✅ Loaded .env from: ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn(`⚠️  No .env file found. Tried:`);
  envPaths.forEach(p => console.warn(`   - ${p}`));
  console.warn(`   Using environment variables from system instead.\n`);
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || '';
const GITHUB_REPO = process.env.GITHUB_REPO || '';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_CONTENT_PATH = process.env.GITHUB_CONTENT_PATH || '';
const PORT = Number(process.env.PORT || 3001);

// Show what was loaded (for debugging)
console.log(`\n🔧 Configuration:`);
console.log(`   GITHUB_OWNER:  ${GITHUB_OWNER || '❌ MISSING'}`);
console.log(`   GITHUB_REPO:   ${GITHUB_REPO || '❌ MISSING'}`);
console.log(`   GITHUB_TOKEN:  ${GITHUB_TOKEN ? '✅ Set (' + GITHUB_TOKEN.substring(0, 10) + '...)' : '❌ MISSING'}`);
console.log(`   GITHUB_BRANCH: ${GITHUB_BRANCH}`);
console.log(`   CONTENT_PATH:  ${GITHUB_CONTENT_PATH || '(root)'}`);
console.log(`   PORT:          ${PORT}\n`);

const octokit = new Octokit({
  auth: GITHUB_TOKEN || undefined,
});

const app = express();
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
  const absolutePath = relativePath
    ? (GITHUB_CONTENT_PATH ? `${GITHUB_CONTENT_PATH}/${relativePath}` : relativePath)
    : GITHUB_CONTENT_PATH;

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
  
  // Try raw URL first (handles special characters like & better)
  try {
    const encodedPath = githubPath.split('/').map(p => encodeURIComponent(p)).join('/');
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${encodedPath}`;
    
    const headers = {};
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }
    
    const response = await fetch(rawUrl, { headers });
    if (response.ok) {
      return await response.text();
    }
    console.warn(`[Fetch] ❌ ${response.status}: ${safePath}`);
  } catch (err) {
    console.warn(`[Fetch] Raw URL failed for ${safePath}:`, err.message);
  }
  
  // Fallback to GitHub API
  try {
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
  } catch (err) {
    console.error(`[API] Failed to fetch ${safePath}:`, err.message);
  }

  return null;
}

// ── REST API ──────────────────────────────────────────────────────────────────

app.get('/api/tree', async (_req, res) => {
  try {
    ensureConfig();
    const tree = await buildGithubTree();
    res.json({ tree });
  } catch (err) {
    console.error('[API] Error building tree:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/file', async (req, res) => {
  const filePath = req.query.path;
  if (!filePath) return res.status(400).json({ error: 'Missing ?path param' });

  let content = null;
  try {
    ensureConfig();
    content = await readMarkdownFile(filePath);
  } catch (err) {
    console.error('[API] Error reading file:', err.message);
    return res.status(500).json({ error: err.message });
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
    if (client.readyState === 1) client.send(msg);
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
    // Silently fail - don't spam the console
  }
}

setInterval(pollGithubTree, 30000);
pollGithubTree();

// ── Serve React Frontend (Production) ─────────────────────────────────────────

// Try to find dist folder in multiple locations
const distPaths = [
  path.resolve(process.cwd(), 'dist'),
  path.resolve(__dirname, '../dist'),
  path.resolve(__dirname, 'dist'),
];

let distPath = null;
for (const p of distPaths) {
  if (fs.existsSync(p)) {
    distPath = p;
    break;
  }
}

if (distPath) {
  console.log(`📦 Serving static files from: ${distPath}`);
  app.use(express.static(distPath));
  
  // Catch-all middleware (Express 5 compatible) - serve React's index.html
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.warn(`⚠️  No 'dist' folder found. Run 'npm run build' first.`);
  console.warn(`   Tried: ${distPaths.join(', ')}\n`);
}

// ── Start ─────────────────────────────────────────────────────────────────────

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀  Notes server      →  http://localhost:${PORT}`);
  console.log(`🔌  WebSocket         →  ws://localhost:${PORT}`);
  console.log(`🐙  GitHub repository →  ${GITHUB_OWNER}/${GITHUB_REPO}`);
  console.log(`🌿  Branch            →  ${GITHUB_BRANCH}\n`);
});