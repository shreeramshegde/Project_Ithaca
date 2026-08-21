import React, { useState, useRef, useEffect } from 'react';

/**
 * CirceTerminal
 *
 * Fully simulated, 100% in-memory Linux Terminal for Circe's Enchanted Domain:
 * - NO real shell execution (pure client simulation)
 * - Simulates directory navigation (cd, pwd), hidden dotfile exploration (ls, ls -a),
 *   unarchiving (unzip, tar -xzf, unrar e), and reading text files (cat)
 * - Final incantation submission form
 */
function CirceTerminal({ question, onSubmit, loading }) {
  const [currentPath, setCurrentPath] = useState(['Island_Aeaea']);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: '=== AEAEA // ENCHANTED ARCHIVE TERMINAL v4.2 ===' },
    { type: 'system', text: 'Type "help" for a list of available divine commands.' },
    { type: 'system', text: 'Odysseus, locate the 3 hidden archives, unseal them, and speak the incantation.' },
    { type: 'output', text: '' },
  ]);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [extracted, setExtracted] = useState({
    alpha: false,
    beta: false,
    gamma: false,
  });
  const [incantation, setIncantation] = useState('');
  const [showLightbox, setShowLightbox] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getCurrentDirName = () => {
    return currentPath[currentPath.length - 1] || 'Island_Aeaea';
  };

  const getPromptPath = () => {
    return `~/${currentPath.join('/')}`;
  };

  const handleCommand = (rawCmd) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Add to command history
    setCmdHistory((prev) => [...prev, cmd]);
    setCmdIndex(-1);

    // Echo user command
    const newLines = [{ type: 'prompt', path: getPromptPath(), text: cmd }];

    const parts = cmd.split(/\s+/);
    const mainCmd = parts[0].toLowerCase();
    const currentDir = getCurrentDirName();

    switch (mainCmd) {
      case 'clear':
        setHistory([]);
        return;

      case 'help':
        newLines.push({
          type: 'output',
          text: [
            'Available Hermes Command Set:',
            '  ls [-a]              List files and directories (-a reveals hidden dotfiles)',
            '  cd <directory>       Change current directory (cd .. to go up)',
            '  pwd                  Print working directory',
            '  cat <file>           Display text content of extracted file',
            '  unzip <file>         Extract .zip archive',
            '  tar -xzf <file>      Extract .tar.gz archive',
            '  unrar e <file>       Extract .rar archive',
            '  clear                Clear terminal screen',
            '  help                 Display this command help menu',
          ].join('\n'),
        });
        break;

      case 'pwd':
        newLines.push({
          type: 'output',
          text: `/home/odysseus/${currentPath.join('/')}`,
        });
        break;

      case 'ls': {
        const isAll = parts.includes('-a') || parts.includes('-la') || parts.includes('-al');
        let files = [];

        if (currentDir === 'Island_Aeaea') {
          files = ['Circes_Palace/', 'Pig_Pens/', 'Dark_Woods/'];
        } else if (currentDir === 'Circes_Palace') {
          files = ['Grand_Hall/', 'Potions_Lab/'];
        } else if (currentDir === 'Grand_Hall') {
          files = ['circe_throne.log'];
        } else if (currentDir === 'Potions_Lab') {
          if (isAll) files.push('.spell_alpha.zip');
          if (extracted.alpha) files.push('spell_alpha.txt');
        } else if (currentDir === 'Pig_Pens') {
          files = ['Troughs/', 'Mud_Pits/'];
        } else if (currentDir === 'Troughs') {
          files = ['swine_feed.log'];
        } else if (currentDir === 'Mud_Pits') {
          if (isAll) files.push('.spell_beta.tar.gz');
          if (extracted.beta) files.push('spell_beta.txt');
        } else if (currentDir === 'Dark_Woods') {
          files = ['Wolf_Den/', 'Stag_Clearing/'];
        } else if (currentDir === 'Wolf_Den') {
          files = ['howling_echoes.log'];
        } else if (currentDir === 'Stag_Clearing') {
          if (isAll) files.push('.spell_gamma.rar');
          if (extracted.gamma) files.push('spell_gamma.txt');
        }

        if (isAll) {
          files = ['.', '..', ...files];
        }

        newLines.push({
          type: 'output',
          text: files.length > 0 ? files.join('   ') : '(directory appears empty - try ls -a)',
        });
        break;
      }

      case 'cd': {
        const target = parts[1];
        if (!target || target === '~' || target === '/') {
          setCurrentPath(['Island_Aeaea']);
          newLines.push({ type: 'output', text: '' });
        } else if (target === '..') {
          if (currentPath.length > 1) {
            setCurrentPath((prev) => prev.slice(0, -1));
          }
        } else if (target === '.') {
          // No-op
        } else {
          // Check child directory validity
          const validChildrenMap = {
            Island_Aeaea: ['Circes_Palace', 'Pig_Pens', 'Dark_Woods'],
            Circes_Palace: ['Grand_Hall', 'Potions_Lab'],
            Pig_Pens: ['Troughs', 'Mud_Pits'],
            Dark_Woods: ['Wolf_Den', 'Stag_Clearing'],
          };

          const cleanTarget = target.replace(/\/$/, '');
          const allowed = validChildrenMap[currentDir] || [];

          if (allowed.includes(cleanTarget)) {
            setCurrentPath((prev) => [...prev, cleanTarget]);
          } else {
            newLines.push({
              type: 'error',
              text: `bash: cd: ${target}: No such file or directory`,
            });
          }
        }
        break;
      }

      case 'unzip': {
        const file = parts[1];
        if (!file) {
          newLines.push({ type: 'error', text: 'usage: unzip <archive.zip>' });
        } else if (file === '.spell_alpha.zip' && currentDir === 'Potions_Lab') {
          setExtracted((prev) => ({ ...prev, alpha: true }));
          newLines.push({
            type: 'output',
            text: [
              'Archive:  .spell_alpha.zip',
              '  inflating: spell_alpha.txt',
              'Extract complete. Use "cat spell_alpha.txt" to read fragment.',
            ].join('\n'),
          });
        } else if (file.endsWith('.tar.gz') || file.endsWith('.rar')) {
          newLines.push({
            type: 'error',
            text: `unzip: cannot extract ${file}: invalid ZIP compression format. Use the correct tool!`,
          });
        } else {
          newLines.push({ type: 'error', text: `unzip: cannot find or open ${file}` });
        }
        break;
      }

      case 'tar': {
        const flag = parts[1];
        const file = parts[2] || parts[1];
        const isXzf = cmd.includes('-xzf') || cmd.includes('xzf') || cmd.includes('-xvf');

        if (!isXzf) {
          newLines.push({ type: 'error', text: 'usage: tar -xzf <archive.tar.gz>' });
        } else if (file === '.spell_beta.tar.gz' && currentDir === 'Mud_Pits') {
          setExtracted((prev) => ({ ...prev, beta: true }));
          newLines.push({
            type: 'output',
            text: [
              'x spell_beta.txt',
              'Gzip extraction complete. Use "cat spell_beta.txt" to read fragment.',
            ].join('\n'),
          });
        } else if (file.endsWith('.zip') || file.endsWith('.rar')) {
          newLines.push({
            type: 'error',
            text: `tar: ${file}: Not in gzip format. Use the correct tool for this extension!`,
          });
        } else {
          newLines.push({ type: 'error', text: `tar: ${file}: Cannot open: No such file` });
        }
        break;
      }

      case 'unrar': {
        const sub = parts[1];
        const file = parts[2] || parts[1];
        const hasOpt = sub === 'e' || sub === 'x' || sub === '-e';

        if (!hasOpt) {
          newLines.push({ type: 'error', text: 'usage: unrar e <archive.rar>' });
        } else if (file === '.spell_gamma.rar' && currentDir === 'Stag_Clearing') {
          setExtracted((prev) => ({ ...prev, gamma: true }));
          newLines.push({
            type: 'output',
            text: [
              'UNRAR 5.80 freeware      Copyright (c) 1993-2020 Alexander Roshal',
              'Extracting from .spell_gamma.rar',
              'Extracting  spell_gamma.txt                                       OK',
              'All OK. Use "cat spell_gamma.txt" to read fragment.',
            ].join('\n'),
          });
        } else if (file.endsWith('.zip') || file.endsWith('.tar.gz')) {
          newLines.push({
            type: 'error',
            text: `unrar: ${file} is not RAR archive. Use the appropriate divine tool!`,
          });
        } else {
          newLines.push({ type: 'error', text: `unrar: Cannot open ./${file}: No such file` });
        }
        break;
      }

      case 'cat': {
        const file = parts[1];
        if (!file) {
          newLines.push({ type: 'error', text: 'usage: cat <filename>' });
        } else if (file === 'spell_alpha.txt' && currentDir === 'Potions_Lab' && extracted.alpha) {
          newLines.push({
            type: 'success-output',
            text: [
              '✦ SPELL FRAGMENT 1 DISCOVERED ✦',
              '--------------------------------',
              'MOLY',
              '--------------------------------',
              'A mystical herb of divine protection.',
            ].join('\n'),
          });
        } else if (file === 'spell_beta.txt' && currentDir === 'Mud_Pits' && extracted.beta) {
          newLines.push({
            type: 'success-output',
            text: [
              '✦ SPELL FRAGMENT 2 DISCOVERED ✦',
              '--------------------------------',
              'SWINE',
              '--------------------------------',
              'The bewitched form of Odysseus’ crew.',
            ].join('\n'),
          });
        } else if (file === 'spell_gamma.txt' && currentDir === 'Stag_Clearing' && extracted.gamma) {
          newLines.push({
            type: 'success-output',
            text: [
              '✦ SPELL FRAGMENT 3 DISCOVERED ✦',
              '--------------------------------',
              'OATH',
              '--------------------------------',
              'The sacred promise extracted from the witch.',
            ].join('\n'),
          });
        } else if (file.startsWith('.spell_') && file.endsWith('.zip')) {
          newLines.push({ type: 'error', text: `cat: ${file}: Cannot read raw binary archive. You must unzip it first!` });
        } else if (file.startsWith('.spell_') && file.endsWith('.tar.gz')) {
          newLines.push({ type: 'error', text: `cat: ${file}: Cannot read raw compressed archive. You must extract it with tar -xzf first!` });
        } else if (file.startsWith('.spell_') && file.endsWith('.rar')) {
          newLines.push({ type: 'error', text: `cat: ${file}: Cannot read raw RAR archive. You must extract it with unrar e first!` });
        } else {
          newLines.push({ type: 'error', text: `cat: ${file}: No such file or directory` });
        }
        break;
      }

      default:
        newLines.push({
          type: 'error',
          text: `bash: ${mainCmd}: command not found. Type "help" to see available divine commands.`,
        });
        break;
    }

    setHistory((prev) => [...prev, ...newLines]);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIndex = cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1);
        setCmdIndex(nextIndex);
        setInputVal(cmdHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length > 0 && cmdIndex !== -1) {
        const nextIndex = cmdIndex + 1;
        if (nextIndex < cmdHistory.length) {
          setCmdIndex(nextIndex);
          setInputVal(cmdHistory[nextIndex]);
        } else {
          setCmdIndex(-1);
          setInputVal('');
        }
      }
    }
  };

  const handleSubmitIncantation = (e) => {
    e.preventDefault();
    if (!incantation.trim()) return;
    onSubmit({
      question_id: question.id,
      answer_string: incantation.trim(),
    });
  };

  return (
    <div className="witch-circe-terminal-container">
      {/* Lightbox for Directory Tree Map */}
      {showLightbox && (
        <div className="witch-lightbox-overlay" onClick={() => setShowLightbox(false)}>
          <div className="witch-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="witch-lightbox-close"
              onClick={() => setShowLightbox(false)}
            >
              ✕
            </button>
            <img
              src="/assets/witch/circe_directory_tree.jpeg"
              alt="Circe Island Directory Map"
              className="witch-lightbox-img"
            />
            <p className="witch-lightbox-caption">Directory Tree of Aeaea — Find all 3 hidden archive locations</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="witch-challenge-header">
        <p className="eyebrow" style={{ color: 'var(--gold)' }}>WITCH MAIN TRIAL 2</p>
        <h3 className="witch-challenge-title">Circe’s Enchanted Domain — Terminal Command Infiltration</h3>
      </div>

      {/* Map Thumbnail Reference */}
      <div className="circe-map-strip">
        <div
          className="witch-image-card circe-map-card"
          onClick={() => setShowLightbox(true)}
          title="Click to Enlarge Directory Tree Map"
        >
          <img
            src="/assets/witch/circe_directory_tree.jpeg"
            alt="Circe Directory Map"
            className="circe-thumb-img"
          />
          <div className="witch-image-zoom-badge">
            <span>🔍 Click to View Island Directory Map</span>
          </div>
        </div>
        <div className="circe-instructions">
          <p>
            The witch has locked the 3 spell fragments inside hidden archives starting with a dot (<code>.</code>).
          </p>
          <ul>
            <li><strong>Potions_Lab</strong>: <code>.spell_alpha.zip</code> (Use <code>unzip</code>)</li>
            <li><strong>Mud_Pits</strong>: <code>.spell_beta.tar.gz</code> (Use <code>tar -xzf</code>)</li>
            <li><strong>Stag_Clearing</strong>: <code>.spell_gamma.rar</code> (Use <code>unrar e</code>)</li>
          </ul>
        </div>
      </div>

      {/* Simulated Linux Terminal */}
      <div className="simulated-terminal-window" onClick={() => inputRef.current?.focus()}>
        <div className="terminal-titlebar">
          <div className="terminal-traffic-lights">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="terminal-title-text">odysseus@aeaea: {getPromptPath()}</span>
          <span className="terminal-badge">SIMULATED LINUX SHELL</span>
        </div>

        <div className="terminal-body">
          {history.map((line, idx) => {
            if (line.type === 'prompt') {
              return (
                <div key={idx} className="terminal-line prompt-line">
                  <span className="terminal-prompt-prefix">odysseus@aeaea:{line.path}$</span>{' '}
                  <span className="terminal-user-cmd">{line.text}</span>
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={idx} className="terminal-line error-line">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'success-output') {
              return (
                <pre key={idx} className="terminal-line success-line">
                  {line.text}
                </pre>
              );
            }
            if (line.type === 'system') {
              return (
                <div key={idx} className="terminal-line system-line">
                  {line.text}
                </div>
              );
            }
            return (
              <pre key={idx} className="terminal-line output-line">
                {line.text}
              </pre>
            );
          })}

          {/* Active Input Line */}
          <div className="terminal-line input-line">
            <span className="terminal-prompt-prefix">odysseus@aeaea:{getPromptPath()}$</span>{' '}
            <input
              ref={inputRef}
              type="text"
              className="terminal-active-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck="false"
              autoComplete="off"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Final Incantation Submission */}
      <form className="witch-answer-form circe-incantation-form" onSubmit={handleSubmitIncantation}>
        <div className="field">
          <label htmlFor="circe-incantation">
            Hermes's Final Incantation Formula: <code>[Fragment 1]_[Fragment 2]_[Fragment 3]</code> <span style={{ color: 'var(--gold)' }}>*</span>
          </label>
          <input
            id="circe-incantation"
            type="text"
            className="cinematic-input circe-incantation-input"
            placeholder="e.g. WORD1_WORD2_WORD3"
            value={incantation}
            onChange={(e) => setIncantation(e.target.value.toUpperCase())}
            required
            disabled={loading}
          />
          <span className="field-hint">
            Combine the 3 extracted fragment words in order using underscores.
          </span>
        </div>

        <button
          type="submit"
          className="action-button cinematic-button witch-submit-btn"
          disabled={loading || !incantation.trim()}
        >
          {loading ? 'SPEAKING SACRED INCANTATION...' : 'Speak Divine Incantation'}
        </button>
      </form>
    </div>
  );
}

export default CirceTerminal;
