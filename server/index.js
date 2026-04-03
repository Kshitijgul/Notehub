import express from 'express';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Support both 'Content' and 'content' folder names
const CONTENT_DIR_UPPER = path.resolve(__dirname, '../public/Content');
const CONTENT_DIR_LOWER = path.resolve(__dirname, '../public/content');
const fs2 = fs;
const CONTENT_DIR = fs2.existsSync(CONTENT_DIR_UPPER) ? CONTENT_DIR_UPPER : CONTENT_DIR_LOWER;

const app = express();
app.use(cors());
app.use(express.json());

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Recursively build a file tree from the Content directory */
function buildFileTree(dir, baseDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      nodes.push({
        id: relativePath,
        name: entry.name,
        type: 'folder',
        children: buildFileTree(fullPath, baseDir),
      });
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      nodes.push({
        id: relativePath,
        name: entry.name,
        type: 'file',
        path: relativePath,
      });
    }
  }

  // Sort: folders first, then alphabetically
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/** Read a single markdown file */
function readFile(relativePath) {
  const fullPath = path.join(CONTENT_DIR, relativePath);
  // Security: ensure the resolved path is inside CONTENT_DIR
  const resolvedDir = fs.realpathSync(CONTENT_DIR);
  const resolvedFile = path.normalize(fullPath);
  if (!resolvedFile.startsWith(resolvedDir) && !resolvedFile.startsWith(CONTENT_DIR)) return null;
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf-8');
}

// ── REST API ─────────────────────────────────────────────────────────────────

/** GET /api/tree  →  returns the full file tree */
app.get('/api/tree', (req, res) => {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }
    const tree = buildFileTree(CONTENT_DIR);
    res.json({ tree });
  } catch (err) {
    console.error('Error building tree:', err);
    res.status(500).json({ error: 'Failed to read content directory' });
  }
});

/** GET /api/file?path=Folder/file.md  →  returns file content */
app.get('/api/file', (req, res) => {
  const filePath = req.query.path;
  if (!filePath) return res.status(400).json({ error: 'Missing path param' });
  const content = readFile(filePath);
  if (content === null) return res.status(404).json({ error: 'File not found' });
  res.json({ content });
});

// ── HTTP + WebSocket Server ──────────────────────────────────────────────────

const server = createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[WS] Client connected (total: ${clients.size})`);

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected (total: ${clients.size})`);
  });
});

function broadcast(event) {
  const msg = JSON.stringify(event);
  for (const client of clients) {
    if (client.readyState === 1 /* OPEN */) {
      client.send(msg);
    }
  }
}

// ── Chokidar File Watcher ────────────────────────────────────────────────────

if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  console.log(`[Watcher] Created Content directory: ${CONTENT_DIR}`);
}

const watcher = chokidar.watch(CONTENT_DIR, {
  ignored: /(^|[/\\])\../, // ignore dot files
  persistent: true,
  ignoreInitial: true,     // don't fire on startup
  awaitWriteFinish: {
    stabilityThreshold: 200,
    pollInterval: 100,
  },
});

function getRelativePath(filePath) {
  return path.relative(CONTENT_DIR, filePath).replace(/\\/g, '/');
}

watcher
  .on('add', (filePath) => {
    const rel = getRelativePath(filePath);
    if (!rel.endsWith('.md')) return;
    console.log(`[Watcher] File added: ${rel}`);
    const content = readFile(rel);
    const tree = buildFileTree(CONTENT_DIR);
    broadcast({ type: 'FILE_ADDED', path: rel, content, tree });
  })
  .on('change', (filePath) => {
    const rel = getRelativePath(filePath);
    if (!rel.endsWith('.md')) return;
    console.log(`[Watcher] File changed: ${rel}`);
    const content = readFile(rel);
    const tree = buildFileTree(CONTENT_DIR);
    broadcast({ type: 'FILE_CHANGED', path: rel, content, tree });
  })
  .on('unlink', (filePath) => {
    const rel = getRelativePath(filePath);
    if (!rel.endsWith('.md')) return;
    console.log(`[Watcher] File deleted: ${rel}`);
    const tree = buildFileTree(CONTENT_DIR);
    broadcast({ type: 'FILE_DELETED', path: rel, tree });
  })
  .on('addDir', (dirPath) => {
    const rel = getRelativePath(dirPath);
    console.log(`[Watcher] Folder added: ${rel}`);
    const tree = buildFileTree(CONTENT_DIR);
    broadcast({ type: 'DIR_ADDED', path: rel, tree });
  })
  .on('unlinkDir', (dirPath) => {
    const rel = getRelativePath(dirPath);
    console.log(`[Watcher] Folder deleted: ${rel}`);
    const tree = buildFileTree(CONTENT_DIR);
    broadcast({ type: 'DIR_DELETED', path: rel, tree });
  })
  .on('ready', () => {
    console.log(`[Watcher] Watching: ${CONTENT_DIR}`);
  })
  .on('error', (err) => {
    console.error('[Watcher] Error:', err);
  });

// ── Start ────────────────────────────────────────────────────────────────────

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 Notes server running on http://localhost:${PORT}`);
  console.log(`📂 Watching: ${CONTENT_DIR}`);
  console.log(`🔌 WebSocket ready\n`);
});
