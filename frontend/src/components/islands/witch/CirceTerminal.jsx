import React, { useState, useRef, useEffect } from 'react';

// Directory Structure definition
const VALID_CHILDREN_MAP = {
  Island_Aeaea: ['Circes_Palace', 'Pig_Pens', 'Dark_Woods'],
  Circes_Palace: ['Grand_Hall', 'Potions_Lab'],
  Pig_Pens: ['Troughs', 'Mud_Pits'],
  Dark_Woods: ['Wolf_Den', 'Stag_Clearing'],
};

/**
 * CirceTerminal
 *
 * Fully simulated, realistic Linux Terminal for Circe's Enchanted Domain on Aeaea:
 * - Authentic macOS/Linux window chrome (traffic light dots, tab, session title, controls)
 * - Colored Bash prompt (odysseus@aeaea:~/Potions_Lab$)
 * - Case-insensitive command execution (ls, cd, pwd, cat, unzip, tar -xzf, unrar e)
 * - Seamless native caret alignment
 * - Instant spell fragment extraction announcements with copy helpers
 * - Centered incantation form with input glow and auto-formatting
 */
function CirceTerminal({ question, onSubmit, loading }) {
  const [currentPath, setCurrentPath] = useState(['Island_Aeaea']);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Last login: Fri Aug 22 00:04:30 on ttys002' },
    { type: 'system', text: 'Hermes Divine Terminal Shell v4.2.8 (aeaea-enchanted-sanctum)' },
    { type: 'system', text: 'Odysseus, locate the 3 hidden archives (names starting with "."), unseal them, and speak the incantation.' },
    { type: 'output', text: 'Type "help" for a list of divine commands. Use "ls -a" to reveal hidden archives.' },
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getCurrentDirName = () => {
    return currentPath[currentPath.length - 1] || 'Island_Aeaea';
  };

  const getPromptPath = () => {
    return `~/${currentPath.join('/')}`;
  };

  const handleTabCompletion = () => {
    const parts = inputVal.split(/\s+/);
    const currentDir = getCurrentDirName();

    if (parts.length === 1) {
      const cmds = ['ls', 'cd', 'pwd', 'cat', 'unzip', 'tar', 'unrar', 'clear', 'help', 'history'];
      const match = cmds.find(c => c.toLowerCase().startsWith(parts[0].toLowerCase()));
      if (match) setInputVal(match + ' ');
    } else if (parts[0].toLowerCase() === 'cd') {
      const available = [...(VALID_CHILDREN_MAP[currentDir] || []), '..'];
      const partial = parts[1] || '';
      const match = available.find(d => d.toLowerCase().startsWith(partial.toLowerCase()));
      if (match) setInputVal(`cd ${match}`);
    } else if (parts[0].toLowerCase() === 'cat') {
      let files = [];
      if (currentDir === 'Potions_Lab' && extracted.alpha) files.push('spell_alpha.txt');
      if (currentDir === 'Mud_Pits' && extracted.beta) files.push('spell_beta.txt');
      if (currentDir === 'Stag_Clearing' && extracted.gamma) files.push('spell_gamma.txt');
      if (files.length > 0) setInputVal(`cat ${files[0]}`);
    }
  };

  const handleCommand = (rawCmd) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    setCmdHistory((prev) => [...prev, cmd]);
    setCmdIndex(-1);

    const newLines = [{ type: 'prompt', path: getPromptPath(), text: cmd }];
    const parts = cmd.split(/\s+/);
    const mainCmd = parts[0].toLowerCase();
    const currentDir = getCurrentDirName();

    switch (mainCmd) {
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'history':
        newLines.push({
          type: 'output',
          text: cmdHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n') || 'No commands in history.',
        });
        break;

      case 'help':
        newLines.push({
          type: 'output',
          text: [
            'Available Hermes Shell Commands (Case-Insensitive):',
            '  ls [-a]              List files and directories (-a reveals hidden dotfiles)',
            '  cd <directory>       Change current directory (cd .. to return to parent)',
            '  pwd                  Print current working directory',
            '  cat <file>           Display text content of extracted spell fragment',
            '  unzip <file>         Extract .zip archive (e.g. unzip .spell_alpha.zip)',
            '  tar -xzf <file>      Extract .tar.gz archive (e.g. tar -xzf .spell_beta.tar.gz)',
            '  unrar e <file>       Extract .rar archive (e.g. unrar e .spell_gamma.rar)',
            '  history              Display executed command history',
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
        const lowerArgs = parts.map(p => p.toLowerCase());
        const isAll = lowerArgs.includes('-a') || lowerArgs.includes('-la') || lowerArgs.includes('-al');
        let files = [];

        if (currentDir === 'Island_Aeaea') {
          files = [
            { name: 'Circes_Palace', isDir: true },
            { name: 'Pig_Pens', isDir: true },
            { name: 'Dark_Woods', isDir: true }
          ];
        } else if (currentDir === 'Circes_Palace') {
          files = [
            { name: 'Grand_Hall', isDir: true },
            { name: 'Potions_Lab', isDir: true }
          ];
        } else if (currentDir === 'Grand_Hall') {
          files = [{ name: 'circe_throne.log', isFile: true }];
        } else if (currentDir === 'Potions_Lab') {
          if (isAll) files.push({ name: '.spell_alpha.zip', isZip: true });
          if (extracted.alpha) files.push({ name: 'spell_alpha.txt', isFile: true });
        } else if (currentDir === 'Pig_Pens') {
          files = [
            { name: 'Troughs', isDir: true },
            { name: 'Mud_Pits', isDir: true }
          ];
        } else if (currentDir === 'Troughs') {
          files = [{ name: 'swine_feed.log', isFile: true }];
        } else if (currentDir === 'Mud_Pits') {
          if (isAll) files.push({ name: '.spell_beta.tar.gz', isTar: true });
          if (extracted.beta) files.push({ name: 'spell_beta.txt', isFile: true });
        } else if (currentDir === 'Dark_Woods') {
          files = [
            { name: 'Wolf_Den', isDir: true },
            { name: 'Stag_Clearing', isDir: true }
          ];
        } else if (currentDir === 'Wolf_Den') {
          files = [{ name: 'howling_echoes.log', isFile: true }];
        } else if (currentDir === 'Stag_Clearing') {
          if (isAll) files.push({ name: '.spell_gamma.rar', isRar: true });
          if (extracted.gamma) files.push({ name: 'spell_gamma.txt', isFile: true });
        }

        if (isAll) {
          files = [{ name: '.', isDir: true }, { name: '..', isDir: true }, ...files];
        }

        if (files.length === 0) {
          newLines.push({
            type: 'output',
            text: '(directory appears empty — use "ls -a" to reveal hidden enchanted dotfiles)',
          });
        } else {
          newLines.push({ type: 'ls-grid', items: files });
        }
        break;
      }

      case 'cd': {
        const target = parts[1];
        if (!target || target === '~' || target === '/') {
          setCurrentPath(['Island_Aeaea']);
        } else if (target === '..') {
          if (currentPath.length > 1) setCurrentPath((prev) => prev.slice(0, -1));
        } else if (target === '.') {
          // No-op
        } else {
          const cleanTarget = target.replace(/\/$/, '').toLowerCase();
          const allowed = VALID_CHILDREN_MAP[currentDir] || [];
          const matchedDir = allowed.find(d => d.toLowerCase() === cleanTarget);

          if (matchedDir) {
            setCurrentPath((prev) => [...prev, matchedDir]);
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
        const file = (parts[1] || '').toLowerCase();
        if (!file) {
          newLines.push({ type: 'error', text: 'usage: unzip <archive.zip>' });
        } else if ((file === '.spell_alpha.zip' || file === 'spell_alpha.zip') && currentDir === 'Potions_Lab') {
          setExtracted((prev) => ({ ...prev, alpha: true }));
          newLines.push({
            type: 'output',
            text: [
              'Archive:  .spell_alpha.zip',
              '  inflating: spell_alpha.txt',
              'Extract complete! Run "cat spell_alpha.txt" to read fragment 1.',
            ].join('\n'),
          });
        } else if (file.endsWith('.tar.gz') || file.endsWith('.rar')) {
          newLines.push({
            type: 'error',
            text: `unzip: cannot extract ${parts[1]}: invalid ZIP compression format. Use tar -xzf or unrar e!`,
          });
        } else {
          newLines.push({ type: 'error', text: `unzip: cannot find or open ${parts[1]}` });
        }
        break;
      }

      case 'tar': {
        const lowerCmd = cmd.toLowerCase();
        const file = (parts[2] || parts[1] || '').toLowerCase();
        const isXzf = lowerCmd.includes('-xzf') || lowerCmd.includes('xzf') || lowerCmd.includes('-xvf') || lowerCmd.includes('xvf');

        if (!isXzf) {
          newLines.push({ type: 'error', text: 'usage: tar -xzf <archive.tar.gz>' });
        } else if ((file === '.spell_beta.tar.gz' || file === 'spell_beta.tar.gz') && currentDir === 'Mud_Pits') {
          setExtracted((prev) => ({ ...prev, beta: true }));
          newLines.push({
            type: 'output',
            text: [
              'x spell_beta.txt',
              'Gzip extraction complete! Run "cat spell_beta.txt" to read fragment 2.',
            ].join('\n'),
          });
        } else if (file.endsWith('.zip') || file.endsWith('.rar')) {
          newLines.push({
            type: 'error',
            text: `tar: ${file}: Not in gzip format. Use the correct tool!`,
          });
        } else {
          newLines.push({ type: 'error', text: `tar: ${file}: Cannot open: No such file` });
        }
        break;
      }

      case 'unrar': {
        const lowerCmd = cmd.toLowerCase();
        const file = (parts[2] || parts[1] || '').toLowerCase();
        const hasOpt = lowerCmd.includes(' e ') || lowerCmd.includes(' x ') || lowerCmd.includes(' -e ') || lowerCmd.includes(' -x ');

        if (!hasOpt) {
          newLines.push({ type: 'error', text: 'usage: unrar e <archive.rar>' });
        } else if ((file === '.spell_gamma.rar' || file === 'spell_gamma.rar') && currentDir === 'Stag_Clearing') {
          setExtracted((prev) => ({ ...prev, gamma: true }));
          newLines.push({
            type: 'output',
            text: [
              'UNRAR 5.80 freeware      Copyright (c) 1993-2020 Alexander Roshal',
              'Extracting from .spell_gamma.rar',
              'Extracting  spell_gamma.txt                                       OK',
              'All OK. Run "cat spell_gamma.txt" to read fragment 3.',
            ].join('\n'),
          });
        } else if (file.endsWith('.zip') || file.endsWith('.tar.gz')) {
          newLines.push({
            type: 'error',
            text: `unrar: ${file} is not RAR archive. Use unzip or tar!`,
          });
        } else {
          newLines.push({ type: 'error', text: `unrar: Cannot open ./${file}: No such file` });
        }
        break;
      }

      case 'cat': {
        const file = (parts[1] || '').toLowerCase();
        if (!file) {
          newLines.push({ type: 'error', text: 'usage: cat <filename>' });
        } else if (file === 'spell_alpha.txt' && currentDir === 'Potions_Lab' && extracted.alpha) {
          newLines.push({
            type: 'fragment-discovered',
            num: 1,
            word: 'MOLY',
            desc: 'A mystical herb of divine protection bestowed by Hermes.',
          });
        } else if (file === 'spell_beta.txt' && currentDir === 'Mud_Pits' && extracted.beta) {
          newLines.push({
            type: 'fragment-discovered',
            num: 2,
            word: 'SWINE',
            desc: 'The bewitched and transformed form of Odysseus’ crew.',
          });
        } else if (file === 'spell_gamma.txt' && currentDir === 'Stag_Clearing' && extracted.gamma) {
          newLines.push({
            type: 'fragment-discovered',
            num: 3,
            word: 'OATH',
            desc: 'The solemn divine promise binding Circe from harming the voyagers.',
          });
        } else if (file.includes('circe_throne.log') && currentDir === 'Grand_Hall') {
          newLines.push({
            type: 'output',
            text: '[LOG 03:14:09] Circe woven tapestries intact. No mortals detected in Grand Hall.',
          });
        } else if (file.includes('swine_feed.log') && currentDir === 'Troughs') {
          newLines.push({
            type: 'output',
            text: '[LOG 04:22:01] Acorns supplied to pens. Crew bewitched.',
          });
        } else if (file.includes('howling_echoes.log') && currentDir === 'Wolf_Den') {
          newLines.push({
            type: 'output',
            text: '[LOG 05:01:12] Wolves pacified by Circe’s wand.',
          });
        } else if (file.includes('spell_') && file.endsWith('.zip')) {
          newLines.push({ type: 'error', text: `cat: ${parts[1]}: Cannot read raw binary archive. Run "unzip ${parts[1]}" first!` });
        } else if (file.includes('spell_') && file.endsWith('.tar.gz')) {
          newLines.push({ type: 'error', text: `cat: ${parts[1]}: Cannot read compressed archive. Run "tar -xzf ${parts[1]}" first!` });
        } else if (file.includes('spell_') && file.endsWith('.rar')) {
          newLines.push({ type: 'error', text: `cat: ${parts[1]}: Cannot read raw RAR archive. Run "unrar e ${parts[1]}" first!` });
        } else {
          newLines.push({ type: 'error', text: `cat: ${parts[1]}: No such file or directory` });
        }
        break;
      }

      default:
        newLines.push({
          type: 'error',
          text: `bash: ${mainCmd}: command not found. Type "help" to see available commands.`,
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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
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
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  const handleSubmitIncantation = (e) => {
    e.preventDefault();
    if (!incantation.trim()) return;
    const normalized = incantation.trim().toUpperCase().replace(/[\s-]+/g, '_');
    onSubmit({
      question_id: question.id,
      answer_string: normalized,
    });
  };

  const handleAutoFillFragment = (word) => {
    setIncantation((prev) => {
      const parts = prev ? prev.split('_').filter(Boolean) : [];
      if (!parts.includes(word)) {
        parts.push(word);
      }
      return parts.join('_');
    });
  };

  return (
    <div className="witch-circe-terminal-container">
      {showLightbox && (
        <div className="witch-lightbox-overlay" onClick={() => setShowLightbox(false)}>
          <div className="witch-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="witch-lightbox-close" onClick={() => setShowLightbox(false)}>✕</button>
            <img src="/assets/witch/circe_directory_tree.jpeg" alt="Circe Island Directory Map" className="witch-lightbox-img" />
            <p className="witch-lightbox-caption">Directory Tree of Aeaea — Find all 3 hidden archive locations</p>
          </div>
        </div>
      )}

      <div className="witch-challenge-header">
        <p className="eyebrow" style={{ color: 'var(--gold)' }}>WITCH MAIN TRIAL 2</p>
        <h3 className="witch-challenge-title">Circe’s Enchanted Domain — Terminal Command Infiltration</h3>
        <p className="witch-challenge-subtitle">
          Infiltrate Aeaea's virtual file system to unseal the 3 hidden spell fragments and synthesize the counter-incantation.
        </p>
      </div>

      <div className="circe-map-strip">
        <div className="witch-image-card circe-map-card" onClick={() => setShowLightbox(true)} title="Click to Enlarge Directory Tree Map">
          <img src="/assets/witch/circe_directory_tree.jpeg" alt="Circe Directory Map" className="circe-thumb-img" />
          <div className="witch-image-zoom-badge">
            <span>🔍 Enlarge Island Directory Map</span>
          </div>
        </div>
        <div className="circe-instructions">
          <h4>Enchanted Terminal Rules:</h4>
          <ul>
            <li><strong>Hidden Archives</strong>: Archives are hidden dotfiles (names starting with <code>.</code>). Use <code>ls -a</code> to inspect chambers.</li>
            <li><strong>Archive Extraction Tools</strong>:
              <ul style={{ marginTop: '4px', gap: '4px' }}>
                <li><code>.zip</code> archives: extract with <code>unzip &lt;file.zip&gt;</code></li>
                <li><code>.tar.gz</code> archives: extract with <code>tar -xzf &lt;file.tar.gz&gt;</code></li>
                <li><code>.rar</code> archives: extract with <code>unrar e &lt;file.rar&gt;</code></li>
              </ul>
            </li>
            <li><strong>Read Fragments</strong>: Use <code>cat &lt;filename.txt&gt;</code> to read the uncovered spell words.</li>
            <li><strong>Final Incantation</strong>: Combine the 3 fragment words in sequential order (1, 2, 3) separated by underscores: <code>FRAGMENT1_FRAGMENT2_FRAGMENT3</code>.</li>
          </ul>
        </div>
      </div>

      <div className="realistic-terminal-container">
        <div className="terminal-window" onClick={() => inputRef.current?.focus()}>
          <div className="terminal-titlebar">
            <div className="terminal-titlebar-left">
              <span className="terminal-traffic-dot dot-close" title="Close" />
              <span className="terminal-traffic-dot dot-minimize" title="Minimize" />
              <span className="terminal-traffic-dot dot-maximize" title="Maximize" />
              <div className="terminal-tab-pill">
                <span className="terminal-tab-icon">⌘</span>
                <span className="terminal-tab-title">
                  odysseus@aeaea: {getPromptPath()} — bash — 80×24
                </span>
              </div>
            </div>
            <div className="terminal-titlebar-right">
              <span className="terminal-badge-live">● ONLINE</span>
              <span className="terminal-tty-label">ttys002</span>
              <button type="button" className="terminal-quick-btn" onClick={(e) => { e.stopPropagation(); setHistory([]); }} title="Clear screen">Clear</button>
              <button type="button" className="terminal-quick-btn" onClick={(e) => { e.stopPropagation(); setInputVal('help'); inputRef.current?.focus(); }} title="View help">Help</button>
            </div>
          </div>

          <div className="terminal-body">
            {history.map((line, idx) => {
              if (line.type === 'prompt') return (
                <div key={idx} className="terminal-row terminal-row--input">
                  <span className="prompt-user">odysseus@aeaea</span>
                  <span className="prompt-colon">:</span>
                  <span className="prompt-path">{line.path}</span>
                  <span className="prompt-symbol">$</span>
                  <span className="prompt-cmd-text">{line.text}</span>
                </div>
              );
              if (line.type === 'ls-grid') return (
                <div key={idx} className="terminal-ls-grid">
                  {line.items.map((item, i) => (
                    <span key={i} className={`terminal-file ${item.isDir ? 'is-dir' : item.isZip || item.isTar || item.isRar ? 'is-zip' : 'is-file'}`} onClick={(e) => { e.stopPropagation(); if (item.isDir) setInputVal(`cd ${item.name}`); else if (item.isZip) setInputVal(`unzip ${item.name}`); else if (item.isTar) setInputVal(`tar -xzf ${item.name}`); else if (item.isRar) setInputVal(`unrar e ${item.name}`); else setInputVal(`cat ${item.name}`); inputRef.current?.focus(); }}>{item.name}{item.isDir ? '/' : ''}</span>
                  ))}
                </div>
              );
              if (line.type === 'fragment-discovered') return (
                <div key={idx} className="terminal-key-banner">
                  <div className="key-banner-text">
                    <span className="key-banner-icon">✨</span>
                    <div>
                      <strong>SPELL FRAGMENT {line.num} UNVEILED:</strong>
                      <code>{line.word}</code>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(231,229,221,0.7)', display: 'block', marginTop: '2px' }}>{line.desc}</span>
                    </div>
                  </div>
                  <button type="button" className="key-copy-btn" onClick={(e) => { e.stopPropagation(); handleAutoFillFragment(line.word); }}>+ Add to Incantation</button>
                </div>
              );
              if (line.type === 'system') return <div key={idx} className="terminal-row terminal-row--system">{line.text}</div>;
              if (line.type === 'error') return <div key={idx} className="terminal-row terminal-row--error">{line.text}</div>;
              return <pre key={idx} className="terminal-row terminal-row--output">{line.text}</pre>;
            })}

            <form onSubmit={(e) => { e.preventDefault(); handleCommand(inputVal); }} className="terminal-active-line">
              <span className="prompt-prefix">
                <span className="prompt-user">odysseus@aeaea</span>
                <span className="prompt-colon">:</span>
                <span className="prompt-path">{getPromptPath()}</span>
                <span className="prompt-symbol">$</span>
              </span>
              <input ref={inputRef} type="text" className="terminal-native-input" value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyDown={handleKeyDown} autoFocus spellCheck="false" autoComplete="off" aria-label="Circe Terminal Input" />
            </form>
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="terminal-tips-strip">
          <span>💡 Quick Commands:</span>
          <button type="button" onClick={() => { setInputVal('ls'); inputRef.current?.focus(); }}>ls</button>
          <button type="button" onClick={() => { setInputVal('ls -a'); inputRef.current?.focus(); }}>ls -a</button>
          <button type="button" onClick={() => { setInputVal('pwd'); inputRef.current?.focus(); }}>pwd</button>
          <button type="button" onClick={() => { setInputVal('cd ..'); inputRef.current?.focus(); }}>cd ..</button>
          <button type="button" onClick={() => { setInputVal('help'); inputRef.current?.focus(); }}>help</button>
          <button type="button" onClick={() => { setInputVal('clear'); inputRef.current?.focus(); }}>clear</button>
        </div>
      </div>

      <form className="witch-answer-form circe-incantation-form" onSubmit={handleSubmitIncantation}>
        <div className="field" style={{ width: '100%', maxWidth: '640px', margin: '0 auto 16px auto' }}>
          <label htmlFor="circe-incantation" style={{ display: 'block', textAlign: 'center', marginBottom: '8px' }}>
            Hermes's Final Incantation Formula: <code>[Fragment 1]_[Fragment 2]_[Fragment 3]</code> <span style={{ color: 'var(--gold)' }}>*</span>
          </label>
          <div className="witch-code-input-wrapper" style={{ justifyContent: 'center' }}>
            <input
              id="circe-incantation"
              type="text"
              className="cinematic-input circe-incantation-input"
              placeholder="e.g. WORD1_WORD2_WORD3"
              value={incantation}
              onChange={(e) => setIncantation(e.target.value.toUpperCase())}
              required
              disabled={loading}
              style={{ textAlign: 'center', letterSpacing: '0.12em', fontWeight: 'bold' }}
            />
          </div>
          <span className="field-hint" style={{ textAlign: 'center', display: 'block', marginTop: '6px' }}>
            Combine the 3 unsealed fragments in sequential order with underscores (e.g. <code>WORD1_WORD2_WORD3</code>).
          </span>
        </div>

        <button
          type="submit"
          className="action-button cinematic-button witch-submit-btn"
          disabled={loading || !incantation.trim()}
          style={{ maxWidth: '440px', margin: '0 auto' }}
        >
          {loading ? 'INVOKING DIVINE MOLU...' : '⚡ Speak Incantation & Free the Swine Crew'}
        </button>
      </form>
    </div>
  );
}

export default CirceTerminal;
