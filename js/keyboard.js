MP.noteElMap = {};

MP.initKeyboard = function() {
  const keyboard = document.getElementById('keyboard');
  const whitePositions = [];
  let whiteIdx = 0;

  MP.NOTES.forEach(note => {
    if (note.type === 'white') {
      whitePositions.push(whiteIdx * (MP.W + MP.GAP));
      note._whiteIdx = whiteIdx;
      whiteIdx++;
    }
  });
  keyboard.style.width = (whiteIdx * (MP.W + MP.GAP)) + 'px';

  let wIdx = 0;
  MP.NOTES.forEach(note => {
    if (note.type === 'white') { note._wPos = whitePositions[wIdx]; wIdx++; }
    else { note._bPos = whitePositions[wIdx - 1] + MP.W - (MP.BWIDTH / 2) + MP.GAP / 2; }
  });

  MP.NOTES.forEach(note => {
    const el = document.createElement('div');
    if (note.type === 'white') {
      el.className = 'white-key';
      el.style.left = note._wPos + 'px';
      var kb1 = document.createElement('span'); kb1.className = 'key-binding'; kb1.dataset.note = note.name;
      var nl1 = document.createElement('span'); nl1.className = 'note-label'; nl1.textContent = note.name;
      el.append(kb1, nl1);
    } else {
      el.className = 'black-key';
      el.style.left = note._bPos + 'px';
      var kb2 = document.createElement('span'); kb2.className = 'key-binding'; kb2.dataset.note = note.name;
      el.appendChild(kb2);
    }
    MP.noteElMap[note.name] = el;
    el.addEventListener('mousedown', (e) => { e.preventDefault(); onPianoKeyDown(note, el); });
    el.addEventListener('mouseup', () => onPianoKeyUp(note, el));
    el.addEventListener('mouseleave', () => { if (MP.appState.pressedNote === note) onPianoKeyUp(note, el); });
    el.addEventListener('touchstart', (e) => { e.preventDefault(); onPianoKeyDown(note, el); });
    el.addEventListener('touchend', () => onPianoKeyUp(note, el));
    keyboard.appendChild(el);
  });

  MP.NOTES.filter(n => n.name.startsWith('C') && !n.name.includes('#')).forEach(note => {
    const label = document.createElement('div');
    label.className = 'octave-label';
    label.style.left = note._wPos + 'px';
    label.textContent = note.name;
    keyboard.appendChild(label);
  });

  requestAnimationFrame(() => {
    const wrap = document.getElementById('keyboard-wrap');
    const c4 = MP.NOTES.find(n => n.name === 'C4');
    if (c4) { wrap.scrollLeft = Math.max(0, c4._wPos - wrap.clientWidth / 2 + (MP.W * 7) / 2); }
  });

  MP.updateKeyBindingLabels(true);
  setupComputerKeyboard();
};

MP.scrollKbToOctave = function() {
  var wrap = document.getElementById('keyboard-wrap');
  var cNote = MP.NOTES.find(n => n.name === 'C' + MP.appState.kbOctave);
  if (cNote && cNote._wPos !== undefined) {
    wrap.scrollTo({ left: Math.max(0, cNote._wPos - wrap.clientWidth / 2 + (MP.W * 7) / 2), behavior: 'smooth' });
  }
};

function onPianoKeyDown(note, el) {
  MP.appState.pressStart = performance.now();
  MP.appState.pressedNote = note;
  MP.appState.pressedEl = el;
  el.classList.add('pressed');
  MP.startNoteInput(note.freq);
}

function onPianoKeyUp(note, el) {
  if (MP.appState.pressedNote !== note) return;
  el.classList.remove('pressed');
  MP.stopNoteInput();
  MP.addNoteFromInput(note, MP.appState.pressStart);
}

MP.transposeSemitones = function(shift) {
  if (MP.appState.seq.length === 0) return;
  const midiNotes = MP.appState.seq.map(n => MP.midiFromName(n.name)).filter(m => m >= 0);
  if (midiNotes.length === 0) return;
  const minM = Math.min(...midiNotes), maxM = Math.max(...midiNotes);
  if (minM + shift < MP.MIDI_MIN || maxM + shift > MP.MIDI_MAX) return;
  MP.pushUndo();
  MP.appState.seq.forEach(n => {
    const midi = MP.midiFromName(n.name);
    if (midi < 0) return;
    const newMidi = midi + shift;
    MP.updateNoteFromMidi(n, newMidi);
  });
  var avgMidi = Math.round(midiNotes.reduce(function(a, b) { return a + b; }, 0) / midiNotes.length) + shift;
  var newOct = Math.max(0, Math.min(8, Math.floor(avgMidi / 12) - 1));
  if (newOct !== MP.appState.kbOctave) {
    MP.appState.kbOctave = newOct;
    MP.updateKeyBindingLabels();
    MP.scrollKbToOctave();
  }
  MP.updateSequence();
  MP.showTransposeOverlay(shift > 0 ? 'up' : 'down');
};

