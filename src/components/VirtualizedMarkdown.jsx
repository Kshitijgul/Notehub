import { useMemo, useState, useEffect, useRef, memo } from 'react';
import LazyImport from './LazyImport';

// ──────────────────────────────────────────────────────────────────────
// GitHub-compatible slug generator
// Handles &, special characters consistently
// ──────────────────────────────────────────────────────────────────────
function generateSlug(text) {
  return String(text)
    .toLowerCase()
    .trim()
    // Remove HTML tags
    .replace(/<[!\/a-z].*?>/gi, '')
    // Replace & with empty (matches GitHub behavior)
    .replace(/&/g, '')
    // Remove all other special characters except word chars, spaces, hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Collapse multiple hyphens into one
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '');
}

// Generate ALL possible slug variations for matching
function generateSlugVariations(text) {
  const variations = new Set();
  const clean = String(text).toLowerCase().trim().replace(/<[!\/a-z].*?>/gi, '');
  
  // Variation 1: Standard - & removed, special chars removed
  variations.add(clean
    .replace(/&/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  );
  
  // Variation 2: & → and
  variations.add(clean
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  );
  
  // Variation 3: & → empty, keep double dashes
  variations.add(clean
    .replace(/&/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-|-$/g, '')
  );
  
  // Variation 4: Keep & as-is (URL encoded later)
  variations.add(clean
    .replace(/[^\w\s&-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  );
  
  return Array.from(variations).filter(v => v.length > 0);
}

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
      
      // Custom renderer for heading IDs - generates multiple IDs for matching variations
      const renderer = new marked.Renderer();
      renderer.heading = function(text, level, raw) {
        const variations = generateSlugVariations(String(raw || text));
        const primaryId = variations[0] || 'heading';
        // Add invisible anchor tags for all alternate slugs
        const alternateAnchors = variations.slice(1)
          .map(slug => `<a id="${slug}" class="slug-anchor"></a>`)
          .join('');
        return `<h${level} id="${primaryId}">${alternateAnchors}${text}</h${level}>`;
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
// Smart anchor link handler - tries multiple ID variations
// ──────────────────────────────────────────────────────────────────────
function tryFindElement(targetId) {
  // Try exact match first
  let element = document.getElementById(targetId);
  if (element) return element;
  
  // Try URL-decoded
  try {
    const decoded = decodeURIComponent(targetId);
    element = document.getElementById(decoded);
    if (element) return element;
  } catch (e) {
    // Continue
  }
  
  // Try all variations of the slug
  const variations = generateSlugVariations(targetId);
  for (const slug of variations) {
    element = document.getElementById(slug);
    if (element) return element;
  }
  
  // Try matching by heading text content (last resort)
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const targetSlug = generateSlug(targetId);
  for (const h of headings) {
    const headingSlug = generateSlug(h.textContent);
    if (headingSlug === targetSlug || headingSlug.includes(targetSlug)) {
      return h;
    }
  }
  
  return null;
}

async function scrollToAnchor(targetId, maxAttempts = 30) {
  let element = tryFindElement(targetId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  window.dispatchEvent(new CustomEvent('force-load-all-chunks'));
  
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    element = tryFindElement(targetId);
    if (element) {
      await new Promise(resolve => setTimeout(resolve, 100));
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    }
  }
  
  console.warn(`Anchor not found: #${targetId}`);
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
// Extract ANY code block, then check if it's mermaid (more robust)
// ──────────────────────────────────────────────────────────────────────
async function parseMarkdownFast(content) {
  if (!content) return { html: '', mermaidBlocks: [] };
  
  const mermaidBlocks = [];
  
  // Robust regex: matches any fenced code block with optional language
  // - Handles \r\n (Windows) and \n (Unix) line endings
  // - Allows any language identifier
  // - Allows trailing whitespace after closing ```
  const codeBlockRegex = /```([a-zA-Z0-9_+-]*)[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*```/g;
  
  const processedContent = content.replace(
    codeBlockRegex,
    (match, lang, code) => {
      const trimmed = (code || '').trim();
      const langLower = (lang || '').toLowerCase();
      
      // Detect mermaid by language tag OR by content
      const isMermaid = 
          langLower === 'mermaid' || 
          trimmed.startsWith('flowchart ') ||
          trimmed.startsWith('flowchart\n') ||
          trimmed.startsWith('graph ') ||
          trimmed.startsWith('graph\n') ||
          trimmed.startsWith('sequenceDiagram') ||
          trimmed.startsWith('classDiagram') ||
          trimmed.startsWith('stateDiagram') ||
          trimmed.startsWith('erDiagram') ||
          trimmed.startsWith('gantt') ||
          trimmed.startsWith('pie') ||
          trimmed.startsWith('gitGraph') ||
          trimmed.startsWith('mindmap') ||
          trimmed.startsWith('journey') ||
          trimmed.startsWith('timeline') ||
          /^%%\{[\s\S]*?%%\s*\r?\n?\s*(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram)/.test(trimmed);
      
      if (isMermaid) {
        const id = mermaidBlocks.length;
        mermaidBlocks.push(trimmed);
        // Wrap with newlines so marked treats it as block-level HTML
        return `\n\n<div data-mermaid-id="${id}" class="mermaid-placeholder"></div>\n\n`;
      }
      return match; // Keep as-is if not mermaid
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
    
    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      
      const placeholders = containerRef.current.querySelectorAll('[data-mermaid-id]');
      console.log(`[Mermaid] Found ${placeholders.length}/${mermaidBlocks.length} placeholders`);
      
      placeholders.forEach(el => {
        const id = parseInt(el.getAttribute('data-mermaid-id'), 10);
        const chart = mermaidBlocks[id];
        if (chart && !el.hasAttribute('data-mounted')) {
          el.setAttribute('data-mounted', 'true');
          // If wrapped in <p>, unwrap it (marked sometimes wraps inline HTML)
          if (el.parentElement?.tagName === 'P' && el.parentElement.children.length === 1) {
            const p = el.parentElement;
            p.parentElement.insertBefore(el, p);
            p.remove();
          }
          renderMermaidInto(el, chart);
        }
      });
    }, 50);
    
    return () => clearTimeout(timer);
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