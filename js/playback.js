MP.playSequence = function(fromBeat) {
  if (MP.appState.seq.length === 0) return;
  MP.removePauseCursor();
  MP._internalStop();
  var playBtn = document.getElementById('btn-play');
  playBtn.innerHTML = '&#9632;<span class="btn-text">Stop</span>';
  playBtn.classList.remove('btn-play');
  playBtn.classList.add('btn-stop');
  MP.dancingCat.start();

  var bpm = MP.getBpm();
  var beatSec = 60 / bpm;
  var ctx = MP.getAudioCtx();
  var startBeat = fromBeat || 0;
  var offsetSec = startBeat * beatSec;

  var totalDur = MP.totalBeats() * beatSec;
  MP.appState.playState = {
    ctx: ctx, scheduleTimer: null,
    startTime: ctx.currentTime - offsetSec,
    beatSec: beatSec, loopOffset: 0,
    loopTotalDur: totalDur,
    scheduled: new Map()
  };
  scheduleChunk();

  if (MP.appState.metronomeOn) {
    clearTimeout(MP.appState.metronomeTimer);
    MP.appState.metronomeTimer = null;
    MP.appState._lastMetroIndicatorBeat = -1;
    MP.scheduleMetronomeChunk();
  }

  if (MP.appState.currentView === 'roll') MP.startPlayhead();
  if (MP.appState.currentView === 'chips') MP.startChipHighlight();
};

function scheduleNote(ps, n) {
  var ctx = ps.ctx, startTime = ps.startTime, beatSec = ps.beatSec;
  var noteStart = ps.loopOffset + n.start * beatSec;
  var noteDur = n.dur * beatSec;
  var absStart = Math.max(ctx.currentTime, startTime + noteStart);
  var absEnd = startTime + noteStart + noteDur;
  if (absEnd <= ctx.currentTime) { ps.scheduled.set(n, { s: n.start, d: n.dur }); return; }
  var entry = { s: n.start, d: n.dur };
  if (MP._serialWriter) {
    var delayMs = (absStart - ctx.currentTime) * 1000;
    setTimeout(function(f, d) { return function() { MP.sendSerialNote(f, d); }; }(n.freq, noteDur * 1000), Math.max(0, delayMs));
  } else {
    var releaseTime = Math.min(0.08, (absEnd - absStart) * 0.15);
    var og = MP.createOscGain(ctx);
    og.osc.type = MP.AUDIO_OSC_TYPE; og.osc.frequency.value = n.freq;
    og.gain.gain.setValueAtTime(MP.AUDIO_GAIN, absStart);
    og.gain.gain.setValueAtTime(MP.AUDIO_GAIN, absEnd - releaseTime);
    og.gain.gain.exponentialRampToValueAtTime(MP.AUDIO_RELEASE_MIN, absEnd);
    og.osc.start(absStart); og.osc.stop(absEnd);
    entry.osc = og.osc;
  }
  ps.scheduled.set(n, entry);
}

function scheduleChunk() {
  if (!MP.appState.playState) return;
  var ps = MP.appState.playState;
  var beatSec = ps.beatSec;
  var now = ps.ctx.currentTime - ps.startTime;
  var seq = MP.appState.seq;

  for (var i = 0; i < seq.length; i++) {
    var n = seq[i];
    var prev = ps.scheduled.get(n);
    if (prev) {
      if (prev.s === n.start && prev.d === n.dur) continue;
      if (prev.osc) try { prev.osc.stop(0); } catch(e) {}
      ps.scheduled.delete(n);
    }
    var noteStart = ps.loopOffset + n.start * beatSec;
    if (noteStart > now + MP.SCHEDULE_LOOKAHEAD) continue;
    scheduleNote(ps, n);
  }

  var liveTotalDur = MP.totalBeats() * beatSec;
  var noteEndDur = MP.seqEndBeat() * beatSec;
  if (liveTotalDur < ps.loopTotalDur) ps.loopTotalDur = liveTotalDur;
  if (noteEndDur > ps.loopTotalDur) ps.loopTotalDur = liveTotalDur;
  var loopDur = ps.loopTotalDur;
  if (MP.appState.loopEnabled && loopDur > 0 && now >= ps.loopOffset + loopDur - MP.SCHEDULE_LOOKAHEAD) {
    ps.loopOffset += loopDur;
    ps.loopTotalDur = liveTotalDur;
    ps.scheduled = new Map();
  }

  if (!MP.appState.loopEnabled && now >= liveTotalDur) {
    MP.stopPlayback();
    return;
  }

  ps.scheduleTimer = setTimeout(scheduleChunk, MP.SCHEDULE_INTERVAL);
}

