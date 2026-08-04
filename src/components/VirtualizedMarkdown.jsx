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
// Load KaTeX from CDN for math rendering ($x^2$ and $$formula$$)
// ──────────────────────────────────────────────────────────────────────
let katexPromise = null;
function loadKatex() {
  if (katexPromise) return katexPromise;
  
  katexPromise = new Promise((resolve, reject) => {
    if (window.katex) {
      resolve(window.katex);
      return;
    }
    
    // Load KaTeX CSS
    if (!document.querySelector('link[href*="katex"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);
    }
    
    // Load KaTeX JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.onload = () => resolve(window.katex);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  
  return katexPromise;
}

// Preload KaTeX on page load
if (typeof window !== 'undefined') {
  setTimeout(() => loadKatex().catch(() => {}), 500);
}

/**
 * Render math formulas in HTML string
 * Handles both $$block$$ and $inline$ formulas
 */
function renderMath(html) {
  if (!window.katex) return html;
  
  // Render block math: $$...$$
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
    try {
      return window.katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
        errorColor: '#ef4444',
      });
    } catch (err) {
      return `<span style="color:#ef4444">Math error: ${err.message}</span>`;
    }
  });
  
  // Render inline math: $...$
  // Careful regex to avoid matching things like "$5 and $10"
  html = html.replace(/(?<!\$)\$([^\$\n]+?)\$(?!\$)/g, (match, formula) => {
    try {
      return window.katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
        errorColor: '#ef4444',
      });
    } catch (err) {
      return match; // Keep original if can't parse
    }
  });
  
  return html;
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
// Parse markdown with marked + KaTeX for math
// Extract code blocks & math BEFORE parsing to protect them
// ──────────────────────────────────────────────────────────────────────
async function parseMarkdownFast(content) {
  if (!content) return { html: '', mermaidBlocks: [] };
  
  const mermaidBlocks = [];
  const mathBlocks = [];  // Protected math formulas
  
  // ── STEP 1: Extract math BEFORE marked touches it ─────────────────────
  // Protect $$...$$ block math first
  let processedContent = content.replace(
    /\$\$([\s\S]+?)\$\$/g,
    (match, formula) => {
      const id = mathBlocks.length;
      mathBlocks.push({ formula: formula.trim(), block: true });
      return `\n\n<div data-math-id="${id}"></div>\n\n`;
    }
  );
  
  // Protect $...$ inline math (avoid matching $5 and $10)
  processedContent = processedContent.replace(
    /(?<![\$\w])\$([^\$\n]+?)\$(?![\$\w])/g,
    (match, formula) => {
      const id = mathBlocks.length;
      mathBlocks.push({ formula: formula.trim(), block: false });
      return `<span data-math-id="${id}"></span>`;
    }
  );
  
  // ── STEP 2: Extract mermaid code blocks ───────────────────────────────
  // More lenient regex - handles various line endings and edge cases
  const codeBlockRegex = /```([a-zA-Z0-9_+\-.]*)[ \t]*\r?\n([\s\S]*?)```/g;
  
  // All valid mermaid language tags
  const MERMAID_LANGUAGES = new Set([
    'mermaid', 'flowchart', 'graph', 'sequencediagram', 'classdiagram',
    'statediagram', 'erdiagram', 'gantt', 'pie', 'gitgraph', 'mindmap',
    'journey', 'timeline', 'quadrantchart', 'requirementdiagram',
    'sankey', 'block', 'c4context', 'zenuml', 'xy-chart',
  ]);
  
  // Content patterns that indicate mermaid
  const MERMAID_START_PATTERNS = [
    /^flowchart[\s\r\n]/i,
    /^graph[\s\r\n]/i,
    /^sequenceDiagram/i,
    /^classDiagram/i,
    /^stateDiagram/i,
    /^erDiagram/i,
    /^gantt/i,
    /^pie[\s\r\n]/i,
    /^gitGraph/i,
    /^mindmap/i,
    /^journey/i,
    /^timeline/i,
    /^%%\{[\s\S]*?%%[\s\r\n]*(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram)/i,
  ];
  
  processedContent = processedContent.replace(
    codeBlockRegex,
    (match, lang, code) => {
      const trimmed = (code || '').trim();
      const langLower = (lang || '').toLowerCase().trim();
      
      // Check by language tag (e.g., ```mermaid, ```flowchart, ```graph)
      const isLangMermaid = MERMAID_LANGUAGES.has(langLower);
      
      // Check by content (auto-detect even without lang tag)
      const isContentMermaid = MERMAID_START_PATTERNS.some(pattern => pattern.test(trimmed));
      
      const isMermaid = isLangMermaid || isContentMermaid;
      
      if (isMermaid) {
        // If lang tag is flowchart/graph/etc but content doesn't start with it,
        // we need to prepend the lang tag for mermaid to parse it correctly
        let mermaidCode = trimmed;
        if (isLangMermaid && langLower !== 'mermaid' && !isContentMermaid) {
          // e.g., ```flowchart\nTD\n... → prepend "flowchart TD\n..."
          mermaidCode = `${langLower === 'sequencediagram' ? 'sequenceDiagram' : 
                          langLower === 'classdiagram' ? 'classDiagram' :
                          langLower === 'statediagram' ? 'stateDiagram' :
                          langLower === 'erdiagram' ? 'erDiagram' :
                          langLower === 'gitgraph' ? 'gitGraph' :
                          langLower} ${trimmed}`;
        }
        
        const id = mermaidBlocks.length;
        mermaidBlocks.push(mermaidCode);
        console.log(`[Mermaid] Detected diagram (lang: "${langLower}", content start: "${trimmed.substring(0, 30)}...")`);
        return `\n\n<div data-mermaid-id="${id}" class="mermaid-placeholder"></div>\n\n`;
      }
      return match;
    }
  );
  
  // ── STEP 3: Parse markdown ────────────────────────────────────────────
  const marked = await loadMarked();
  let html = marked.parse(processedContent);
  
  // ── STEP 4: Render math with KaTeX ────────────────────────────────────
  if (mathBlocks.length > 0) {
    try {
      await loadKatex();
    } catch (err) {
      console.warn('KaTeX failed to load:', err);
    }
    
    // Replace math placeholders with rendered KaTeX
    html = html.replace(
      /<(div|span) data-math-id="(\d+)"><\/(div|span)>/g,
      (match, tag, id) => {
        const mathData = mathBlocks[parseInt(id, 10)];
        if (!mathData) return match;
        
        if (window.katex) {
          try {
            return window.katex.renderToString(mathData.formula, {
              displayMode: mathData.block,
              throwOnError: false,
              errorColor: '#ef4444',
            });
          } catch (err) {
            return `<span style="color:#ef4444">Math error: ${err.message}</span>`;
          }
        }
        // Fallback: show as code
        return `<code style="color:#e06c75">$${mathData.block ? '$' : ''}${mathData.formula}${mathData.block ? '$' : ''}$</code>`;
      }
    );
  }
  
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
