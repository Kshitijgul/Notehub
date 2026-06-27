import { useEffect, useState, useRef, memo } from 'react';
// Load Mermaid from CDN ONCE
let mermaidPromise = null;
const loadMermaid = () => {
  if (mermaidPromise) return mermaidPromise;
  
  mermaidPromise = new Promise((resolve, reject) => {
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
      });
      resolve(window.mermaid);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
  
  return mermaidPromise;
};
function MermaidDiagram({ chart }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  // Only render when visible
  useEffect(() => {
    if (!ref.current || isVisible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);
  // Render mermaid when visible
  useEffect(() => {
    if (!isVisible || svg) return;
    let cancelled = false;
    
    loadMermaid()
      .then(async (mermaid) => {
        if (cancelled) return;
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: result } = await mermaid.render(id, chart);
        if (!cancelled) setSvg(result);
      })
      .catch(err => !cancelled && setError(err.message));
    
    return () => { cancelled = true; };
  }, [isVisible, chart, svg]);
  if (error) {
    return (
      <div style={{
        padding: '12px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #ef4444',
        borderRadius: '6px',
        color: '#fca5a5',
        margin: '12px 0',
        fontSize: '13px',
      }}>
        ⚠️ Diagram Error: {error}
      </div>
    );
  }
  // FIXED: Render either SVG OR placeholder, not both
  if (svg) {
    return (
      <div 
        ref={ref}
        className="mermaid-diagram"
        style={{ 
          margin: '16px 0', 
          padding: '20px', 
          background: '#1a1a2e', 
          borderRadius: '8px',
          textAlign: 'center',
        }} 
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }
  return (
    <div 
      ref={ref}
      style={{ 
        margin: '16px 0', 
        padding: '20px', 
        background: '#1a1a2e', 
        borderRadius: '8px',
        textAlign: 'center',
        minHeight: '100px',
      }}
    >
      <div style={{ color: '#858585', fontStyle: 'italic' }}>
        {isVisible ? 'Rendering diagram...' : 'Diagram (scroll to render)'}
      </div>
    </div>
  );
}
export default memo(MermaidDiagram);