MP._internalStop = function() {
  MP.stopPlayhead();
  MP.stopChipHighlight();
  if (MP.appState.playState) {
    clearTimeout(MP.appState.playState.scheduleTimer);
    clearTimeout(MP.appState.playState.metroTimer);
    MP.appState.playState.scheduled.forEach(function(entry) {
      if (entry.osc) try { entry.osc.stop(0); } catch(e) {}
    });
    MP.appState.playState = null;
  }
  var playBtn = document.getElementById('btn-play');
  playBtn.innerHTML = '&#9654;<span class="btn-text">Play</span>';
  playBtn.classList.remove('btn-stop');
  playBtn.classList.add('btn-play');
  MP.dancingCat.stop();
  clearTimeout(MP.appState.metronomeTimer);
  MP.appState.metronomeTimer = null;
  if (MP._stopMetroOscs) MP._stopMetroOscs();
};

MP._restoreStandaloneMetronome = function() {
  if (MP.appState.metronomeOn) {
    MP.appState.metronomeBeat = 0;
    MP.appState._metroExpectedTime = null;
    MP.tickMetronome();
  }
};

MP.refreshPlayback = function() {
  if (!MP.appState.playState) return;
  var elapsed = MP.appState.playState.ctx.currentTime - MP.appState.playState.startTime;
  var currentBeat = elapsed / MP.appState.playState.beatSec;
  MP.playSequence(currentBeat);
};

MP.pausePlayback = function() {
  var ps = MP.appState.playState;
  if (!ps) return;
  var elapsed = ps.ctx.currentTime - ps.startTime - ps.loopOffset;
  MP.appState.pausedBeat = elapsed / ps.beatSec;
  MP.stopPlayback();
  MP.showPauseCursor();
};

MP.showPauseCursor = function() {
  MP.removePauseCursor();
  if (MP.appState.pausedBeat == null || MP.appState.currentView !== 'roll') return;
  var container = document.getElementById('piano-roll');
  var inner = container ? container.querySelector('.piano-roll-inner') : null;
  if (!inner) return;
  var beatW = MP.PR_BEAT_W * MP.appState.prZoom;
  var px = MP.appState.pausedBeat * beatW;
  var gridH = parseInt(inner.style.height) - MP.PR_TIMELINE_H;
  var line = document.createElement('div');
  line.className = 'pr-pause-cursor';
  line.style.left = (MP.PR_LABEL_W + px) + 'px';
  line.style.top = MP.PR_TIMELINE_H + 'px';
  line.style.height = gridH + 'px';
  var marker = document.createElement('div');
  marker.className = 'pr-pause-marker';
  marker.style.left = (MP.PR_LABEL_W + px) + 'px';
  inner.appendChild(line);
  inner.appendChild(marker);
};

MP.removePauseCursor = function() {
  var inner = document.querySelector('.piano-roll-inner');
  if (!inner) return;
  var el = inner.querySelector('.pr-pause-cursor'); if (el) el.remove();
  var mk = inner.querySelector('.pr-pause-marker'); if (mk) mk.remove();
};

MP.stopPlayback = function() {
  var wasRecording = MP.appState.isRecording;
  MP._internalStop();
  if (wasRecording) MP.toggleRecording();
  else MP._restoreStandaloneMetronome();
};

