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
  var newOct = MP.clamp(Math.floor(avgMidi / 12) - 1, 0, 8);
  if (newOct !== MP.appState.kbOctave) {
    MP.appState.kbOctave = newOct;
    MP.updateKeyBindingLabels();
    MP.scrollKbToOctave();
  }
  MP.updateSequence();
  MP.showTransposeOverlay(shift > 0 ? 'up' : 'down');
};

MP.transposeAndShiftOctave = function(direction) {
  if (!MP.transposeSequence(direction)) return;
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
    return false;
  }
  var shift = octaveShift * 12;
  var midiNotes = MP.appState.seq.map(function(n) { return MP.midiFromName(n.name); }).filter(function(m) { return m >= 0; });
  if (midiNotes.length === 0) return false;
  var minM = Math.min.apply(null, midiNotes), maxM = Math.max.apply(null, midiNotes);
  if (minM + shift < MP.MIDI_MIN || maxM + shift > MP.MIDI_MAX) return false;
  MP.pushUndo();
  MP.appState.seq.forEach(function(n) {
    var midi = MP.midiFromName(n.name);
    if (midi < 0) return;
    MP.updateNoteFromMidi(n, midi + shift);
  });
  MP.updateSequence();
  MP.showTransposeOverlay(octaveShift > 0 ? 'up' : 'down', true);
  return true;
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
    if (e.key === ' ') {
      e.preventDefault();
      var sfxModal = document.getElementById('sfx-modal');
      if (sfxModal && sfxModal.style.display !== 'none') { MP.previewSfx(MP.getSfxParams()); return; }
      if (!MP.appState.micRecording) { if (MP.appState.playState) { MP.pausePlayback(); } else { MP.playSequence(MP.appState.pausedBeat || 0); MP.appState.pausedBeat = null; } }
      return;
    }
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
      MP.appState.clipboard = selected.map(n => ({ name: n.name, freq: n.freq, dur: n.dur, startOffset: n.start - minStart, sfxGroup: n.sfxGroup || null, sfxName: n.sfxName || null }));
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
      var groupMap = {};
      MP.appState.clipboard.forEach(n => {
        var idx = MP.appState.seq.length;
        var note = { name: n.name, freq: n.freq, start: pasteStart + n.startOffset, dur: n.dur };
        if (n.sfxGroup) {
          if (!groupMap[n.sfxGroup]) groupMap[n.sfxGroup] = 'sfx_' + MP._sfxNextGroupId++;
          note.sfxGroup = groupMap[n.sfxGroup];
        }
        if (n.sfxName) note.sfxName = n.sfxName;
        MP.appState.seq.push(note);
        newIdxs.add(idx);
      });
      MP.appState.selectedNoteIdxs = newIdxs;
      MP.ensureNextNoteStart();
      MP.updateSequence();
      MP.showToast('Pasted ' + MP.appState.clipboard.length + ' note' + (MP.appState.clipboard.length !== 1 ? 's' : ''));
      return;
    }
    if (MP.modKey(e) && e.key.toLowerCase() === 'm') {
      e.preventDefault();
      var seq = MP.appState.seq;
      if (seq.length < 2) return;
      var sorted = [...seq].sort(function(a, b) { return a.start - b.start; });
      var merged = [sorted[0]];
      for (var mi = 1; mi < sorted.length; mi++) {
        var prev = merged[merged.length - 1];
        var curr = sorted[mi];
        if (curr.name === prev.name && Math.abs(curr.start - (prev.start + prev.dur)) < 0.01) {
          prev.dur += curr.dur;
        } else {
          merged.push(curr);
        }
      }
      if (merged.length < seq.length) {
        MP.pushUndo();
        MP.appState.seq = merged;
        MP.appState.selectedNoteIdxs.clear();
        MP.ensureNextNoteStart();
        MP.updateSequence();
        MP.showToast('Merged ' + (seq.length - merged.length) + ' note' + (seq.length - merged.length !== 1 ? 's' : ''));
      }
      return;
    }
    if (MP.modKey(e) && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      if (MP.appState.selectedNoteIdxs.size === 0) return;
      var selected = [...MP.appState.selectedNoteIdxs].sort((a, b) => a - b).map(i => MP.appState.seq[i]).filter(Boolean);
      if (selected.length === 0) return;
      MP.pushUndo();
      var maxEnd = Math.max(...selected.map(n => n.start + n.dur));
      var minStart = Math.min(...selected.map(n => n.start));
      var offset = maxEnd - minStart;
      var newIdxs = new Set();
      var dupGroupMap = {};
      selected.forEach(n => {
        var idx = MP.appState.seq.length;
        var note = { name: n.name, freq: n.freq, start: n.start + offset, dur: n.dur };
        if (n.sfxGroup) {
          if (!dupGroupMap[n.sfxGroup]) dupGroupMap[n.sfxGroup] = 'sfx_' + MP._sfxNextGroupId++;
          note.sfxGroup = dupGroupMap[n.sfxGroup];
        }
        if (n.sfxName) note.sfxName = n.sfxName;
        MP.appState.seq.push(note);
        newIdxs.add(idx);
      });
      MP.appState.selectedNoteIdxs = newIdxs;
      MP.ensureNextNoteStart();
      MP.updateSequence();
      MP.showToast('Duplicated ' + selected.length + ' note' + (selected.length !== 1 ? 's' : ''));
      return;
    }
    if (MP.modKey(e) && e.key.toLowerCase() === 'g') {
      e.preventDefault();
      if (MP.appState.selectedNoteIdxs.size < 2) return;
      var selIdxs = [...MP.appState.selectedNoteIdxs];
      var selNotes = selIdxs.map(i => MP.appState.seq[i]).filter(Boolean);
      var hasGroup = selNotes.some(n => n.sfxGroup);
      MP.pushUndo();
      if (hasGroup) {
        selNotes.forEach(n => { delete n.sfxGroup; });
        MP.updateSequence();
        MP.showToast('Ungrouped ' + selNotes.length + ' notes');
      } else {
        var gid = 'sfx_' + MP._sfxNextGroupId++;
        selNotes.forEach(n => { n.sfxGroup = gid; });
        MP.updateSequence();
        MP.showToast('Grouped ' + selNotes.length + ' notes');
      }
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
