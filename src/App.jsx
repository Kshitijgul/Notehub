import { useState, useEffect, useCallback, useRef } from 'react';
import { useContentWatcher } from './hooks/useContentWatcher';
import VirtualizedMarkdown from './components/VirtualizedMarkdown';
import './markdown.css';
import './markdown-mermaid.css';

// ── tiny cn helper ─────────────────────────────────────────────────────────
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ── Icons ──────────────────────────────────────────────────────────────────
const ChevronRight = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronDown = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const FolderIcon = ({ open, className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    {open ? (
      <path d="M2 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v1H2V6zM2 11h20l-1.447 7.243A2 2 0 0118.573 20H5.427a2 2 0 01-1.98-1.757L2 11z" />
    ) : (
      <path d="M2 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    )}
  </svg>
);
const MarkdownIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.56 18H3.44C2.65 18 2 17.37 2 16.59V7.41C2 6.63 2.65 6 3.44 6h17.12C21.35 6 22 6.63 22 7.41v9.18c0 .78-.65 1.41-1.44 1.41zM9.09 14.75V11l1.73 2.19 1.73-2.19v3.75H14V9.25h-1.45L10.82 11.5 9.09 9.25H7.64v5.5h1.45zM15.45 14.75l2.18-2.73H16.1V9.25h-1.45v2.77h-1.53l2.18 2.73h.15z" />
  </svg>
);
const BookIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);
const SearchIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const XIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const RefreshIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);
const WifiIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12.55a11 11 0 0114.08 0" />
    <path d="M1.42 9a16 16 0 0121.16 0" />
    <path d="M8.53 16.11a6 6 0 016.95 0" />
    <circle cx="12" cy="20" r="1" fill="currentColor" />
  </svg>
);

// ── Folder colors ──────────────────────────────────────────────────────────
const FOLDER_COLORS = {
  css: '#3b82f6', html: '#f97316', java: '#ef4444',
  javascript: '#eab308', js: '#eab308', typescript: '#3b82f6',
  ts: '#3b82f6', python: '#22c55e', react: '#38bdf8', node: '#4ade80',
};

function getFolderColor(name) {
  const key = name.toLowerCase().replace(/[^a-z]/g, '');
  return FOLDER_COLORS[key] ?? '#94a3b8';
}

// ── Flatten files helper ───────────────────────────────────────────────────
function flattenFiles(nodes) {
  const result = [];
  for (const node of nodes) {
    if (node.type === 'file') result.push(node);
    if (node.children) result.push(...flattenFiles(node.children));
  }
  return result;
}

// ── Find breadcrumb path ───────────────────────────────────────────────────
function findPath(nodes, targetId, path = []) {
  for (const node of nodes) {
    if (node.id === targetId) return [...path, node.name];
    if (node.children) {
      const found = findPath(node.children, targetId, [...path, node.name]);
      if (found) return found;
    }
  }
  return null;
}

// ── Status dot ────────────────────────────────────────────────────────────
function StatusDot({ status }) {
  const color =
    status === 'connected'    ? '#22c55e' :
    status === 'connecting'   ? '#eab308' :
    status === 'disconnected' ? '#f97316' : '#ef4444';
  const label =
    status === 'connected'    ? 'Live' :
    status === 'connecting'   ? 'Connecting…' :
    status === 'disconnected' ? 'Reconnecting…' : 'Error';
  return (
    <span className="flex items-center gap-1">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{
          background: color,
          boxShadow: status === 'connected' ? `0 0 6px ${color}` : undefined,
          animation: status === 'connected' ? 'pulse-dot 2s infinite' : undefined,
        }}
      />
      {label}
    </span>
  );
}

// ── Toast notification ─────────────────────────────────────────────────────
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [message, onDone]);
  return (
    <div
      className="fixed bottom-8 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium shadow-2xl"
      style={{ background: '#252526', border: '1px solid #3c3c3c', color: '#cccccc', animation: 'slide-in 0.25s ease' }}
    >
      <WifiIcon className="w-4 h-4" style={{ color: '#22c55e' }} />
      {message}
    </div>
  );
}

