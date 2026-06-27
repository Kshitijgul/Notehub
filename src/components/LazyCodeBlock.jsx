import { useState, useEffect, useRef, lazy, Suspense } from 'react';

// Lazy load the syntax highlighter (huge library ~500KB)
const SyntaxHighlighter = lazy(async () => {
  const [{ Prism }, { vscDarkPlus }] = await Promise.all([
    import('react-syntax-highlighter'),
    import('react-syntax-highlighter/dist/esm/styles/prism'),
  ]);
  return {
    default: function StyledHighlighter({ code, language }) {
      return (
        <Prism
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{ 
            margin: '16px 0', 
            borderRadius: '8px', 
            fontSize: '14px',
            padding: '16px',
          }}
        >
          {code}
        </Prism>
      );
    }
  };
});

// Simple fallback code block (no syntax highlighting, but instant render)
function SimpleCodeBlock({ code, language }) {
  return (
    <div style={{ margin: '16px 0', position: 'relative' }}>
      {language && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: '4px 10px',
          fontSize: '11px',
          color: '#888',
          background: '#2d2d2d',
          borderRadius: '0 8px 0 6px',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          zIndex: 1,
        }}>
          {language}
        </div>
      )}
      <pre style={{
        background: '#1a1a1a',
        border: '1px solid #3c3c3c',
        borderRadius: '8px',
        padding: '16px 20px',
        overflowX: 'auto',
        margin: 0,
        fontFamily: 'Cascadia Code, Fira Code, Consolas, monospace',
        fontSize: '13px',
        lineHeight: 1.6,
        color: '#d4d4d4',
      }}>
        <code style={{ background: 'transparent', padding: 0, color: 'inherit' }}>
          {code}
        </code>
      </pre>
    </div>
  );
}

export default function LazyCodeBlock({ code, language }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

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

  // Show simple version until in viewport, then upgrade to syntax-highlighted
  if (!isVisible) {
    return (
      <div ref={ref}>
        <SimpleCodeBlock code={code} language={language} />
      </div>
    );
  }

  return (
    <div ref={ref}>
      <Suspense fallback={<SimpleCodeBlock code={code} language={language} />}>
        <SyntaxHighlighter code={code} language={language} />
      </Suspense>
    </div>
  );
}