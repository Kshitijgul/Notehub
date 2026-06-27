import { useState } from 'react';

// Load html2pdf from CDN (no npm install needed)
const loadHtml2Pdf = () => {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) {
      resolve(window.html2pdf);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => resolve(window.html2pdf);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export default function PdfExporter({ contentRef, fileName = 'document' }) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState('');

  const exportToPdf = async () => {
    if (!contentRef.current) return;

    try {
      setExporting(true);
      setProgress('📥 Loading export library...');
      
      const html2pdf = await loadHtml2Pdf();

      // Step 1: Force-load all lazy imports
      setProgress('📚 Expanding all chapters...');
      await expandAllLazyImports(contentRef.current);

      // Step 2: Wait for all mermaid diagrams to render
      setProgress('📊 Rendering diagrams...');
      await waitForMermaid();

      // Step 3: Wait for all images to load
      setProgress('🖼️ Loading images...');
      await waitForImages(contentRef.current);

      // Step 4: Clone the content for printing
      setProgress('📄 Generating PDF...');
      const clone = prepareCloneForPdf(contentRef.current);

      // Step 5: Generate PDF
      const opt = {
        margin: [15, 15, 15, 15],
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          backgroundColor: '#1e1e1e',
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true,
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: ['pre', 'img', 'table', 'h1', 'h2', 'h3']
        }
      };

      await html2pdf().set(opt).from(clone).save();
      
      setProgress('✅ Done!');
      setTimeout(() => {
        setExporting(false);
        setProgress('');
      }, 1000);
      
    } catch (err) {
      console.error('PDF export error:', err);
      setProgress(`❌ Error: ${err.message}`);
      setTimeout(() => {
        setExporting(false);
        setProgress('');
      }, 3000);
    }
  };

  return (
    <>
      <button
        onClick={exportToPdf}
        disabled={exporting}
        style={{
          padding: '8px 16px',
          background: exporting ? '#374151' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: exporting ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => !exporting && (e.target.style.background = '#1d4ed8')}
        onMouseLeave={e => !exporting && (e.target.style.background = '#2563eb')}
      >
        {exporting ? '⏳' : '📥'} {exporting ? 'Exporting...' : 'Export PDF'}
      </button>

      {/* Progress overlay */}
      {exporting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#1e1e1e',
            border: '1px solid #3c3c3c',
            borderRadius: '12px',
            padding: '32px 40px',
            textAlign: 'center',
            minWidth: '300px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              fontSize: '40px',
              marginBottom: '16px',
              animation: 'spin 2s linear infinite',
              display: 'inline-block',
            }}>📄</div>
            <div style={{
              color: '#fff',
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '8px',
            }}>Generating PDF</div>
            <div style={{
              color: '#9ca3af',
              fontSize: '13px',
            }}>{progress}</div>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────
// HELPER: Force-load all lazy imports by scrolling
// ──────────────────────────────────────────────────────────────────────
async function expandAllLazyImports(container) {
  // Find all lazy import placeholders
  const findPlaceholders = () => container.querySelectorAll('[data-lazy-import-placeholder]');
  
  let attempts = 0;
  const maxAttempts = 50;
  
  // Dispatch event to trigger loading
  window.dispatchEvent(new CustomEvent('force-load-all-imports'));
  
  // Wait for all lazy imports to load
  while (attempts < maxAttempts) {
    const placeholders = findPlaceholders();
    if (placeholders.length === 0) break;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    attempts++;
  }
  
  // Extra wait for content to settle
  await new Promise(resolve => setTimeout(resolve, 500));
}

// ──────────────────────────────────────────────────────────────────────
// HELPER: Wait for Mermaid diagrams to finish rendering
// ──────────────────────────────────────────────────────────────────────
async function waitForMermaid() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Wait until no "Loading diagram" text exists
  let attempts = 0;
  while (attempts < 20) {
    const loadingDiagrams = document.querySelectorAll('[data-mermaid-loading]');
    if (loadingDiagrams.length === 0) break;
    await new Promise(resolve => setTimeout(resolve, 300));
    attempts++;
  }
}

// ──────────────────────────────────────────────────────────────────────
// HELPER: Wait for all images to load
// ──────────────────────────────────────────────────────────────────────
async function waitForImages(container) {
  const images = container.querySelectorAll('img');
  const promises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
      setTimeout(resolve, 3000); // 3s timeout per image
    });
  });
  await Promise.all(promises);
}

// ──────────────────────────────────────────────────────────────────────
// HELPER: Prepare a clone with PDF-optimized styles
// ──────────────────────────────────────────────────────────────────────
function prepareCloneForPdf(element) {
  const clone = element.cloneNode(true);
  
  // Apply PDF-friendly styling
  clone.style.background = '#ffffff';
  clone.style.color = '#1a1a1a';
  clone.style.padding = '20px';
  clone.style.maxWidth = '100%';
  clone.style.width = '210mm'; // A4 width
  
  // Override dark theme styles for print
  const styleOverride = document.createElement('style');
  styleOverride.textContent = `
    * { 
      color: #1a1a1a !important; 
      background-color: transparent !important;
    }
    h1, h2, h3, h4, h5, h6 { 
      color: #000 !important; 
      page-break-after: avoid;
      margin-top: 24px;
    }
    h1 { 
      page-break-before: always;
      border-bottom: 2px solid #333;
      padding-bottom: 8px;
    }
    h1:first-child { page-break-before: avoid; }
    pre, code { 
      background: #f5f5f5 !important;
      color: #1a1a1a !important;
      border: 1px solid #ddd !important;
      page-break-inside: avoid;
    }
    pre code { font-size: 11px !important; }
    table { 
      border-collapse: collapse;
      page-break-inside: avoid;
      width: 100%;
    }
    th, td { 
      border: 1px solid #ddd !important; 
      padding: 6px 10px !important;
      color: #1a1a1a !important;
    }
    th { background: #f0f0f0 !important; }
    blockquote { 
      border-left: 4px solid #2563eb !important;
      background: #f0f7ff !important;
      padding: 8px 16px;
      margin: 12px 0;
    }
    a { color: #2563eb !important; text-decoration: underline; }
    img { max-width: 100%; page-break-inside: avoid; }
    .mermaid-diagram, [class*="mermaid"] { 
      background: #fafafa !important;
      page-break-inside: avoid;
      padding: 12px;
      border-radius: 8px;
    }
    .mermaid-diagram svg { max-width: 100%; }
    
    /* Hide unwanted elements */
    .no-print, button { display: none !important; }
  `;
  clone.prepend(styleOverride);
  
  return clone;
}