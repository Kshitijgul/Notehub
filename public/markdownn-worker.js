// Markdown parsing Web Worker
// Runs heavy parsing OFF the main thread

self.onmessage = function(e) {
  const { type, content, currentFolder, id } = e.data;
  
  if (type === 'SPLIT_CONTENT') {
    try {
      const parts = splitContent(content, currentFolder);
      self.postMessage({ type: 'SPLIT_RESULT', id, parts });
    } catch (err) {
      self.postMessage({ type: 'ERROR', id, error: err.message });
    }
  }
};

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
  
  const MAX_CHUNK_SIZE = 1200;
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
        key: `md-${chunkIndex++}`,
        estimatedHeight: estimateHeight(section.content),
      });
      continue;
    }
    
    // Split by headings or horizontal rules
    const subParts = section.content.split(/(?=^#{1,3}\s+|^---\s*$)/m).filter(s => s.trim());
    
    let currentGroup = '';
    for (const sub of subParts) {
      if (currentGroup.length + sub.length > MAX_CHUNK_SIZE && currentGroup.length > 0) {
        parts.push({ 
          type: 'markdown', 
          content: currentGroup.trim(), 
          key: `md-${chunkIndex++}`,
          estimatedHeight: estimateHeight(currentGroup),
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
        key: `md-${chunkIndex++}`,
        estimatedHeight: estimateHeight(currentGroup),
      });
    }
  }
  
  return parts;
}

// Estimate rendered height based on content
function estimateHeight(text) {
  const lines = text.split('\n').length;
  const hasTable = /\|.*\|/.test(text);
  const hasCode = /```/.test(text);
  
  let height = lines * 25;
  if (hasTable) height += 200;
  if (hasCode) height += 150;
  
  return Math.max(100, Math.min(height, 2000));
}