MP.startPlayhead = function() {
  MP.stopPlayhead();
  var container = document.getElementById('piano-roll');
  var inner = container.querySelector('.piano-roll-inner');
  if (!inner || !MP.appState.playState) return;

  var existing = inner.querySelector('.pr-playhead');
  if (existing) existing.remove();

  var gridH = parseInt(inner.style.height) - MP.PR_TIMELINE_H;
  var line = document.createElement('div');
  line.className = 'pr-playhead';
  line.style.left = MP.PR_LABEL_W + 'px';
  line.style.top = MP.PR_TIMELINE_H + 'px';
  line.style.height = gridH + 'px';
  inner.appendChild(line);

  var measureHL = document.createElement('div');
  measureHL.className = 'pr-measure-highlight';
  measureHL.style.top = MP.PR_TIMELINE_H + 'px';
  measureHL.style.height = gridH + 'px';
  inner.appendChild(measureHL);
  var lastMeasure = -1;
  var tsBeats = MP.getTimeSigBeats();
  var beatW = MP.PR_BEAT_W * MP.appState.prZoom;

  function animate() {
    if (!MP.appState.playState) { MP.stopPlayhead(); return; }
    var elapsed = MP.appState.playState.ctx.currentTime - MP.appState.playState.startTime;
    var totalBeats = MP.totalBeats();
    if (totalBeats <= 0) { MP.stopPlayhead(); return; }
    var currentBeat;
    if (MP.appState.loopEnabled && totalBeats > 0) {
      var loopBeats = MP.appState.playState.loopTotalDur / MP.appState.playState.beatSec;
      currentBeat = (elapsed - MP.appState.playState.loopOffset) / MP.appState.playState.beatSec;
      currentBeat = ((currentBeat % loopBeats) + loopBeats) % loopBeats;
    } else {
      currentBeat = elapsed / MP.appState.playState.beatSec;
    }
    var px = currentBeat * beatW;
    line.style.left = (MP.PR_LABEL_W + px) + 'px';
    MP.updateMetronomeIndicator(currentBeat);

    var curMeasure = Math.floor(currentBeat / tsBeats);
    if (curMeasure !== lastMeasure) {
      lastMeasure = curMeasure;
      var measureStart = curMeasure * tsBeats;
      var measureEnd = Math.min(measureStart + tsBeats, totalBeats);
      measureHL.style.left = (MP.PR_LABEL_W + measureStart * beatW) + 'px';
      measureHL.style.width = ((measureEnd - measureStart) * beatW) + 'px';
    }

    var visLeft = container.scrollLeft;
    var visRight = visLeft + container.clientWidth;
    var headPos = MP.PR_LABEL_W + px;
    if (headPos > visRight - 40 || headPos < visLeft + MP.PR_LABEL_W + 10) {
      container.scrollLeft = Math.max(0, headPos - container.clientWidth / 3);
    }
    MP.appState.playheadRAF = requestAnimationFrame(animate);
  }
  MP.appState.playheadRAF = requestAnimationFrame(animate);
};

MP.startChipHighlight = function() {
  MP.stopChipHighlight();
  if (!MP.appState.playState) return;
  var flat = MP.seqToFlat();
  if (flat.length === 0) return;
  var cumBeats = [];
  var cursor = 0;
  flat.forEach(function(n) { cumBeats.push(cursor); cursor += n._beats; });
  var totalBeats = cursor;
  var chips = document.querySelectorAll('#sequence .note-chip');
  var lastIdx = -1;

  function animate() {
    if (!MP.appState.playState) { MP.stopChipHighlight(); return; }
    var elapsed = MP.appState.playState.ctx.currentTime - MP.appState.playState.startTime;
    var beat;
    if (MP.appState.loopEnabled && totalBeats > 0) {
      var loopBeats = MP.appState.playState.loopTotalDur / MP.appState.playState.beatSec;
      beat = (elapsed - MP.appState.playState.loopOffset) / MP.appState.playState.beatSec;
      beat = ((beat % loopBeats) + loopBeats) % loopBeats;
    } else {
      beat = elapsed / MP.appState.playState.beatSec;
    }
    var idx = 0;
    for (var i = cumBeats.length - 1; i >= 0; i--) {
      if (beat >= cumBeats[i]) { idx = i; break; }
    }
    if (idx !== lastIdx) {
      if (lastIdx >= 0 && lastIdx < chips.length) chips[lastIdx].classList.remove('playing');
      if (idx < chips.length) {
        chips[idx].classList.add('playing');
        chips[idx].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      lastIdx = idx;
    }
    MP.appState.chipHighlightRAF = requestAnimationFrame(animate);
  }
  MP.appState.chipHighlightRAF = requestAnimationFrame(animate);
};

MP.stopChipHighlight = function() {
  if (MP.appState.chipHighlightRAF) {
    cancelAnimationFrame(MP.appState.chipHighlightRAF);
    MP.appState.chipHighlightRAF = null;
  }
  document.querySelectorAll('#sequence .note-chip.playing').forEach(function(c) { c.classList.remove('playing'); });
};

MP.stopPlayhead = function() {
  if (MP.appState.playheadRAF) {
    cancelAnimationFrame(MP.appState.playheadRAF);
    MP.appState.playheadRAF = null;
  }
  var inner = document.querySelector('.piano-roll-inner');
  if (inner) {
    var ph = inner.querySelector('.pr-playhead'); if (ph) ph.remove();
    var mh = inner.querySelector('.pr-measure-highlight'); if (mh) mh.remove();
  }
};

document.addEventListener('visibilitychange', function() {
  if (document.hidden && MP.appState.playState) {
    MP.pausePlayback();
  }
});
