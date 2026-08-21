import React, { useState, useRef, useEffect } from 'react';

// Virtual Linux Filesystem representation
const FILE_SYSTEM = {
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
      'dummy.txt': 'Nothing here! This is an ancient decoy file left behind by fallen sailors.'
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
    content: '[WARN 23:42:01] Giant movement detected in lower quadrant.\n[INFO 23:42:15] Security vault key sealed in /archives/cyclops_escape.zip.\n[INFO 23:43:00] Cave gate status: LOCKED.'
  }
};

// Case-insensitive path & filesystem helper
function findCanonicalPath(targetPath) {
  if (!targetPath) return null;
  const clean = targetPath.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  
  // Exact match
  if (FILE_SYSTEM[clean]) return clean;

  // Case-insensitive match against registered filesystem paths
  const keys = Object.keys(FILE_SYSTEM);
  const found = keys.find(k => k.toLowerCase() === clean.toLowerCase());
  return found || clean;
}

function LinuxTerminal({ onKeyFound }) {
  const [history, setHistory] = useState([
    { type: 'system', text: 'Last login: Fri Aug 22 00:04:12 on ttys001' },
    { type: 'system', text: 'Darwin Odysseus-MacBook 23.4.0 Darwin Kernel x86_64 / Bash 5.2' },
    { type: 'system', text: 'Type "help" to inspect available commands (ls, cd, pwd, cat, unzip, find, clear).' },
    { type: 'output', text: 'Objective: Explore archives/ and unzip cyclops_escape.zip to discover the clearance password.' },
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('/home/odysseus');
  const [extractedFiles, setExtractedFiles] = useState({});
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copiedKey, setCopiedKey] = useState(false);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const resolvePath = (target) => {
    if (!target || target === '.') return currentPath;
    if (target === '~') return '/home/odysseus';
    if (target === '..') {
      if (currentPath === '/home/odysseus') return '/home/odysseus';
      const parts = currentPath.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/');
    }
    if (target.startsWith('/')) return findCanonicalPath(target);
    const combined = `${currentPath === '/' ? '' : currentPath}/${target}`.replace(/\/+/g, '/');
    return findCanonicalPath(combined);
  };

  const getDisplayPath = () => {
    if (currentPath === '/home/odysseus') return '~';
    if (currentPath.toLowerCase().startsWith('/home/odysseus/')) {
      return '~/' + currentPath.slice('/home/odysseus/'.length);
    }
    return currentPath;
  };

  // Case-insensitive tab completion
  const handleTabCompletion = () => {
    const parts = input.split(/\s+/);
    if (parts.length === 1) {
      const cmds = ['ls', 'cd', 'pwd', 'cat', 'unzip', 'find', 'clear', 'help', 'history'];
      const match = cmds.find(c => c.toLowerCase().startsWith(parts[0].toLowerCase()));
      if (match) setInput(match + ' ');
    } else if (parts.length >= 2) {
      const targetDir = currentPath;
      const dirObj = FILE_SYSTEM[targetDir];
      if (dirObj && dirObj.type === 'dir') {
        const partial = parts[parts.length - 1].toLowerCase();
        const extractedInDir = Object.keys(extractedFiles)
          .filter(p => p.toLowerCase().startsWith(targetDir.toLowerCase() + '/') && !p.slice(targetDir.length + 1).includes('/'))
          .map(p => p.split('/').pop());
        const allItems = [...new Set([...dirObj.children, ...extractedInDir])];
        const match = allItems.find(item => item.toLowerCase().startsWith(partial));
        if (match) {
          parts[parts.length - 1] = match;
          setInput(parts.join(' '));
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < cmdHistory.length) {
          setHistoryIndex(nextIdx);
          setInput(cmdHistory[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInput('');
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  const handleCommand = (e) => {
    e.preventDefault();
    const rawCmd = input.trim();
    if (!rawCmd) return;

    setCmdHistory(prev => [...prev, rawCmd]);
    setHistoryIndex(-1);

    const displayPrompt = `odysseus@cyclops-cave:${getDisplayPath()}$`;
    const newHistory = [...history, { type: 'input', prompt: displayPrompt, text: rawCmd }];
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
        text: `Available Terminal Commands (Case-Insensitive):
  ls [directory]        List files and folders in directory
  cd <directory>        Navigate directories (e.g. cd archives, cd ..)
  pwd                   Print current working directory
  cat <filename>        Read file contents (e.g. cat clearance_password.txt)
  unzip <archive.zip>   Extract archive (e.g. unzip cyclops_escape.zip)
  find . -name <pat>    Locate files in directory hierarchy
  history               List previous terminal commands
  clear (Ctrl+L)        Clear terminal screen`
      });
    } else if (cmd === 'pwd') {
      newHistory.push({ type: 'output', text: currentPath });
    } else if (cmd === 'history') {
      newHistory.push({
        type: 'output',
        text: cmdHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n') || 'No commands in history.'
      });
    } else if (cmd === 'ls') {
      const targetDir = arg ? resolvePath(arg) : currentPath;
      const dirObj = FILE_SYSTEM[targetDir];
      if (!dirObj || dirObj.type !== 'dir') {
        newHistory.push({ type: 'error', text: `ls: cannot access '${arg || targetDir}': No such file or directory` });
      } else {
        const extractedInDir = Object.keys(extractedFiles)
          .filter(p => p.toLowerCase().startsWith(targetDir.toLowerCase() + '/') && !p.slice(targetDir.length + 1).includes('/'))
          .map(p => p.split('/').pop());
        
        const allItems = [...new Set([...dirObj.children, ...extractedInDir])];

        newHistory.push({
          type: 'ls-output',
          items: allItems.map(item => {
            const itemPath = `${targetDir}/${item}`.replace(/\/+/g, '/');
            const canonPath = findCanonicalPath(itemPath);
            const isDir = FILE_SYSTEM[canonPath]?.type === 'dir';
            const isZip = FILE_SYSTEM[canonPath]?.isZip || item.toLowerCase().endsWith('.zip');
            return { name: item, isDir, isZip };
          })
        });
      }
    } else if (cmd === 'cd') {
      if (!arg || arg === '~') {
        setCurrentPath('/home/odysseus');
      } else {
        const targetPath = resolvePath(arg);
        if (FILE_SYSTEM[targetPath] && FILE_SYSTEM[targetPath].type === 'dir') {
          setCurrentPath(targetPath);
        } else {
          newHistory.push({ type: 'error', text: `bash: cd: ${arg}: No such file or directory` });
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
        const fileObj = FILE_SYSTEM[targetPath];
        if (!fileObj || !fileObj.isZip) {
          // Fallback: check if user just typed the zip name while in parent dir
          const altPath = resolvePath(`archives/${arg}`);
          const altObj = FILE_SYSTEM[altPath];
          if (altObj && altObj.isZip) {
            const filesExtracted = altObj.zipContent;
            const newExtracted = { ...extractedFiles };
            const logLines = [
              `Archive:  ${arg}`,
              ...Object.keys(filesExtracted).map(fname => `  inflating: ${fname}`),
              'Extraction completed successfully. Use "cat <filename>" to view.'
            ];

            const zipDir = altPath.slice(0, altPath.lastIndexOf('/')) || currentPath;
            Object.entries(filesExtracted).forEach(([fname, content]) => {
              const fullExtractedPath = `${zipDir}/${fname}`.replace(/\/+/g, '/');
              newExtracted[fullExtractedPath] = content;
            });

            setExtractedFiles(newExtracted);
            newHistory.push({ type: 'output', text: logLines.join('\n') });
          } else {
            newHistory.push({ type: 'error', text: `unzip: cannot find or open ${arg}` });
          }
        } else {
          const filesExtracted = fileObj.zipContent;
          const newExtracted = { ...extractedFiles };
          const logLines = [
            `Archive:  ${arg}`,
            ...Object.keys(filesExtracted).map(fname => `  inflating: ${fname}`),
            'Extraction completed successfully. Use "cat <filename>" to view.'
          ];

          const zipDir = targetPath.slice(0, targetPath.lastIndexOf('/')) || currentPath;
          Object.entries(filesExtracted).forEach(([fname, content]) => {
            const fullExtractedPath = `${zipDir}/${fname}`.replace(/\/+/g, '/');
            newExtracted[fullExtractedPath] = content;
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
        
        // Find in extracted files (case-insensitive)
        const extractedKey = Object.keys(extractedFiles).find(
          k => k.toLowerCase() === targetPath.toLowerCase() || k.toLowerCase().endsWith('/' + arg.toLowerCase())
        );

        if (extractedKey && extractedFiles[extractedKey]) {
          const content = extractedFiles[extractedKey];
          newHistory.push({ type: 'output', text: content });
          if (content.includes('NOBODY-CYCLOPS-42')) {
            newHistory.push({
              type: 'key-discovered',
              key: 'NOBODY-CYCLOPS-42',
              text: '🔑 PASSWORD DISCOVERED: NOBODY-CYCLOPS-42'
            });
            if (onKeyFound) onKeyFound('NOBODY-CYCLOPS-42');
          }
        } else if (FILE_SYSTEM[targetPath] && FILE_SYSTEM[targetPath].type === 'file') {
          if (FILE_SYSTEM[targetPath].isZip) {
            newHistory.push({ type: 'error', text: `cat: ${arg}: Binary archive file (use "unzip ${arg}" to extract)` });
          } else {
            newHistory.push({ type: 'output', text: FILE_SYSTEM[targetPath].content });
          }
        } else {
          newHistory.push({ type: 'error', text: `cat: ${arg}: No such file or directory` });
        }
      }
    } else {
      newHistory.push({ type: 'error', text: `bash: ${cmd}: command not found. Type "help" for available commands.` });
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleCopyKey = (keyText) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(keyText);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="realistic-terminal-container">
      {/* Modern Authentic macOS/Linux Terminal Window */}
      <div className="terminal-window" onClick={() => inputRef.current?.focus()}>
        {/* Titlebar with traffic light buttons */}
        <div className="terminal-titlebar">
          <div className="terminal-titlebar-left">
            <span className="terminal-traffic-dot dot-close" title="Close" />
            <span className="terminal-traffic-dot dot-minimize" title="Minimize" />
            <span className="terminal-traffic-dot dot-maximize" title="Maximize" />
            <div className="terminal-tab-pill">
              <span className="terminal-tab-icon">⌘</span>
              <span className="terminal-tab-title">
                odysseus@cyclops-cave: {getDisplayPath()} — bash — 80×24
              </span>
            </div>
          </div>
          <div className="terminal-titlebar-right">
            <span className="terminal-badge-live">● ONLINE</span>
            <span className="terminal-tty-label">ttys001</span>
            <button
              type="button"
              className="terminal-quick-btn"
              onClick={(e) => {
                e.stopPropagation();
                setHistory([]);
              }}
              title="Clear terminal screen"
            >
              Clear
            </button>
            <button
              type="button"
              className="terminal-quick-btn"
              onClick={(e) => {
                e.stopPropagation();
                setInput('help');
                inputRef.current?.focus();
              }}
              title="View help"
            >
              Help
            </button>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="terminal-body">
          {history.map((line, idx) => {
            if (line.type === 'input') {
              return (
                <div key={idx} className="terminal-row terminal-row--input">
                  <span className="prompt-user">odysseus@cyclops-cave</span>
                  <span className="prompt-colon">:</span>
                  <span className="prompt-path">{line.prompt?.split(':')[1]?.replace('$', '') || getDisplayPath()}</span>
                  <span className="prompt-symbol">$</span>
                  <span className="prompt-cmd-text">{line.text}</span>
                </div>
              );
            }
            if (line.type === 'ls-output') {
              return (
                <div key={idx} className="terminal-ls-grid">
                  {line.items.map((item, i) => (
                    <span
                      key={i}
                      className={`terminal-file ${item.isDir ? 'is-dir' : item.isZip ? 'is-zip' : 'is-file'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.isDir) setInput(`cd ${item.name}`);
                        else if (item.isZip) setInput(`unzip ${item.name}`);
                        else setInput(`cat ${item.name}`);
                        inputRef.current?.focus();
                      }}
                      title={item.isDir ? `Click to: cd ${item.name}` : item.isZip ? `Click to: unzip ${item.name}` : `Click to: cat ${item.name}`}
                    >
                      {item.name}{item.isDir ? '/' : ''}
                    </span>
                  ))}
                </div>
              );
            }
            if (line.type === 'key-discovered') {
              return (
                <div key={idx} className="terminal-key-banner">
                  <div className="key-banner-text">
                    <span className="key-banner-icon">🔑</span>
                    <div>
                      <strong>ESCAPE PASSWORD UNLOCKED:</strong>
                      <code>{line.key}</code>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="key-copy-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyKey(line.key);
                    }}
                  >
                    {copiedKey ? '✓ Copied' : '📋 Copy Password'}
                  </button>
                </div>
              );
            }
            if (line.type === 'system') {
              return (
                <div key={idx} className="terminal-row terminal-row--system">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={idx} className="terminal-row terminal-row--error">
                  {line.text}
                </div>
              );
            }
            return (
              <pre key={idx} className="terminal-row terminal-row--output">
                {line.text}
              </pre>
            );
          })}

          {/* Active Command Input Line with Native Seamless Caret Alignment */}
          <form onSubmit={handleCommand} className="terminal-active-line">
            <span className="prompt-prefix">
              <span className="prompt-user">odysseus@cyclops-cave</span>
              <span className="prompt-colon">:</span>
              <span className="prompt-path">{getDisplayPath()}</span>
              <span className="prompt-symbol">$</span>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-native-input"
              autoFocus
              spellCheck="false"
              autoComplete="off"
              aria-label="Linux shell command"
            />
          </form>
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Terminal Footer Quick Action Buttons */}
      <div className="terminal-tips-strip">
        <span>💡 Quick Commands:</span>
        <button type="button" onClick={() => { setInput('ls'); inputRef.current?.focus(); }}>ls</button>
        <button type="button" onClick={() => { setInput('cd archives'); inputRef.current?.focus(); }}>cd archives</button>
        <button type="button" onClick={() => { setInput('unzip cyclops_escape.zip'); inputRef.current?.focus(); }}>unzip cyclops_escape.zip</button>
        <button type="button" onClick={() => { setInput('cat clearance_password.txt'); inputRef.current?.focus(); }}>cat clearance_password.txt</button>
        <button type="button" onClick={() => { setInput('clear'); inputRef.current?.focus(); }}>clear</button>
      </div>
    </div>
  );
}

export default LinuxTerminal;