// ── TreeNode ───────────────────────────────────────────────────────────────
function TreeNode({ node, depth, selectedId, expandedIds, onSelect, onToggle, searchQuery }) {
  const isOpen     = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isFolder   = node.type === 'folder';

  if (searchQuery && node.type === 'file') {
    if (!node.name.toLowerCase().includes(searchQuery.toLowerCase())) return null;
  }

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1.5 cursor-pointer rounded-sm py-[3px] pr-2 group relative',
          'hover:bg-[#2a2d2e] transition-colors duration-75',
          isSelected && 'bg-[#094771] hover:bg-[#094771]'
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
        onClick={() => isFolder ? onToggle(node.id) : onSelect(node)}
      >
        {depth > 0 && (
          <span
            className="absolute top-0 bottom-0 border-l border-[#404040] opacity-30"
            style={{ left: `${depth * 12}px` }}
          />
        )}

        {isFolder ? (
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-[#cccccc]">
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
        ) : (
          <span className="w-4 h-4 flex-shrink-0" />
        )}

        {isFolder ? (
          <FolderIcon open={isOpen} className="w-4 h-4 flex-shrink-0" style={{ color: getFolderColor(node.name) }} />
        ) : (
          <MarkdownIcon className="w-4 h-4 flex-shrink-0 text-[#519aba]" />
        )}

        <span
          className={cn('text-[13px] truncate leading-5 select-none', isSelected ? 'text-white' : 'text-[#cccccc]')}
          style={isFolder ? { color: getFolderColor(node.name) } : undefined}
        >
          {node.name}
        </span>
      </div>

      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
              searchQuery=""
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const { tree, fileCache, status, lastEvent, fetchFile } = useContentWatcher();

  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [expandedIds, setExpandedIds]     = useState(new Set());
  const [selectedId, setSelectedId]       = useState(null);
  const [tabs, setTabs]                   = useState([]);
  const [activeTab, setActiveTab]         = useState(null);
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeContent, setActiveContent] = useState('');
  const [loadingFile, setLoadingFile]     = useState(false);
  const [toast, setToast]                 = useState(null);
  const prevLastEvent                     = useRef(null);
  const scrollContainerRef                = useRef(null); // For VirtualizedMarkdown

  // Auto-expand first folder when tree loads
  useEffect(() => {
    if (tree.length > 0 && expandedIds.size === 0) {
      setExpandedIds(new Set([tree[0].id]));
    }
  }, [tree]);

  // Show toast on live events
  useEffect(() => {
    if (lastEvent && lastEvent !== prevLastEvent.current && status === 'connected') {
      prevLastEvent.current = lastEvent;
      if (!lastEvent.startsWith('Connected')) {
        setToast(lastEvent);
      }
    }
  }, [lastEvent, status]);

  // Reload active file content when fileCache updates for it
  const activeNode = tabs.find(t => t.node.id === activeTab)?.node ?? null;

  useEffect(() => {
    if (!activeNode?.path) return;
    const cached = fileCache[activeNode.path];
    if (cached !== undefined) {
      setActiveContent(cached);
    }
  }, [fileCache, activeNode?.path]);

  // Handle file selection
  const handleSelectFile = useCallback(async (node) => {
    setSelectedId(node.id);
    setTabs(prev => {
      if (prev.find(t => t.node.id === node.id)) return prev;
      return [...prev, { node }];
    });
    setActiveTab(node.id);

    if (node.path) {
      setLoadingFile(true);
      const content = await fetchFile(node.path);
      setActiveContent(content);
      setLoadingFile(false);
    }
  }, [fetchFile]);

  // When switching tabs, restore cached content
  const handleSwitchTab = useCallback(async (node) => {
    setActiveTab(node.id);
    setSelectedId(node.id);
    if (node.path) {
      const cached = fileCache[node.path];
      if (cached !== undefined) {
        setActiveContent(cached);
      } else {
        setLoadingFile(true);
        const content = await fetchFile(node.path);
        setActiveContent(content);
        setLoadingFile(false);
      }
    }
  }, [fileCache, fetchFile]);

  const handleToggleFolder = useCallback((id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleCloseTab = (id, e) => {
    e.stopPropagation();
    setTabs(prev => {
      const idx  = prev.findIndex(t => t.node.id === id);
      const next = prev.filter(t => t.node.id !== id);
      if (activeTab === id) {
        const newActive = next[Math.min(idx, next.length - 1)]?.node ?? null;
        setActiveTab(newActive?.id ?? null);
        setSelectedId(newActive?.id ?? null);
        if (newActive?.path) {
          const cached = fileCache[newActive.path];
          setActiveContent(cached ?? '');
        } else {
          setActiveContent('');
        }
      }
      return next;
    });
  };

  // Escape closes search
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') setSearchQuery(''); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const allFiles      = flattenFiles(tree);
  const filteredFiles = searchQuery
    ? allFiles.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;
  const breadcrumb    = activeNode ? findPath(tree, activeNode.id) ?? [] : [];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#1e1e1e', color: '#cccccc', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* ── Activity Bar ──────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center py-2 gap-2 flex-shrink-0" style={{ width: 48, background: '#333333', borderRight: '1px solid #252526' }}>
        <button
          onClick={() => setSidebarOpen(v => !v)}
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          title="Explorer"
          style={{ color: sidebarOpen ? '#ffffff' : '#858585' }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm13 0h-3v3h-3v2h3v3h2v-3h3v-2h-3v-3h1z" />
          </svg>
        </button>

        <button
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          title="Search files"
          style={{ color: '#858585' }}
          onClick={() => { setSidebarOpen(true); setTimeout(() => document.getElementById('sidebar-search')?.focus(), 100); }}
        >
          <SearchIcon className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        {/* Connection indicator */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          title={`Server: ${status}`}
          style={{
            background: status === 'connected' ? '#22c55e22' : '#ef444422',
            border: `1px solid ${status === 'connected' ? '#22c55e' : '#ef4444'}`,
          }}
        >
          <WifiIcon
            className="w-3.5 h-3.5"
            style={{ color: status === 'connected' ? '#22c55e' : status === 'connecting' ? '#eab308' : '#ef4444' }}
          />
        </div>

        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#0078d4', color: 'white' }}>
          N
        </div>
      </div>

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <div
        className="flex flex-col flex-shrink-0 overflow-hidden transition-all duration-200"
        style={{ width: sidebarOpen ? 260 : 0, minWidth: sidebarOpen ? 260 : 0, background: '#252526', borderRight: '1px solid #1e1e1e' }}
      >
        {sidebarOpen && (
          <>
            {/* Sidebar title */}
            <div className="flex items-center justify-between px-4 py-2 flex-shrink-0" style={{ height: 35 }}>
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#bbbbbb' }}>
                Explorer
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#3c3c3c', color: '#888' }}>
                <StatusDot status={status} />
              </span>
            </div>

            {/* CONTENT header */}
            <div className="flex items-center gap-1 px-2 py-1 flex-shrink-0" style={{ background: '#2d2d30' }}>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: '#cccccc' }} />
              <BookIcon className="w-4 h-4 mx-1" style={{ color: '#75beff' }} />
              <span className="text-[13px] font-medium uppercase tracking-wider flex-1" style={{ color: '#cccccc' }}>Content</span>
              <span className="text-[10px]" style={{ color: '#555' }}>{allFiles.length} files</span>
            </div>

            {/* Search */}
            <div className="px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid #3c3c3c' }}>
              <div className="flex items-center gap-2 rounded px-2 py-1" style={{ background: '#3c3c3c' }}>
                <SearchIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#888' }} />
                <input
                  id="sidebar-search"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search files…"
                  className="bg-transparent outline-none flex-1 text-[12px] placeholder-[#888]"
                  style={{ color: '#cccccc' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ color: '#888' }}>
                    <XIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#424242 transparent' }}>
              {tree.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  {status === 'connected' ? (
                    <>
                      <RefreshIcon className="w-8 h-8 mx-auto mb-3 opacity-30" />
                      <p className="text-[12px]" style={{ color: '#888' }}>No markdown files found</p>
                      <p className="text-[11px] mt-1" style={{ color: '#555' }}>Add .md files to the Content folder</p>
                    </>
                  ) : (
                    <>
                      <WifiIcon className="w-8 h-8 mx-auto mb-3 opacity-30" />
                      <p className="text-[12px]" style={{ color: '#888' }}>
                        {status === 'connecting' ? 'Connecting to server…' : 'Server disconnected'}
                      </p>
                      <p className="text-[11px] mt-1" style={{ color: '#555' }}>Run: node server/index.js</p>
                    </>
                  )}
                </div>
              ) : filteredFiles ? (
                filteredFiles.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[12px]" style={{ color: '#888' }}>No files found</div>
                ) : (
                  filteredFiles.map(node => (
                    <div
                      key={node.id}
                      onClick={() => handleSelectFile(node)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-1 cursor-pointer rounded-sm hover:bg-[#2a2d2e] transition-colors',
                        selectedId === node.id && 'bg-[#094771]'
                      )}
                    >
                      <MarkdownIcon className="w-4 h-4 flex-shrink-0 text-[#519aba]" />
                      <span className="text-[13px] truncate" style={{ color: '#cccccc' }}>{node.name}</span>
                    </div>
                  ))
                )
              ) : (
                tree.map(node => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    depth={0}
                    selectedId={selectedId}
                    expandedIds={expandedIds}
                    onSelect={handleSelectFile}
                    onToggle={handleToggleFolder}
                    searchQuery=""
                  />
                ))
              )}
            </div>

            {/* Live event bottom strip */}
            <div className="px-3 py-2 flex-shrink-0 text-[11px] truncate" style={{ color: '#888', borderTop: '1px solid #3c3c3c' }}>
              {lastEvent ?? `${allFiles.length} notes · ${tree.length} folders`}
            </div>
          </>
        )}
      </div>

      {/* ── Editor Area ───────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Tab Bar */}
        <div className="flex items-center flex-shrink-0 overflow-x-auto" style={{ background: '#252526', borderBottom: '1px solid #1e1e1e', height: 35, scrollbarWidth: 'none' }}>
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="px-3 h-full flex items-center hover:bg-white/10 flex-shrink-0"
              style={{ color: '#858585' }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
          {tabs.length === 0 && (
            <span className="px-4 text-[12px]" style={{ color: '#888' }}>No file open</span>
          )}
          {tabs.map(tab => (
            <div
              key={tab.node.id}
              onClick={() => handleSwitchTab(tab.node)}
              className={cn('flex items-center gap-2 px-3 h-full cursor-pointer flex-shrink-0 border-r group hover:bg-[#2d2d2d] transition-colors')}
              style={{
                borderRightColor: '#1e1e1e',
                background: activeTab === tab.node.id ? '#1e1e1e' : '#2d2d2d',
                borderTop: activeTab === tab.node.id ? '1px solid #0078d4' : '1px solid transparent',
                maxWidth: 160,
              }}
            >
              <MarkdownIcon className="w-3.5 h-3.5 flex-shrink-0 text-[#519aba]" />
              <span className="text-[12px] truncate" style={{ color: activeTab === tab.node.id ? '#ffffff' : '#bbbbbb' }}>
                {tab.node.name.replace('.md', '')}
              </span>
              <button
                onClick={(e) => handleCloseTab(tab.node.id, e)}
                className="w-4 h-4 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 flex-shrink-0 hover:bg-white/20 transition-all"
                style={{ color: '#cccccc' }}
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Breadcrumb */}
        {activeNode && (
          <div className="flex items-center gap-1 px-4 flex-shrink-0 text-[12px] overflow-x-auto" style={{ background: '#1e1e1e', borderBottom: '1px solid #252526', height: 22, scrollbarWidth: 'none' }}>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1 whitespace-nowrap" style={{ color: i === breadcrumb.length - 1 ? '#cccccc' : '#888' }}>
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                {crumb}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto" 
          style={{ background: '#1e1e1e', scrollbarWidth: 'thin', scrollbarColor: '#424242 transparent' }}
        >
          {loadingFile ? (
            <div className="flex items-center justify-center h-full gap-3" style={{ color: '#888' }}>
              <RefreshIcon className="w-5 h-5 animate-spin" />
              <span className="text-[13px]">Loading…</span>
            </div>
          ) : activeNode ? (
            <div className="max-w-4xl mx-auto px-8 py-10 pb-24">
              <article className="markdown-body">
                <VirtualizedMarkdown 
                  content={activeContent}
                  currentFolder={activeNode?.path ? activeNode.path.split('/').slice(0, -1).join('/') : ''}
                />
              </article>
            </div>
          ) : (
            /* Welcome */
            <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center">
              <div>
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl mx-auto mb-4" style={{ background: '#252526' }}>
                  <BookIcon className="w-10 h-10" style={{ color: '#0078d4' }} />
                </div>
                <h1 className="text-2xl font-semibold mb-2" style={{ color: '#cccccc' }}>My Notes</h1>
                <p className="text-sm mb-1" style={{ color: '#888' }}>Select a file from the explorer to start reading</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <StatusDot status={status} />
                  <span className="text-[12px]" style={{ color: '#888' }}>
                    {status === 'connected'
                      ? `Watching Content folder for changes`
                      : status === 'connecting'
                      ? 'Connecting to server…'
                      : 'Start the server: node server/index.js'}
                  </span>
                </div>
              </div>

              {/* Quick open */}
              {allFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                  {allFiles.slice(0, 4).map(file => (
                    <button
                      key={file.id}
                      onClick={() => handleSelectFile(file)}
                      className="flex items-center gap-3 p-3 rounded-lg text-left hover:bg-[#2d2d2d] transition-colors"
                      style={{ background: '#252526', border: '1px solid #3c3c3c' }}
                    >
                      <MarkdownIcon className="w-5 h-5 flex-shrink-0 text-[#519aba]" />
                      <div className="min-w-0">
                        <div className="text-[12px] font-medium truncate" style={{ color: '#cccccc' }}>
                          {file.name.replace('.md', '')}
                        </div>
                        <div className="text-[11px]" style={{ color: '#888' }}>
                          {file.id.split('/').slice(0, -1).join('/')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 flex-shrink-0 text-[11px]" style={{ background: '#0078d4', height: 22, color: 'rgba(255,255,255,0.9)' }}>
          <div className="flex items-center gap-4">
            <span>📓 Notes</span>
            {activeNode && <span>{activeNode.name}</span>}
          </div>
          <div className="flex items-center gap-4">
            <StatusDot status={status} />
            <span>Markdown</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
}