MP.transposeAndShiftOctave = function(direction) {
  MP.transposeSequence(direction);
  var newOct = MP.appState.kbOctave + direction;
  if (newOct >= 0 && newOct <= 8) {
    MP.appState.kbOctave = newOct;
    MP.updateKeyBindingLabels();
    MP.scrollKbToOctave();
  }
};

MP.transposeSequence = function(octaveShift) {
  if (MP.appState.seq.length === 0) {
    MP.showTransposeOverlay(octaveShift > 0 ? 'up' : 'down', true);
    return;
  }
  MP.pushUndo();
  MP.appState.seq.forEach(n => {
    const match = n.name.match(/^([A-G]#?)(\d)$/);
    if (!match) return;
    const newOct = parseInt(match[2]) + octaveShift;
    if (newOct < 0 || newOct > 8) return;
    n.name = match[1] + newOct;
    n.freq = MP.freqFromMidi(MP.midiFromName(n.name));
  });
  MP.updateSequence();
  MP.showTransposeOverlay(octaveShift > 0 ? 'up' : 'down', true);
};

MP.updateKeyBindingLabels = function(silent) {
  document.querySelectorAll('.key-binding').forEach(el => el.textContent = '');
  Object.entries(MP.KEY_MAP).forEach(([key, {semi, oct}]) => {
    const octave = MP.appState.kbOctave + oct;
    if (octave > 9) return;
    const noteName = MP.NOTE_NAMES[semi] + octave;
    const el = MP.noteElMap[noteName];
    if (el) {
      const bindEl = el.querySelector('.key-binding');
      if (bindEl) bindEl.textContent = key === ';' ? ';' : key === "'" ? "'" : key.toUpperCase();
    }
  });

  var badge = document.getElementById('octave-badge');
  if (badge) {
    badge.textContent = 'C' + MP.appState.kbOctave;
    if (!silent) { badge.classList.remove('flash'); void badge.offsetWidth; badge.classList.add('flash'); }
  }

  if (silent) return;

  const wrap = document.getElementById('keyboard-wrap');
  let indicator = wrap.querySelector('.octave-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'octave-indicator';
    wrap.appendChild(indicator);
  }
  indicator.textContent = 'Oct ' + MP.appState.kbOctave + '-' + (MP.appState.kbOctave + 1);
  indicator.classList.remove('show');
  void indicator.offsetWidth;
  indicator.classList.add('show');
};

function setupComputerKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.key === ' ') { e.preventDefault(); if (!MP.appState.micRecording) { if (MP.appState.playState) MP.stopPlayback(); else MP.playSequence(); } return; }
    if (MP.modKey(e) && e.shiftKey && e.key.toLowerCase() === 'z') { e.preventDefault(); MP.redo(); return; }
    if (MP.modKey(e) && e.key.toLowerCase() === 'z') { e.preventDefault(); MP.undo(); return; }
    if (MP.modKey(e) && e.key.toLowerCase() === 'y') { e.preventDefault(); MP.redo(); return; }
    if (MP.modKey(e) && (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'x')) {
      e.preventDefault();
      var isCut = e.key.toLowerCase() === 'x';
      if (MP.appState.selectedNoteIdxs.size === 0) return;
      var selected = [...MP.appState.selectedNoteIdxs].sort((a, b) => a - b).map(i => MP.appState.seq[i]).filter(Boolean);
      if (selected.length === 0) return;
      var minStart = Math.min(...selected.map(n => n.start));
      MP.appState.clipboard = selected.map(n => ({ name: n.name, freq: n.freq, dur: n.dur, startOffset: n.start - minStart }));
      if (isCut) {
        MP.pushUndo();
        [...MP.appState.selectedNoteIdxs].sort((a, b) => b - a).forEach(idx => MP.appState.seq.splice(idx, 1));
        MP.clearSelection();
        MP.resetNextNoteStart();
        MP.updateSequence();
      }
      var action = isCut ? 'Cut' : 'Copied';
      MP.showToast(action + ' ' + selected.length + ' note' + (selected.length !== 1 ? 's' : ''));
      return;
    }
    if (MP.modKey(e) && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      if (!MP.appState.clipboard || MP.appState.clipboard.length === 0) return;
      MP.pushUndo();
      var pasteStart = MP.totalBeats();
      var newIdxs = new Set();
      MP.appState.clipboard.forEach(n => {
        var idx = MP.appState.seq.length;
        MP.appState.seq.push({ name: n.name, freq: n.freq, start: pasteStart + n.startOffset, dur: n.dur });
        newIdxs.add(idx);
      });
      MP.appState.selectedNoteIdxs = newIdxs;
      MP.ensureNextNoteStart();
      MP.updateSequence();
      MP.showToast('Pasted ' + MP.appState.clipboard.length + ' note' + (MP.appState.clipboard.length !== 1 ? 's' : ''));
      return;
    }
    if (MP.modKey(e) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      MP.appState.selectedNoteIdxs.clear();
      MP.appState.seq.forEach((_, i) => MP.appState.selectedNoteIdxs.add(i));
      document.querySelectorAll('.pr-note').forEach(b => b.classList.add('selected'));
      return;
    }
    if (e.key === 'Escape') {
      const wrapper = document.querySelector('.piano-roll-wrapper');
      if (wrapper && wrapper.classList.contains('fullscreen')) { MP.togglePrFullscreen(); return; }
      const m = document.getElementById('hotkey-modal');
      if (m.style.display !== 'none') { m.style.display = 'none'; return; }
      if (MP.appState.selectedNoteIdxs.size > 0) {
        MP.clearSelection();
      }
      return;
    }
    if (e.key === 'F11' || (MP.modKey(e) && e.key === 'Enter')) { e.preventDefault(); MP.togglePrFullscreen(); return; }
    if (e.key.toLowerCase() === 'm' && !MP.modKey(e)) { if (MP.appState.metronomeOn) MP.stopMetronome(); else MP.startMetronome(); return; }
    if (e.key === '?') {
      const m = document.getElementById('hotkey-modal');
      m.style.display = m.style.display === 'none' ? '' : 'none';
      return;
    }
    if (e.key === '=' || e.key === '+') { e.preventDefault(); MP.updateZoom(MP.ZOOM_STEP); return; }
    if (e.key === '-' || e.key === '_') { e.preventDefault(); MP.updateZoom(-MP.ZOOM_STEP); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); MP.transposeSemitones(1); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); MP.transposeSemitones(-1); return; }
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (MP.appState.seq.length === 0) return;
      MP.pushUndo();
      MP.appState.seq.pop();
      MP.resetNextNoteStart();
      MP.updateSequence();
      return;
    }
    if (e.key === 'Delete') {
      const idxs = MP.appState.selectedNoteIdxs.size > 0
        ? [...MP.appState.selectedNoteIdxs].sort((a, b) => b - a)
        : [];
      if (idxs.length === 0) return;
      e.preventDefault();
      MP.pushUndo();
      idxs.forEach(idx => MP.appState.seq.splice(idx, 1));
      MP.clearSelection();
      MP.resetNextNoteStart();
      MP.updateSequence();
      return;
    }

    const key = e.key.toLowerCase() === "'" ? "'" : e.key.toLowerCase();
    if (key === 'z' && !MP.modKey(e)) { MP.transposeAndShiftOctave(-1); return; }
    if (key === 'x' && !MP.modKey(e)) { MP.transposeAndShiftOctave(1); return; }
    if (key === 'c' && !MP.modKey(e)) { MP.clearAll(); return; }

    const mapping = MP.KEY_MAP[key];
    if (!mapping) return;
    const octave = MP.appState.kbOctave + mapping.oct;
    if (octave > 9) return;
    const noteName = MP.NOTE_NAMES[mapping.semi] + octave;
    const note = MP.NOTES.find(n => n.name === noteName);
    if (!note) return;
    const el = MP.noteElMap[noteName];
    if (!el) return;
    e.preventDefault();
    if (MP.appState.kbPressedNote) onPianoKeyUp(MP.appState.kbPressedNote, MP.appState.kbPressedEl);
    MP.appState.kbPressedKey = key;
    MP.appState.kbPressedNote = note;
    MP.appState.kbPressedEl = el;
    onPianoKeyDown(note, el);
  });

  document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key !== MP.appState.kbPressedKey) return;
    if (!MP.appState.kbPressedNote || !MP.appState.kbPressedEl) return;
    onPianoKeyUp(MP.appState.kbPressedNote, MP.appState.kbPressedEl);
    MP.appState.kbPressedKey = null;
    MP.appState.kbPressedNote = null;
    MP.appState.kbPressedEl = null;
  });
}
