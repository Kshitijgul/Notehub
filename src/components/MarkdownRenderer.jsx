import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { visit } from 'unist-util-visit';

// Load Mermaid from CDN (avoids bundling 3MB library)
const loadMermaid = () => {
  return new Promise((resolve, reject) => {
    if (window.mermaid) {
      resolve(window.mermaid);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.onload = () => {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        darkMode: true,
        themeVariables: {
          primaryColor: '#1f5f9e',
          primaryTextColor: '#fff',
          primaryBorderColor: '#01579b',
          lineColor: '#66b3ff',
          secondaryColor: '#1e3a5f',
          tertiaryColor: '#2d5a87'
        }
      });
      resolve(window.mermaid);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Mermaid Diagram Component
const MermaidDiagram = ({ chart }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    const render = async () => {
      try {
        setLoading(true);
        setError(null);
        const mermaid = await loadMermaid();
        if (cancelled) return;
        
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled) {
          setSvg(svg);
          setLoading(false);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (!cancelled) {
          setError(err.message || 'Failed to render diagram');
          setLoading(false);
        }
      }
    };
    
    render();
    return () => { cancelled = true; };
  }, [chart]);

  if (loading) return <div className="mermaid-loading">Loading diagram...</div>;
  if (error) return (
    <div className="mermaid-error">
      <strong>Diagram Error:</strong> {error}
      <pre style={{ marginTop: '10px', fontSize: '12px', opacity: 0.8 }}>{chart.substring(0, 200)}...</pre>
    </div>
  );
  
  return <div className="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />;
};

// Plugin to detect mermaid code blocks
const remarkMermaid = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      const value = node.value || '';
      const trimmed = value.trim();
      
      // Check if it's mermaid
      const isMermaid = node.lang === 'mermaid' || 
          trimmed.startsWith('flowchart') ||
          trimmed.startsWith('graph ') ||
          trimmed.startsWith('sequenceDiagram') ||
          trimmed.startsWith('classDiagram') ||
          trimmed.startsWith('stateDiagram') ||
          trimmed.startsWith('erDiagram') ||
          trimmed.startsWith('gantt') ||
          trimmed.startsWith('pie') ||
          trimmed.startsWith('gitGraph') ||
          trimmed.startsWith('mindmap') ||
          // Match %%{init:...}%% followed by diagram type
          /^%%\{[\s\S]*?%%\s*(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap)/.test(trimmed);
      
      if (isMermaid) {
        node.data = { hProperties: { className: ['mermaid'] } };
        node.lang = 'mermaid'; // Force language to mermaid
      }
    });
  };
};

// Handle internal links (smooth scroll)
const handleLinkClick = (e) => {
  const href = e.currentTarget.getAttribute('href');
  if (href && href.startsWith('#')) {
    e.preventDefault();
    const targetId = href.slice(1);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Try finding by heading text
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      for (const h of headings) {
        if (h.textContent.toLowerCase().includes(targetId.toLowerCase().replace(/-/g, ' '))) {
          h.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        }
      }
    }
  }
};

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMermaid]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          const code = String(children).replace(/\n$/, '');

          // Render Mermaid diagrams - improved detection
          const trimmedCode = code.trim();
          const isMermaid = language === 'mermaid' || 
              trimmedCode.startsWith('flowchart') ||
              trimmedCode.startsWith('graph ') ||
              trimmedCode.startsWith('sequenceDiagram') ||
              trimmedCode.startsWith('classDiagram') ||
              trimmedCode.startsWith('stateDiagram') ||
              trimmedCode.startsWith('erDiagram') ||
              trimmedCode.startsWith('gantt') ||
              trimmedCode.startsWith('pie') ||
              trimmedCode.startsWith('gitGraph') ||
              trimmedCode.startsWith('mindmap') ||
              // Match %%{init:...}%% followed by diagram type
              /^%%\{[\s\S]*?%%\s*(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap)/.test(trimmedCode);
          
          if (isMermaid) {
            return <MermaidDiagram chart={code} />;
          }

          if (!inline && language) {
            return (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                {...props}
              >
                {code}
              </SyntaxHighlighter>
            );
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        a({ node, children, href, ...props }) {
          return (
            <a 
              href={href} 
              onClick={handleLinkClick}
              {...props}
            >
              {children}
            </a>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
