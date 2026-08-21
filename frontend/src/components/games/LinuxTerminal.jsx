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
    <div className="linux-terminal">
      {/* Terminal Title Bar */}
      <div className="terminal-titlebar">
        <div className="terminal-titlebar-left">
          <span className="terminal-dot dot-close" />
          <span className="terminal-dot dot-minimize" />
          <span className="terminal-dot dot-maximize" />
          <span className="terminal-session-label">
            bash — odysseus@cyclops-cave: {currentPath}
          </span>
        </div>
        <span className="terminal-tty-label">TTY-1</span>
      </div>

      {/* Terminal Screen Body */}
      <div className="terminal-body">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`terminal-line terminal-line--${line.type}`}
          >
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Prompt Line */}
      <form onSubmit={handleCommand} className="terminal-prompt-row">
        <span className="terminal-prompt-prefix">odysseus@cave:$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ls, cd archives, unzip cyclops_escape.zip, cat clearance_password.txt …"
          autoFocus
          className="terminal-prompt-input"
          aria-label="Terminal command input"
        />
        <button type="submit" className="terminal-execute-btn">
          Execute
        </button>
      </form>
    </div>
  );
}

export default LinuxTerminal;
