import { useState, useEffect, useCallback, useRef } from 'react';

// const API = 'http://localhost:3001';
// const WS  = 'ws://localhost:3001';

const isProduction = window.location.protocol === 'https:';
const API = isProduction ? window.location.origin : 'http://localhost:3001';
const WS = isProduction 
  ? `wss://${window.location.host}` 
  : 'ws://localhost:3001';

export function useContentWatcher() {
  const [state, setState] = useState({
    tree: [],
    fileCache: {},
    status: 'connecting',
    lastEvent: null,
  });

  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const mountedRef = useRef(true);

  // ── Fetch initial tree ─────────────────────────────────────────────────────
  const fetchTree = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/tree`);
      const data = await res.json();
      if (mountedRef.current) {
        setState(prev => ({ ...prev, tree: data.tree ?? [] }));
      }
    } catch {
      // Server not ready yet, will retry via WS reconnect
    }
  }, []);

  // ── Fetch file content ─────────────────────────────────────────────────────
  const fetchFile = useCallback(async (filePath) => {
    // Return from cache if already loaded
    const cached = state.fileCache[filePath];
    if (cached !== undefined) return cached;

    try {
      const res = await fetch(`${API}/api/file?path=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      const content = data.content ?? '# File not found';
      setState(prev => ({
        ...prev,
        fileCache: { ...prev.fileCache, [filePath]: content },
      }));
      return content;
    } catch {
      return '# Error loading file';
    }
  }, [state.fileCache]);

  // ── WebSocket connect ──────────────────────────────────────────────────────
  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    try {
      const ws = new WebSocket(WS);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        console.log('[WS] Connected');
        setState(prev => ({ ...prev, status: 'connected', lastEvent: 'Connected to server' }));
        fetchTree();
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const msg = JSON.parse(event.data);

          setState(prev => {
            const newCache = { ...prev.fileCache };

            switch (msg.type) {
              case 'FILE_ADDED':
              case 'FILE_CHANGED':
                // Update cache with new content
                if (msg.content !== undefined) {
                  newCache[msg.path] = msg.content;
                }
                return {
                  ...prev,
                  tree: msg.tree,
                  fileCache: newCache,
                  lastEvent: `${msg.type === 'FILE_ADDED' ? '✨ New' : '✏️ Updated'}: ${msg.path.split('/').pop()}`,
                };

              case 'FILE_DELETED':
                delete newCache[msg.path];
                return {
                  ...prev,
                  tree: msg.tree,
                  fileCache: newCache,
                  lastEvent: `🗑️ Deleted: ${msg.path.split('/').pop()}`,
                };

              case 'DIR_ADDED':
                return {
                  ...prev,
                  tree: msg.tree,
                  lastEvent: `📁 New folder: ${msg.path.split('/').pop()}`,
                };

              case 'DIR_DELETED':
                return {
                  ...prev,
                  tree: msg.tree,
                  lastEvent: `🗑️ Folder removed: ${msg.path.split('/').pop()}`,
                };

              default:
                return prev;
            }
          });
        } catch (err) {
          console.error('[WS] Parse error:', err);
        }
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        console.log('[WS] Disconnected, retrying in 3s...');
        setState(prev => ({ ...prev, status: 'disconnected', lastEvent: 'Reconnecting...' }));
        // Auto-reconnect
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        if (!mountedRef.current) return;
        setState(prev => ({ ...prev, status: 'error' }));
        ws.close();
      };
    } catch {
      setState(prev => ({ ...prev, status: 'error' }));
      reconnectTimer.current = setTimeout(connect, 3000);
    }
  }, [fetchTree]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  return {
    tree: state.tree,
    fileCache: state.fileCache,
    status: state.status,
    lastEvent: state.lastEvent,
    fetchFile,
  };
}
