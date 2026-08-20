import React, { useState, useRef, useEffect } from 'react';

// Virtual Linux Filesystem representation
// Structure:
// /
// ├── logs/
// │   └── polyphemus_watch.log
// ├── archives/
// │   ├── trap_backup.zip
// │   └── cyclops_escape.zip -> contains key.txt ("OLYMPUS-ESCAPE-KEY-42")
// └── notes/
//     └── escape_plan.txt

function LinuxTerminal({ onKeyFound }) {
  const [history, setHistory] = useState([
    { type: 'system', text: '╔══════════════════════════════════════════════════════════╗' },
    { type: 'system', text: '║   CYBER-ODYSSEY LINUX SHELL v4.2 - CYCLOPS CHAMBER    ║' },
    { type: 'system', text: '║   Commands: ls, cd, pwd, cat, unzip, find, clear, help ║' },
    { type: 'system', text: '╚══════════════════════════════════════════════════════════╝' },
    { type: 'output', text: 'Hint: Locate and extract the escape archive to read the secret clearance key.' },
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('/home/odysseus');
  const [extractedFiles, setExtractedFiles] = useState({}); // path -> content
  const terminalEndRef = useRef(null);

  const fileSystem = {
    '/home/odysseus': {
      type: 'dir',
      children: ['notes', 'archives', 'logs']
    },
    '/home/odysseus/notes': {
      type: 'dir',
      children: ['escape_plan.txt']
    },
    '/home/odysseus/notes/escape_plan.txt': {
      type: 'file',
      content: 'Odysseus Log: Polyphemus locked the main vault password inside an encrypted archive under archives/cyclops_escape.zip.'
    },
    '/home/odysseus/archives': {
      type: 'dir',
      children: ['decoy_ancient.zip', 'cyclops_escape.zip']
    },
    '/home/odysseus/archives/decoy_ancient.zip': {
      type: 'file',
      isZip: true,
      zipContent: {
        'dummy.txt': 'Nothing here! This is an ancient decoy file.'
      }
    },
    '/home/odysseus/archives/cyclops_escape.zip': {
      type: 'file',
      isZip: true,
      zipContent: {
        'clearance_password.txt': 'SECRET_CLEARANCE_PASSWORD: NOBODY-CYCLOPS-42'
      }
    },
    '/home/odysseus/logs': {
      type: 'dir',
      children: ['cave_sensors.log']
    },
    '/home/odysseus/logs/cave_sensors.log': {
      type: 'file',
      content: '[WARN] Giant movement detected in lower quadrant. Security archives sealed in /archives.'
    }
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const resolvePath = (target) => {
    if (!target || target === '.') return currentPath;
    if (target === '..') {
      if (currentPath === '/home/odysseus') return '/home/odysseus';
      const parts = currentPath.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/');
    }
    if (target.startsWith('/')) return target;
    return `${currentPath === '/' ? '' : currentPath}/${target}`.replace(/\/+/g, '/');
  };

  const handleCommand = (e) => {
    e.preventDefault();
    const rawCmd = input.trim();
    if (!rawCmd) return;

    const newHistory = [...history, { type: 'input', text: `odysseus@cyclops-cave:${currentPath}$ ${rawCmd}` }];
    const parts = rawCmd.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts[1];

    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (cmd === 'help') {
      newHistory.push({
        type: 'output',
        text: 'Available commands:\n  ls [dir]        List directory contents\n  cd <dir>        Change working directory\n  pwd             Print working directory\n  cat <file>      Read file content\n  unzip <file>    Extract a zip archive\n  find . -name    Search for files (e.g. find . -name "*.zip")\n  clear           Clear terminal display'
      });
    } else if (cmd === 'pwd') {
      newHistory.push({ type: 'output', text: currentPath });
    } else if (cmd === 'ls') {
      const targetDir = arg ? resolvePath(arg) : currentPath;
      const dirObj = fileSystem[targetDir];
      if (!dirObj || dirObj.type !== 'dir') {
        newHistory.push({ type: 'error', text: `ls: cannot access '${arg || targetDir}': No such file or directory` });
      } else {
        // combine original children + extracted files in this dir
        const extractedInDir = Object.keys(extractedFiles)
          .filter(p => p.startsWith(targetDir + '/') && !p.replace(targetDir + '/', '').includes('/'))
          .map(p => p.split('/').pop());
        
        const allItems = [...new Set([...dirObj.children, ...extractedInDir])];
        newHistory.push({
          type: 'output',
          text: allItems.join('   ')
        });
      }
    } else if (cmd === 'cd') {
      if (!arg || arg === '~') {
        setCurrentPath('/home/odysseus');
      } else {
        const targetPath = resolvePath(arg);
        if (fileSystem[targetPath] && fileSystem[targetPath].type === 'dir') {
          setCurrentPath(targetPath);
        } else {
          newHistory.push({ type: 'error', text: `cd: no such file or directory: ${arg}` });
        }
      }
    } else if (cmd === 'find') {
      const zipFiles = [
        './archives/decoy_ancient.zip',
        './archives/cyclops_escape.zip'
      ];
      newHistory.push({
        type: 'output',
        text: zipFiles.join('\n')
      });
    } else if (cmd === 'unzip') {
      if (!arg) {
        newHistory.push({ type: 'error', text: 'unzip: missing archive filename. Usage: unzip <archive.zip>' });
      } else {
        const targetPath = resolvePath(arg);
        const fileObj = fileSystem[targetPath];
        if (!fileObj || !fileObj.isZip) {
          newHistory.push({ type: 'error', text: `unzip: cannot find or open ${arg}` });
        } else {
          const filesExtracted = fileObj.zipContent;
          const newExtracted = { ...extractedFiles };
          const logLines = [`Archive:  ${arg}`];

          Object.entries(filesExtracted).forEach(([fname, content]) => {
            const fullExtractedPath = `${currentPath}/${fname}`.replace(/\/+/g, '/');
            newExtracted[fullExtractedPath] = content;
            logLines.push(`  inflating: ${fname}`);
          });

          setExtractedFiles(newExtracted);
          newHistory.push({ type: 'output', text: logLines.join('\n') });
        }
      }
    } else if (cmd === 'cat') {
      if (!arg) {
        newHistory.push({ type: 'error', text: 'cat: missing file operand' });
      } else {
        const targetPath = resolvePath(arg);
        // check extracted files first
        if (extractedFiles[targetPath]) {
          const content = extractedFiles[targetPath];
          newHistory.push({ type: 'output', text: content });
          if (content.includes('NOBODY-CYCLOPS-42')) {
            newHistory.push({
              type: 'system',
              text: '🔑 PASSWORD DISCOVERED: Copy and paste "NOBODY-CYCLOPS-42" into the trial console below!'
            });
            if (onKeyFound) onKeyFound('NOBODY-CYCLOPS-42');
          }
        } else if (fileSystem[targetPath] && fileSystem[targetPath].type === 'file') {
          if (fileSystem[targetPath].isZip) {
            newHistory.push({ type: 'error', text: `cat: ${arg}: Binary file (use unzip to extract)` });
          } else {
            newHistory.push({ type: 'output', text: fileSystem[targetPath].content });
          }
        } else {
          newHistory.push({ type: 'error', text: `cat: ${arg}: No such file or directory` });
        }
      }
    } else {
      newHistory.push({ type: 'error', text: `bash: ${cmd}: command not found. Type 'help' for available commands.` });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div style={{
      background: 'rgba(2, 6, 14, 0.98)',
      border: '1.5px solid #00f0ff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 0 30px rgba(0, 240, 255, 0.25)',
      fontFamily: 'monospace',
      margin: '16px 0'
    }}>
      {/* Terminal Title Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #0d2137 0%, #05101e 100%)',
        padding: '8px 14px',
        borderBottom: '1px solid rgba(0, 240, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
          <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
          <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          <span style={{ color: '#00f0ff', fontSize: '0.82rem', fontWeight: 'bold', marginLeft: '8px' }}>
            🐚 bash — odysseus@cyclops-cave: {currentPath}
          </span>
        </div>
        <span style={{ color: 'rgba(231, 229, 221, 0.5)', fontSize: '0.72rem' }}>TTY-1</span>
      </div>

      {/* Terminal Screen Body */}
      <div style={{
        padding: '14px',
        minHeight: '220px',
        maxHeight: '320px',
        overflowY: 'auto',
        fontSize: '0.88rem',
        lineHeight: '1.5',
        color: '#e2e8f0'
      }}>
        {history.map((line, idx) => (
          <div 
            key={idx} 
            style={{
              marginBottom: '4px',
              whiteSpace: 'pre-wrap',
              color: line.type === 'input' 
                ? '#38bdf8' 
                : line.type === 'system'
                  ? 'var(--gold)'
                  : line.type === 'error'
                    ? '#f87171'
                    : '#a7f3d0'
            }}
          >
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Prompt Line */}
      <form 
        onSubmit={handleCommand} 
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#040b15',
          borderTop: '1px solid rgba(0, 240, 255, 0.2)',
          padding: '6px 12px'
        }}
      >
        <span style={{ color: '#00f0ff', marginRight: '8px', fontSize: '0.85rem' }}>
          odysseus@cave:$
        </span>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type command (e.g. ls, cd archives, unzip cyclops_escape.zip, cat clearance_password.txt)..."
          autoFocus
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#f8fafc',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            padding: '4px 0'
          }}
        />
        <button 
          type="submit" 
          style={{
            background: 'rgba(0, 240, 255, 0.15)',
            border: '1px solid #00f0ff',
            color: '#00f0ff',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          Execute
        </button>
      </form>
    </div>
  );
}

export default LinuxTerminal;
