MP.pushUndo = function() {
  MP.appState.undoStack.push(JSON.stringify({ s: MP.appState.seq, c: MP.appState.nextNoteStart }));
  if (MP.appState.undoStack.length > MP.MAX_UNDO) MP.appState.undoStack.shift();
  MP.appState.redoStack = [];
  MP.updateUndoRedoButtons();
};

MP.undo = function() {
  if (MP.appState.undoStack.length === 0) return;
  MP.appState.redoStack.push(JSON.stringify({ s: MP.appState.seq, c: MP.appState.nextNoteStart }));
  const state = JSON.parse(MP.appState.undoStack.pop());
  MP.appState.seq = state.s; MP.appState.nextNoteStart = state.c;
  MP.updateSequence(); MP.updateUndoRedoButtons();
};

MP.redo = function() {
  if (MP.appState.redoStack.length === 0) return;
  MP.appState.undoStack.push(JSON.stringify({ s: MP.appState.seq, c: MP.appState.nextNoteStart }));
  const state = JSON.parse(MP.appState.redoStack.pop());
  MP.appState.seq = state.s; MP.appState.nextNoteStart = state.c;
  MP.updateSequence(); MP.updateUndoRedoButtons();
};

MP.updateUndoRedoButtons = function() {
  document.getElementById('btn-undo').disabled = MP.appState.undoStack.length === 0;
  document.getElementById('btn-redo').disabled = MP.appState.redoStack.length === 0;
};

MP.switchView = function(view) {
  MP.appState.currentView = view;
  document.querySelectorAll('.view-tab[data-view]').forEach(t => t.classList.toggle('active', t.dataset.view === view));
  document.getElementById('chips-view').style.display = view === 'chips' ? '' : 'none';
  document.getElementById('roll-view').style.display = view === 'roll' ? '' : 'none';
  if (view === 'roll') {
    MP.renderPianoRoll();
    MP.stopChipHighlight();
    if (MP.appState.playState) MP.startPlayhead();
  } else {
    MP.stopPlayhead();
    if (MP.appState.playState) MP.startChipHighlight();
  }
};

MP.renderSequence = function() {
  const wasPlaying = !!MP.appState.playState;
  MP.renderChips();
  if (MP.appState.currentView === 'roll') MP.renderPianoRoll();
  if (wasPlaying) MP.refreshPlayback();
  MP.autoSave();
  var nameEl = document.getElementById('melody-name');
  if (nameEl) nameEl.textContent = MP.appState.melodyName || 'Melody';
  var searchEl = document.getElementById('melody-search');
  if (searchEl && MP.appState.melodyName) searchEl.placeholder = 'Preset: ' + MP.appState.melodyName;
};

MP.autoSave = function() {
  try {
    localStorage.setItem(MP.LS_AUTOSAVE, JSON.stringify({
      seq: MP.appState.seq,
      nextNoteStart: MP.appState.nextNoteStart,
      melodyName: MP.appState.melodyName,
      bpm: MP.getBpm(),
      kbOctave: MP.appState.kbOctave,
      prZoom: MP.appState.prZoom,
      selectedDur: MP.appState.selectedDur,
      timeSig: MP.appState.timeSig,
      snapEnabled: MP.appState.snapEnabled,
    }));
  } catch (e) {}
};

MP.autoLoad = function() {
  try {
    const raw = localStorage.getItem(MP.LS_AUTOSAVE);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data.seq || data.seq.length === 0) return false;
    MP.appState.seq = data.seq;
    MP.appState.nextNoteStart = data.nextNoteStart || MP.seqEndBeat();
    MP.appState.melodyName = data.melodyName || null;
    if (data.bpm) document.getElementById('bpm').value = data.bpm;
    if (data.kbOctave !== undefined) MP.appState.kbOctave = data.kbOctave;
    if (data.prZoom) MP.appState.prZoom = data.prZoom;
    if (data.selectedDur) MP.appState.selectedDur = data.selectedDur;
    if (data.timeSig) MP.appState.timeSig = data.timeSig;
    if (data.snapEnabled !== undefined) MP.appState.snapEnabled = data.snapEnabled;
    return true;
  } catch (e) { return false; }
};

MP.startMetronome = function() {
  clearTimeout(MP.appState.metronomeTimer);
  MP.appState.metronomeTimer = null;
  MP.appState._metroExpectedTime = null;
  MP.appState.metronomeOn = true;
  MP.appState.metronomeBeat = 0;
  var btn = document.getElementById('btn-metronome');
  var indicator = document.getElementById('metro-indicator');
  btn.classList.add('active');
  btn.innerHTML = '&#9201; Stop Met.';
  indicator.style.display = '';
  if (MP.appState.playState) {
    MP.scheduleMetronomeChunk();
  } else {
    MP.tickMetronome();
  }
};

MP.stopMetronome = function() {
  MP.appState.metronomeOn = false;
  clearTimeout(MP.appState.metronomeTimer);
  MP.appState.metronomeTimer = null;
  var btn = document.getElementById('btn-metronome');
  var indicator = document.getElementById('metro-indicator');
  btn.classList.remove('active');
  btn.innerHTML = '&#9201; Metronome';
  indicator.style.display = 'none';
};

