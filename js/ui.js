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
    MP.refreshPianoRoll();
    MP.stopChipHighlight();
  } else {
    MP.stopPlayhead();
    if (MP.appState.playState) MP.startChipHighlight();
  }
};

MP.renderSequence = function() {
  const wasPlaying = !!MP.appState.playState;
  MP.renderChips();
  if (MP.appState.currentView === 'roll') MP.renderPianoRoll();
  if (wasPlaying && MP.appState.currentView === 'roll') MP.startPlayhead();
  MP.autoSave();
  var nameEl = document.getElementById('melody-name');
  if (nameEl) nameEl.textContent = MP.appState.melodyName || '';
  var searchEl = document.getElementById('melody-search');
  if (searchEl) {
    if (MP.appState.melodyName) { searchEl.placeholder = MP.appState.melodyName; searchEl.parentElement.dataset.tip = MP.appState.melodyName; }
    else { searchEl.placeholder = 'Search presets...'; searchEl.parentElement.dataset.tip = 'Search presets'; }
  }
};

MP.autoSave = function() {
  try {
    localStorage.setItem(MP.LS_AUTOSAVE, JSON.stringify({
      v: 1,
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
    if (data.v !== undefined && data.v !== 1) return false;
    if (!Array.isArray(data.seq) || data.seq.length === 0) return false;
    if (!data.seq.every(function(n) { return typeof n.name === 'string' && Number.isFinite(n.freq) && Number.isFinite(n.start) && Number.isFinite(n.dur); })) return false;
    MP.appState.seq = data.seq.filter(function(n) { return n.freq > 0 && n.start >= 0 && n.dur > 0; });
    if (MP.appState.seq.length === 0) return false;
    MP.appState.nextNoteStart = Number.isFinite(data.nextNoteStart) && data.nextNoteStart >= 0 ? data.nextNoteStart : MP.seqEndBeat();
    MP.appState.melodyName = typeof data.melodyName === 'string' ? data.melodyName : null;
    if (Number.isFinite(data.bpm)) document.getElementById('bpm').value = MP.clamp(Math.round(data.bpm), MP.BPM_MIN, MP.BPM_MAX);
    if (Number.isFinite(data.kbOctave)) MP.appState.kbOctave = MP.clamp(Math.floor(data.kbOctave), 0, 8);
    if (Number.isFinite(data.prZoom)) MP.appState.prZoom = MP.clamp(data.prZoom, MP.ZOOM_MIN, MP.ZOOM_MAX);
    if (Number.isFinite(data.selectedDur)) MP.appState.selectedDur = MP.DUR_NAMES[data.selectedDur] ? data.selectedDur : 4;
    if (data.timeSig && Number.isFinite(data.timeSig.beats) && Number.isFinite(data.timeSig.value) && data.timeSig.beats > 0 && data.timeSig.value > 0) MP.appState.timeSig = data.timeSig;
    if (typeof data.snapEnabled === 'boolean') MP.appState.snapEnabled = data.snapEnabled;
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
  btn.classList.add('active');
  btn.innerHTML = '<span class="metro-indicator" id="metro-indicator"></span><span class="btn-text">Stop Met.</span>';
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
  MP._stopMetroOscs();
  var btn = document.getElementById('btn-metronome');
  btn.classList.remove('active');
  btn.innerHTML = '&#9201;<span class="btn-text">Metronome</span>';
};

MP._metroOscs = [];

function playMetroTick(ctx, absTime, isDownbeat) {
  var og = MP.createOscGain(ctx);
  og.osc.type = 'sine';
  og.osc.frequency.value = isDownbeat ? MP.METRO_FREQ_DOWN : MP.METRO_FREQ_UP;
  og.gain.gain.setValueAtTime(isDownbeat ? MP.METRO_GAIN_DOWN : MP.METRO_GAIN_UP, absTime);
  og.gain.gain.exponentialRampToValueAtTime(MP.AUDIO_RELEASE_MIN, absTime + MP.METRO_RELEASE);
  og.osc.start(absTime); og.osc.stop(absTime + MP.METRO_RELEASE);
  MP._metroOscs.push(og.osc);
  og.osc.onended = function() {
    var idx = MP._metroOscs.indexOf(og.osc);
    if (idx >= 0) MP._metroOscs.splice(idx, 1);
  };
}

MP._stopMetroOscs = function() {
  MP._metroOscs.forEach(function(osc) { try { osc.stop(0); } catch(e) {} });
  MP._metroOscs = [];
};

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
  var lookaheadBeat = currentBeat + MP.SCHEDULE_LOOKAHEAD / ps.beatSec;
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
  var end = MP.seqEndBeat();
  MP.appState.nextNoteStart = end > 0 ? Math.max(MP.appState.nextNoteStart, end) : 0;
};

MP._updateRaf = 0;
MP.updateSequence = function(immediate) {
  if (immediate) { MP.renderSequence(); MP.generateCode(); return; }
  if (!MP._updateRaf) {
    MP._updateRaf = requestAnimationFrame(function() { MP._updateRaf = 0; MP.renderSequence(); MP.generateCode(); });
  }
};

MP.clearAll = function() {
  MP.pushUndo(); MP.appState.seq = [];
  var tsBeats = MP.getTimeSigBeats();
  MP.appState.nextNoteStart = tsBeats * 6;
  MP.appState.melodyName = null;
  MP.appState.prZoom = MP.ZOOM_DEFAULT;
  document.getElementById('pr-zoom-input').value = Math.round(MP.ZOOM_DEFAULT * 100) + '%';
  MP.appState.kbOctave = 4;
  MP.updateKeyBindingLabels();
  MP.scrollKbToOctave();
  MP.stopPlayback(); MP.updateSequence();
};

MP.refreshPianoRoll = function() {
  MP.renderPianoRoll();
  if (MP.appState.playState) MP.startPlayhead();
};

MP.downloadBlob = function(blob, filename) {
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

MP.loadRTTTL = function(rtttlString, opts) {
  var result = MP.parseRTTTL(rtttlString);
  if (!result) return null;
  MP.pushUndo();
  MP.clearSelection();
  MP.appState.seq = MP.oldSeqToTimeline(result.notes);
  MP.resetNextNoteStart();
  MP.appState.melodyName = result.name;
  MP.setBpm(result.bpm);
  var wasPlaying = !!MP.appState.playState;
  MP.stopPlayback();
  MP.updateSequence();
  if (wasPlaying) MP.playSequence();
  return result;
};

MP.sanitizeFilename = function(name) {
  return (name || 'Melody').replace(/[^a-zA-Z0-9_\-]/g, '_');
};

MP.clearSelection = function() {
  MP.appState.selectedNoteIdxs.clear();
  document.querySelectorAll('.pr-note.selected').forEach(function(b) { b.classList.remove('selected'); });
  document.querySelectorAll('.pr-sfx-group.selected').forEach(function(b) { b.classList.remove('selected'); });
};

MP.setBpm = function(val) {
  var v = MP.clamp(parseInt(val) || 120, 10, 900);
  document.getElementById('bpm').value = v;
  document.getElementById('led-display').textContent = v;
};

MP.copyToClipboard = function(elementId, btn, originalHtml) {
  var el = document.getElementById(elementId);
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    MP.showToast('Clipboard not available', true);
    return;
  }
  navigator.clipboard.writeText(el.value).then(function() {
    btn.innerHTML = 'Copied!'; setTimeout(function() { btn.innerHTML = originalHtml; }, MP.COPY_FEEDBACK_MS);
  });
};

MP.toggleRecording = function() {
  if (MP.appState._countingIn) return;
  if (!MP.appState.isRecording) {
    var btn = document.getElementById('btn-record');
    btn.classList.add('recording'); btn.innerHTML = '&#9679;<span class="btn-text">Count-in...</span>';
    document.getElementById('btn-mic-record').disabled = true;
    if (!MP.appState.metronomeOn) MP.startMetronome();
    MP.appState._countingIn = true;
    var bpm = MP.getBpm();
    var tsBeats = MP.getTimeSigBeats();
    var countInMs = (60000 / bpm) * tsBeats;
    setTimeout(function() {
      MP.appState._countingIn = false;
      MP.appState.isRecording = true;
      MP.appState.lastNoteEndTime = 0;
      btn.innerHTML = '&#9679;<span class="btn-text">Stop Rec</span>';
    }, countInMs);
  } else {
    MP.appState.isRecording = false;
    var btn = document.getElementById('btn-record');
    btn.classList.remove('recording'); btn.innerHTML = '&#9679;<span class="btn-text">Record</span>';
    document.getElementById('btn-mic-record').disabled = false;
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

MP._pendingScrollNote = null;

MP.scrollPrToNote = function(note) {
  if (MP.appState.currentView !== 'roll') return;
  MP._pendingScrollNote = note;
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
