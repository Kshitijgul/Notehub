import { useState, useEffect, useRef, memo } from 'react';
import VirtualizedMarkdown from './VirtualizedMarkdown';

const API = window.location.protocol === 'https:' 
  ? window.location.origin 
  : 'http://localhost:3001';

// Global cache so files aren't re-fetched
const cache = new Map();

function getFolderFromPath(path) {
  const parts = path.split('/');
  parts.pop();
  return parts.join('/');
}

function LazyImport({ path }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  // Listen for force-load event (anchor link navigation)
  useEffect(() => {
    const handleForceLoad = () => setIsVisible(true);
    window.addEventListener('force-load-all-chunks', handleForceLoad);
    return () => window.removeEventListener('force-load-all-chunks', handleForceLoad);
  }, []);

  // Watch for visibility
  useEffect(() => {
    if (!ref.current || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  // Load when visible
  useEffect(() => {
    if (!isVisible || content !== null) return;

    if (cache.has(path)) {
      setContent(cache.get(path));
      return;
    }

    setLoading(true);
    fetch(`${API}/api/file?path=${encodeURIComponent(path)}`)
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          cache.set(path, data.content);
          setContent(data.content);
        } else {
          setError(data.error || 'File not found');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [isVisible, path, content]);

  if (error) {
    return (
      <div ref={ref} style={{
        padding: '12px 16px',
        margin: '12px 0',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #ef4444',
        borderRadius: '6px',
        color: '#fca5a5',
        fontSize: '13px',
      }}>
        ⚠️ <strong>Missing:</strong> <code>{path}</code>
        <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>{error}</div>
      </div>
    );
  }

  if (!isVisible || loading || !content) {
    return (
      <div ref={ref} style={{
        padding: '20px',
        margin: '16px 0',
        background: '#1e1e1e',
        border: '1px dashed #3c3c3c',
        borderRadius: '6px',
        color: '#858585',
        textAlign: 'center',
        fontSize: '13px',
        fontStyle: 'italic',
        minHeight: '80px',
      }}>
        {loading ? '⏳ Loading' : '👁️ Scroll to load'}: <code>{path.split('/').pop()}</code>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ margin: '16px 0' }}>
      <VirtualizedMarkdown 
        content={content} 
        currentFolder={getFolderFromPath(path)} 
      />
    </div>
  );
}

export default memo(LazyImport);