function playMetroTick(ctx, absTime, isDownbeat) {
  var og = MP.createOscGain(ctx);
  og.osc.type = 'sine';
  og.osc.frequency.value = isDownbeat ? MP.METRO_FREQ_DOWN : MP.METRO_FREQ_UP;
  og.gain.gain.setValueAtTime(isDownbeat ? MP.METRO_GAIN_DOWN : MP.METRO_GAIN_UP, absTime);
  og.gain.gain.exponentialRampToValueAtTime(MP.AUDIO_RELEASE_MIN, absTime + 0.05);
  og.osc.start(absTime); og.osc.stop(absTime + 0.05);
}

function flashMetroIndicator(isDownbeat) {
  var indicator = document.getElementById('metro-indicator');
  indicator.textContent = isDownbeat ? '\u25CF' : '\u25CB';
  indicator.style.opacity = '1';
  setTimeout(function() { if (MP.appState.metronomeOn) indicator.style.opacity = '0.3'; }, MP.METRO_FLASH_MS);
}

MP.tickMetronome = function() {
  if (!MP.appState.metronomeOn) return;
  if (MP.appState.playState) return;
  var bpm = MP.getBpm();
  var ctx = MP.getAudioCtx();
  var tsBeats = MP.getTimeSigBeats();
  var isDownbeat = (MP.appState.metronomeBeat % tsBeats) === 0;
  playMetroTick(ctx, ctx.currentTime, isDownbeat);
  flashMetroIndicator(isDownbeat);
  MP.appState.metronomeBeat++;
  var interval = 60000 / bpm;
  if (!MP.appState._metroExpectedTime) {
    MP.appState._metroExpectedTime = performance.now() + interval;
  } else {
    MP.appState._metroExpectedTime += interval;
  }
  var drift = MP.appState._metroExpectedTime - performance.now();
  MP.appState.metronomeTimer = setTimeout(MP.tickMetronome, Math.max(0, drift));
};

MP.scheduleMetronomeChunk = function() {
  if (!MP.appState.metronomeOn || !MP.appState.playState) return;
  var ps = MP.appState.playState;
  var tsBeats = MP.getTimeSigBeats();
  var elapsed = ps.ctx.currentTime - ps.startTime;
  var currentBeat = elapsed / ps.beatSec;
  var LOOKAHEAD = 2;
  var lookaheadBeat = currentBeat + LOOKAHEAD / ps.beatSec;
  if (ps.nextMetroBeat === undefined) {
    ps.nextMetroBeat = Math.max(0, Math.ceil(currentBeat));
  }
  while (ps.nextMetroBeat <= lookaheadBeat) {
    var beat = ps.nextMetroBeat;
    var absTime = ps.startTime + beat * ps.beatSec;
    if (absTime >= ps.ctx.currentTime - 0.01) {
      playMetroTick(ps.ctx, absTime, (Math.round(beat) % tsBeats) === 0);
    }
    ps.nextMetroBeat++;
  }
  ps.metroTimer = setTimeout(MP.scheduleMetronomeChunk, MP.SCHEDULE_INTERVAL);
};

MP.updateMetronomeIndicator = function(currentBeat) {
  if (!MP.appState.metronomeOn) return;
  var tsBeats = MP.getTimeSigBeats();
  var beatInt = Math.floor(currentBeat);
  if (beatInt === MP.appState._lastMetroIndicatorBeat) return;
  MP.appState._lastMetroIndicatorBeat = beatInt;
  flashMetroIndicator((beatInt % tsBeats) === 0);
};

MP.resetNextNoteStart = function() { MP.appState.nextNoteStart = MP.seqEndBeat(); };

MP.ensureNextNoteStart = function() {
  MP.appState.nextNoteStart = Math.max(MP.appState.nextNoteStart, MP.seqEndBeat());
};

MP.updateSequence = function() { MP.renderSequence(); MP.generateCode(); };

MP.setBpm = function(val) {
  var v = Math.max(10, Math.min(900, parseInt(val) || 120));
  document.getElementById('bpm').value = v;
  document.getElementById('led-display').textContent = v;
};

MP.copyToClipboard = function(elementId, btn, originalHtml) {
  var el = document.getElementById(elementId);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(el.value).then(function() {
      btn.innerHTML = 'Copied!'; setTimeout(function() { btn.innerHTML = originalHtml; }, MP.COPY_FEEDBACK_MS);
    });
  } else {
    el.select(); document.execCommand('copy');
    btn.innerHTML = 'Copied!'; setTimeout(function() { btn.innerHTML = originalHtml; }, MP.COPY_FEEDBACK_MS);
  }
};

