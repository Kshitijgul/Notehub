import { useState, useEffect, useCallback, useRef } from 'react';

// ── Auto-detect environment ────────────────────────────────────────────────
const isProduction = window.location.protocol === 'https:';
const API = isProduction ? window.location.origin : 'http://localhost:3001';
const WS = isProduction ? `wss://${window.location.host}` : 'ws://localhost:3001';

export function useContentWatcher() {
  const [state, setState] = useState({
    tree: [],
    fileCache: {},
    status: 'connecting',
    lastEvent: null,
    loadingProgress: null, // { loaded, total }
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

  // ── Fetch file content (with streaming for imports) ────────────────────────
  const fetchFile = useCallback(async (filePath) => {
    // Return from cache if already loaded
    const cached = state.fileCache[filePath];
    if (cached !== undefined) return cached;

    // Try streaming endpoint first
    return new Promise((resolve) => {
      try {
        const eventSource = new EventSource(
          `${API}/api/file/stream?path=${encodeURIComponent(filePath)}`
        );

        let timeout = setTimeout(() => {
          // Fallback to regular endpoint if streaming fails
          eventSource.close();
          fetchFileRegular(filePath).then(resolve);
        }, 5000);

        eventSource.onmessage = (event) => {
          clearTimeout(timeout);
          try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
              case 'progress':
                if (mountedRef.current) {
                  setState(prev => ({
                    ...prev,
                    loadingProgress: { loaded: data.loaded, total: data.total },
                    lastEvent: `📥 Loading ${data.loaded}/${data.total} imports...`,
                  }));
                }
                break;

              case 'complete':
                eventSource.close();
                if (mountedRef.current) {
                  setState(prev => ({
                    ...prev,
                    fileCache: { ...prev.fileCache, [filePath]: data.content },
                    loadingProgress: null,
                    lastEvent: `✅ Loaded successfully`,
                  }));
                }
                resolve(data.content);
                break;

              case 'error':
                eventSource.close();
                if (mountedRef.current) {
                  setState(prev => ({
                    ...prev,
                    loadingProgress: null,
                  }));
                }
                resolve('# Error loading file\n\n' + (data.message || ''));
                break;

              case 'status':
                if (mountedRef.current) {
                  setState(prev => ({ ...prev, lastEvent: data.message }));
                }
                break;
            }
          } catch (err) {
            console.error('[Stream] Parse error:', err);
          }
        };

        eventSource.onerror = () => {
          clearTimeout(timeout);
          eventSource.close();
          // Fallback to regular endpoint
          fetchFileRegular(filePath).then(resolve);
        };
      } catch (err) {
        // Fallback to regular endpoint
        fetchFileRegular(filePath).then(resolve);
      }
    });
  }, [state.fileCache]);

  // ── Fallback: Regular file fetch ──────────────────────────────────────────
  const fetchFileRegular = async (filePath) => {
    try {
      const res = await fetch(`${API}/api/file?path=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      const content = data.content ?? '# File not found';
      
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          fileCache: { ...prev.fileCache, [filePath]: content },
        }));
      }
      return content;
    } catch {
      return '# Error loading file';
    }
  };

  // ── WebSocket connect ──────────────────────────────────────────────────────
  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    try {
      const ws = new WebSocket(WS);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        console.log('[WS] Connected');
        setState(prev => ({ 
          ...prev, 
          status: 'connected', 
          lastEvent: 'Connected to server' 
        }));
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
                if (msg.content !== undefined) {
                  newCache[msg.path] = msg.content;
                }
                return {
                  ...prev,
                  tree: msg.tree || prev.tree,
                  fileCache: newCache,
                  lastEvent: `${msg.type === 'FILE_ADDED' ? '✨ New' : '✏️ Updated'}: ${msg.path.split('/').pop()}`,
                };

              case 'FILE_DELETED':
                delete newCache[msg.path];
                return {
                  ...prev,
                  tree: msg.tree || prev.tree,
                  fileCache: newCache,
                  lastEvent: `🗑️ Deleted: ${msg.path.split('/').pop()}`,
                };

              case 'DIR_ADDED':
                return {
                  ...prev,
                  tree: msg.tree || prev.tree,
                  lastEvent: `📁 New folder: ${msg.path.split('/').pop()}`,
                };

              case 'DIR_DELETED':
                return {
                  ...prev,
                  tree: msg.tree || prev.tree,
                  lastEvent: `🗑️ Folder removed: ${msg.path.split('/').pop()}`,
                };

              case 'TREE_UPDATED':
                // GitHub changes detected - clear cache to force reload
                return {
                  ...prev,
                  tree: msg.tree || prev.tree,
                  fileCache: {}, // Clear cache so files reload with fresh content
                  lastEvent: `🔄 Content updated from GitHub`,
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
        setState(prev => ({ 
          ...prev, 
          status: 'disconnected', 
          lastEvent: 'Reconnecting...' 
        }));
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
    loadingProgress: state.loadingProgress,
    fetchFile,
  };
}