// Quick launcher – runs the notes backend server
// Usage: node start-server.js
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = spawn('node', [path.join(__dirname, 'server/index.js')], {
  stdio: 'inherit',
  env: { ...process.env },
});

server.on('error', (err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