MP.toggleRecording = function() {
  MP.appState.isRecording = !MP.appState.isRecording;
  const btn = document.getElementById('btn-record');
  const indicator = document.getElementById('rec-indicator');
  if (MP.appState.isRecording) {
    btn.classList.add('recording'); btn.innerHTML = '&#9679; Stop Rec';
    indicator.style.display = ''; MP.appState.lastNoteEndTime = 0;
    if (!MP.appState.metronomeOn) MP.startMetronome();
  } else {
    btn.classList.remove('recording'); btn.innerHTML = '&#9679; Record';
    indicator.style.display = 'none';
    if (MP.appState.metronomeOn) MP.stopMetronome();
  }
};

MP.showMidiInfo = function(msg, isError) {
  const el = document.getElementById('midi-info');
  el.textContent = msg; el.style.display = '';
  el.style.color = isError ? '#e06c75' : '';
  setTimeout(() => el.style.display = 'none', MP.MIDI_INFO_MS);
};

MP.showTransposeOverlay = function(direction, isOctave) {
  const container = document.getElementById('piano-roll');
  let overlay = container.parentElement.querySelector('.pr-transpose-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'pr-transpose-overlay';
    container.parentElement.appendChild(overlay);
  }
  const arrow = direction === 'up' ? '\u25B2' : '\u25BC';
  overlay.textContent = isOctave ? arrow + arrow : arrow;
  overlay.classList.remove('show', 'dir-up', 'dir-down');
  void overlay.offsetWidth;
  overlay.classList.add('show', direction === 'up' ? 'dir-up' : 'dir-down');

  document.querySelectorAll('.pr-note').forEach(n => {
    n.classList.remove('transpose-flash');
    void n.offsetWidth;
    n.classList.add('transpose-flash');
  });
};

MP.addNoteFromInput = function(note, pressStart) {
  var holdMs = performance.now() - pressStart;
  var autoMode = document.getElementById('auto-mode').checked;
  var durDenom = autoMode ? (MP.appState.isRecording ? MP.msToClosestDuration(holdMs) : MP.msToDuration(holdMs)) : MP.appState.selectedDur;
  var durBeats = MP.beatsFromDur(durDenom);
  MP.pushUndo();
  if (MP.appState.isRecording && MP.appState.lastNoteEndTime > 0) {
    var gap = pressStart - MP.appState.lastNoteEndTime;
    var bpm = MP.getBpm();
    var gapBeats = gap / (60000 / bpm);
    if (gapBeats > MP.SNAP_BEATS * 0.5) {
      MP.appState.nextNoteStart = MP.seqEndBeat() + Math.max(MP.SNAP_BEATS, MP.snapBeats(gapBeats));
    } else {
      MP.ensureNextNoteStart();
    }
  } else {
    MP.ensureNextNoteStart();
  }
  MP.appState.seq.push({ name: note.name, freq: note.freq, start: MP.appState.nextNoteStart, dur: durBeats });
  MP.appState.nextNoteStart += durBeats;
  if (MP.appState.isRecording) MP.appState.lastNoteEndTime = performance.now();
  MP.appState.pressedNote = null;
  MP.appState.pressedEl = null;
  MP.updateSequence();
  MP.scrollPrToNote(note);
};

MP.scrollPrToNote = function(note) {
  if (MP.appState.currentView !== 'roll') return;
  var container = document.getElementById('piano-roll');
  if (!container) return;
  var midi = MP.midiFromName(note.name);
  if (midi < 0) return;
  var lastNote = MP.appState.seq[MP.appState.seq.length - 1];
  if (!lastNote) return;
  var beatW = MP.PR_BEAT_W * MP.appState.prZoom;
  var noteEndPx = (lastNote.start + lastNote.dur) * beatW + MP.PR_LABEL_W;
  var visRight = container.scrollLeft + container.clientWidth;
  if (noteEndPx > visRight - 40 || noteEndPx < container.scrollLeft + MP.PR_LABEL_W) {
    container.scrollLeft = Math.max(0, noteEndPx - container.clientWidth * 0.7);
  }
  var inner = container.querySelector('.piano-roll-inner');
  if (!inner) return;
  var gridH = parseInt(inner.style.height) - MP.PR_TIMELINE_H;
  var rows = Math.round(gridH / MP.PR_ROW_H);
  var maxMidi = parseInt(inner.dataset.maxMidi);
  if (isNaN(maxMidi)) return;
  var row = maxMidi - midi;
  var noteY = MP.PR_TIMELINE_H + row * MP.PR_ROW_H;
  var visTop = container.scrollTop;
  var visBottom = visTop + container.clientHeight;
  if (noteY < visTop + MP.PR_TIMELINE_H + 10 || noteY + MP.PR_ROW_H > visBottom - 10) {
    container.scrollTop = Math.max(0, noteY - container.clientHeight / 2);
  }
};

MP._toastTimer = null;
MP.showToast = function(msg, isError) {
  const el = document.getElementById('toast');
  clearTimeout(MP._toastTimer);
  el.textContent = msg;
  el.classList.toggle('error', !!isError);
  el.classList.add('visible');
  MP._toastTimer = setTimeout(() => el.classList.remove('visible'), MP.TOAST_MS);
};
