import { useMemo, useState, useEffect, useRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import LazyImport from './LazyImport';
import LazyCodeBlock from './LazyCodeBlock';
import MermaidDiagram from './MermaidDiagram';

// ──────────────────────────────────────────────────────────────────────
// SMART ANCHOR LINK HANDLER
// Waits for lazy content to load, then scrolls
// ──────────────────────────────────────────────────────────────────────
async function scrollToAnchor(targetId, maxAttempts = 30) {
  // Try immediate find first
  let element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  // Element not found - force-load all hidden chunks
  window.dispatchEvent(new CustomEvent('force-load-all-chunks'));
  
  // Wait for content to render, then check again
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    element = document.getElementById(targetId);
    
    if (element) {
      // Wait a tiny bit more for layout to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    }
  }
  
  // Last resort: try matching by heading text
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  for (const h of headings) {
    const slug = h.textContent.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    if (slug === targetId || slug.includes(targetId)) {
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    }
  }
  
  console.warn(`Anchor not found: #${targetId}`);
  return false;
}

const handleLinkClick = async (e) => {
  const href = e.currentTarget.getAttribute('href');
  if (href && href.startsWith('#')) {
    e.preventDefault();
    const targetId = decodeURIComponent(href.slice(1));
    await scrollToAnchor(targetId);
  }
};

// ──────────────────────────────────────────────────────────────────────
// Markdown component overrides
// ──────────────────────────────────────────────────────────────────────
const markdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');
    const trimmed = code.trim();

    // Detect mermaid
    const isMermaid = language === 'mermaid' || 
        trimmed.startsWith('flowchart') ||
        trimmed.startsWith('graph ') ||
        trimmed.startsWith('sequenceDiagram') ||
        trimmed.startsWith('classDiagram') ||
        /^%%\{[\s\S]*?%%\s*(flowchart|graph|sequenceDiagram|classDiagram)/.test(trimmed);
    
    if (isMermaid) {
      return <MermaidDiagram chart={code} />;
    }

    if (!inline && language) {
      return <LazyCodeBlock code={code} language={language} />;
    }

    return (
      <code 
        style={{
          background: '#2d2d2d',
          color: '#e06c75',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.9em',
          fontFamily: 'Cascadia Code, Consolas, monospace',
        }}
        {...props}
      >
        {children}
      </code>
    );
  },

  a({ node, children, href, ...props }) {
    return (
      <a 
        href={href} 
        onClick={handleLinkClick}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },

  img({ node, ...props }) {
    return (
      <img 
        loading="lazy"
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', margin: '12px 0' }}
        {...props}
      />
    );
  },

  table({ node, children, ...props }) {
    return (
      <div style={{ overflowX: 'auto', margin: '16px 0' }}>
        <table {...props}>{children}</table>
      </div>
    );
  },
};

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
// AGGRESSIVE SPLITTING
// ──────────────────────────────────────────────────────────────────────
function splitContent(content, currentFolder) {
  if (!content) return [];
  
  const parts = [];
  const importRegex = /^@import\s+["'](.+?)["']\s*;?\s*$/gm;
  
  let lastIndex = 0;
  let match;
  const sections = [];
  
  while ((match = importRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const chunk = content.slice(lastIndex, match.index).trim();
      if (chunk) sections.push({ type: 'markdown', content: chunk });
    }
    sections.push({ 
      type: 'import', 
      path: resolveImportPath(match[1], currentFolder) 
    });
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < content.length) {
    const chunk = content.slice(lastIndex).trim();
    if (chunk) sections.push({ type: 'markdown', content: chunk });
  }
  
  if (sections.length === 0) {
    sections.push({ type: 'markdown', content });
  }
  
  const MAX_CHUNK_SIZE = 1500;
  let chunkIndex = 0;
  
  for (const section of sections) {
    if (section.type === 'import') {
      parts.push({ ...section, key: `import-${chunkIndex++}` });
      continue;
    }
    
    if (section.content.length <= MAX_CHUNK_SIZE) {
      parts.push({ 
        type: 'markdown', 
        content: section.content, 
        key: `md-${chunkIndex++}` 
      });
      continue;
    }
    
    const subParts = section.content.split(/(?=^#{1,3}\s+|^---\s*$)/m).filter(s => s.trim());
    
    let currentGroup = '';
    for (const sub of subParts) {
      if (currentGroup.length + sub.length > MAX_CHUNK_SIZE && currentGroup.length > 0) {
        parts.push({ 
          type: 'markdown', 
          content: currentGroup.trim(), 
          key: `md-${chunkIndex++}` 
        });
        currentGroup = sub;
      } else {
        currentGroup += (currentGroup ? '\n\n' : '') + sub;
      }
    }
    
    if (currentGroup.trim()) {
      parts.push({ 
        type: 'markdown', 
        content: currentGroup.trim(), 
        key: `md-${chunkIndex++}` 
      });
    }
  }
  
  return parts;
}

// ──────────────────────────────────────────────────────────────────────
// VIRTUAL CHUNK - Listens for force-load event for anchor navigation
// ──────────────────────────────────────────────────────────────────────
const VirtualChunk = memo(function VirtualChunk({ children, estimatedHeight = 200 }) {
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef(null);

  // Listen for force-load event (when user clicks anchor link)
  useEffect(() => {
    const handleForceLoad = () => setShouldRender(true);
    window.addEventListener('force-load-all-chunks', handleForceLoad);
    return () => window.removeEventListener('force-load-all-chunks', handleForceLoad);
  }, []);

  // Intersection observer for scroll-based loading
  useEffect(() => {
    if (!ref.current || shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px', threshold: 0 }
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
// Memoized markdown chunk
// ──────────────────────────────────────────────────────────────────────
const MarkdownChunk = memo(function MarkdownChunk({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
});

// ──────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────
const MarkdownRenderer = ({ content, currentFolder = '' }) => {
  const parts = useMemo(
    () => splitContent(content, currentFolder), 
    [content, currentFolder]
  );

  const IMMEDIATE_RENDER_COUNT = 1;

  return (
    <>
      {parts.map((part, index) => {
        const isImmediate = index < IMMEDIATE_RENDER_COUNT;
        
        const partContent = part.type === 'import' 
          ? <LazyImport path={part.path} />
          : <MarkdownChunk content={part.content} />;

        if (isImmediate) {
          return <div key={part.key}>{partContent}</div>;
        }

        return (
          <VirtualChunk 
            key={part.key} 
            estimatedHeight={part.type === 'import' ? 100 : 150}
          >
            {partContent}
          </VirtualChunk>
        );
      })}
    </>
  );
};

export default memo(MarkdownRenderer);