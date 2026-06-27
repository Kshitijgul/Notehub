import { useMemo, useState, useEffect, useRef, memo } from 'react';
import LazyImport from './LazyImport';
// ──────────────────────────────────────────────────────────────────────
// Load marked from CDN (no npm install needed)
// ──────────────────────────────────────────────────────────────────────
let markedPromise = null;
function loadMarked() {
  if (markedPromise) return markedPromise;
  
  markedPromise = new Promise((resolve, reject) => {
    if (window.marked) {
      resolve(window.marked);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked@11/marked.min.js';
    script.onload = () => {
      const { marked } = window;
      
      // Configure marked
      marked.setOptions({
        gfm: true,
        breaks: false,
        headerIds: true,
        mangle: false,
      });
      
      // Custom renderer for heading IDs
      const renderer = new marked.Renderer();
      renderer.heading = function(text, level, raw) {
        const slug = String(raw || text)
          .toLowerCase()
          .trim()
          .replace(/<[!\/a-z].*?>/gi, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        return `<h${level} id="${slug}">${text}</h${level}>`;
      };
      
      marked.use({ renderer });
      resolve(marked);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
  
  return markedPromise;
}
// ──────────────────────────────────────────────────────────────────────
// Smart anchor link handler
// ──────────────────────────────────────────────────────────────────────
async function scrollToAnchor(targetId, maxAttempts = 30) {
  let element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  window.dispatchEvent(new CustomEvent('force-load-all-chunks'));
  
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    element = document.getElementById(targetId);
    if (element) {
      await new Promise(resolve => setTimeout(resolve, 100));
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    }
  }
  
  return false;
}
// Global click handler for anchor links (attached once)
let clickHandlerAttached = false;
function attachGlobalLinkHandler() {
  if (clickHandlerAttached) return;
  clickHandlerAttached = true;
  
  document.addEventListener('click', async (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      e.preventDefault();
      const targetId = decodeURIComponent(link.getAttribute('href').slice(1));
      await scrollToAnchor(targetId);
    }
  });
}
// ──────────────────────────────────────────────────────────────────────
// Load Mermaid from CDN
// ──────────────────────────────────────────────────────────────────────
let mermaidPromise = null;
function loadMermaid() {
  if (mermaidPromise) return mermaidPromise;
  mermaidPromise = new Promise((resolve, reject) => {
    if (window.mermaid) {
      resolve(window.mermaid);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.onload = () => {
      window.mermaid.initialize({ startOnLoad: false, theme: 'dark' });
      resolve(window.mermaid);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return mermaidPromise;
}
// ──────────────────────────────────────────────────────────────────────
// Render mermaid into a DOM element (lazy)
// ──────────────────────────────────────────────────────────────────────
async function renderMermaidInto(element, chart) {
  const observer = new IntersectionObserver(async ([entry], obs) => {
    if (!entry.isIntersecting) return;
    obs.disconnect();
    
    try {
      element.innerHTML = `
        <div style="padding: 20px; background: #1a1a2e; border-radius: 8px; text-align: center; color: #858585; font-style: italic;">
          Rendering diagram...
        </div>
      `;
      const mermaid = await loadMermaid();
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      const { svg } = await mermaid.render(id, chart);
      element.innerHTML = `<div style="margin: 16px 0; padding: 20px; background: #1a1a2e; border-radius: 8px; text-align: center;">${svg}</div>`;
    } catch (err) {
      element.innerHTML = `<div style="padding: 12px; background: rgba(239,68,68,0.1); border: 1px solid #ef4444; border-radius: 6px; color: #fca5a5;">⚠️ Diagram Error: ${err.message}</div>`;
    }
  }, { rootMargin: '200px' });
  
  observer.observe(element);
}
// ──────────────────────────────────────────────────────────────────────
// Parse markdown with marked
// ──────────────────────────────────────────────────────────────────────
async function parseMarkdownFast(content) {
  if (!content) return { html: '', mermaidBlocks: [] };
  
  const mermaidBlocks = [];
  
  // Extract mermaid blocks first
  const processedContent = content.replace(
    /```(mermaid|flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap)?\n([\s\S]*?)```/g,
    (match, lang, code) => {
      const trimmed = code.trim();
      const isMermaid = lang === 'mermaid' || 
          trimmed.startsWith('flowchart') ||
          trimmed.startsWith('graph ') ||
          trimmed.startsWith('sequenceDiagram') ||
          trimmed.startsWith('classDiagram') ||
          /^%%\{[\s\S]*?%%\s*(flowchart|graph|sequenceDiagram|classDiagram)/.test(trimmed);
      
      if (isMermaid) {
        const id = mermaidBlocks.length;
        mermaidBlocks.push(code.trim());
        return `<div data-mermaid-id="${id}"></div>`;
      }
      return match;
    }
  );
  
  const marked = await loadMarked();
  const html = marked.parse(processedContent);
  
  return { html, mermaidBlocks };
}
// ──────────────────────────────────────────────────────────────────────
// Resolve relative @import paths
// ──────────────────────────────────────────────────────────────────────
function resolveImportPath(importPath, currentFolder) {
  let resolved;
  const clean = importPath.trim();
  
  if (clean.startsWith('./')) {
    resolved = currentFolder ? `${currentFolder}/${clean.slice(2)}` : clean.slice(2);
  } else if (clean.startsWith('/')) {
    resolved = clean.slice(1);
  } else if (clean.startsWith('../')) {
    const parts = currentFolder.split('/');
    let p = clean;
    while (p.startsWith('../')) {
      parts.pop();
      p = p.slice(3);
    }
    resolved = parts.length > 0 ? `${parts.join('/')}/${p}` : p;
  } else {
    resolved = currentFolder ? `${currentFolder}/${clean}` : clean;
  }
  
  return resolved.replace(/\/+/g, '/');
}
// ──────────────────────────────────────────────────────────────────────
// Split content on @import lines
// ──────────────────────────────────────────────────────────────────────
function splitContent(content, currentFolder) {
  if (!content) return [];
  
  const parts = [];
  const importRegex = /^@import\s+["'](.+?)["']\s*;?\s*$/gm;
  let lastIndex = 0;
  let match;
  let idx = 0;
  
  while ((match = importRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const chunk = content.slice(lastIndex, match.index).trim();
      if (chunk) parts.push({ type: 'markdown', content: chunk, key: `md-${idx++}` });
    }
    parts.push({ 
      type: 'import', 
      path: resolveImportPath(match[1], currentFolder),
      key: `import-${idx++}`,
    });
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < content.length) {
    const chunk = content.slice(lastIndex).trim();
    if (chunk) parts.push({ type: 'markdown', content: chunk, key: `md-${idx++}` });
  }
  
  if (parts.length === 0 && content) {
    parts.push({ type: 'markdown', content, key: 'md-0' });
  }
  
  return parts;
}
// ──────────────────────────────────────────────────────────────────────
// FAST markdown chunk - uses dangerouslySetInnerHTML
// ──────────────────────────────────────────────────────────────────────
const FastMarkdownChunk = memo(function FastMarkdownChunk({ content }) {
  const containerRef = useRef(null);
  const [html, setHtml] = useState('');
  const [mermaidBlocks, setMermaidBlocks] = useState([]);
  // Parse markdown (async because marked loads from CDN)
  useEffect(() => {
    let cancelled = false;
    parseMarkdownFast(content).then(result => {
      if (!cancelled) {
        setHtml(result.html);
        setMermaidBlocks(result.mermaidBlocks);
      }
    });
    return () => { cancelled = true; };
  }, [content]);
  // Mount Mermaid diagrams after HTML is rendered
  useEffect(() => {
    if (!containerRef.current || mermaidBlocks.length === 0) return;
    
    const placeholders = containerRef.current.querySelectorAll('[data-mermaid-id]');
    placeholders.forEach(el => {
      const id = parseInt(el.getAttribute('data-mermaid-id'), 10);
      const chart = mermaidBlocks[id];
      if (chart && !el.hasAttribute('data-mounted')) {
        el.setAttribute('data-mounted', 'true');
        renderMermaidInto(el, chart);
      }
    });
  }, [html, mermaidBlocks]);
  if (!html) {
    return (
      <div style={{ padding: '12px', color: '#666', fontStyle: 'italic', fontSize: '13px' }}>
        ⏳ Parsing...
      </div>
    );
  }
  return (
    <div 
      ref={containerRef}
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
});
// ──────────────────────────────────────────────────────────────────────
// LAZY CHUNK - only renders when in viewport
// ──────────────────────────────────────────────────────────────────────
const LazyChunk = memo(function LazyChunk({ children, estimatedHeight = 300 }) {
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = () => setShouldRender(true);
    window.addEventListener('force-load-all-chunks', handler);
    return () => window.removeEventListener('force-load-all-chunks', handler);
  }, []);
  useEffect(() => {
    if (!ref.current || shouldRender) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px', threshold: 0 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [shouldRender]);
  if (!shouldRender) {
    return (
      <div 
        ref={ref} 
        style={{ 
          minHeight: estimatedHeight, 
          background: '#1a1a1a',
          border: '1px dashed #2a2a2a',
          borderRadius: '4px',
          margin: '4px 0',
        }}
      />
    );
  }
  return <div ref={ref}>{children}</div>;
});
// ──────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────
function VirtualizedMarkdown({ content, currentFolder = '' }) {
  // Attach global link handler once
  useEffect(() => {
    attachGlobalLinkHandler();
    // Preload marked
    loadMarked();
  }, []);
  // Instant synchronous split
  const parts = useMemo(
    () => splitContent(content, currentFolder), 
    [content, currentFolder]
  );
  if (parts.length === 0) return null;
  return (
    <>
      {parts.map((part, index) => {
        const partContent = part.type === 'import' 
          ? <LazyImport path={part.path} />
          : <FastMarkdownChunk content={part.content} />;
        // First chunk renders immediately
        if (index === 0) {
          return <div key={part.key}>{partContent}</div>;
        }
        // Other chunks lazy load
        return (
          <LazyChunk 
            key={part.key} 
            estimatedHeight={part.type === 'import' ? 100 : 300}
          >
            {partContent}
          </LazyChunk>
        );
      })}
    </>
  );
}
export default memo(VirtualizedMarkdown);