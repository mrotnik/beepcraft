MP.playSequence = function(fromBeat) {
  if (MP.appState.seq.length === 0) return;
  MP._internalStop();
  var playBtn = document.getElementById('btn-play');
  playBtn.innerHTML = '&#9632; Stop';
  playBtn.classList.remove('btn-play');
  playBtn.classList.add('btn-stop');
  MP.dancingCat.start();

  const bpm = MP.getBpm();
  const beatSec = 60 / bpm;
  const ctx = MP.getAudioCtx();
  const startBeat = fromBeat || 0;
  const sorted = [...MP.appState.seq].sort((a, b) => a.start - b.start);
  const totalDur = Math.max(MP.seqEndBeat(), MP.appState.nextNoteStart) * beatSec;

  let startIdx = 0;
  if (startBeat > 0) {
    while (startIdx < sorted.length && sorted[startIdx].start + sorted[startIdx].dur <= startBeat) startIdx++;
  }

  const offsetSec = startBeat * beatSec;
  MP.appState.playState = { ctx, scheduleTimer: null, idx: startIdx, startTime: ctx.currentTime - offsetSec, beatSec, totalDur, sorted };
  scheduleChunk();

  if (MP.appState.metronomeOn) {
    clearTimeout(MP.appState.metronomeTimer);
    MP.appState.metronomeTimer = null;
    MP.appState._lastMetroIndicatorBeat = -1;
    MP.scheduleMetronomeChunk();
  }

  if (!MP.appState.loopEnabled) {
    MP.appState.playTimeout = setTimeout(MP.stopPlayback, (totalDur - offsetSec) * 1000 + 200);
  }

  if (MP.appState.currentView === 'roll') MP.startPlayhead();
  if (MP.appState.currentView === 'chips') MP.startChipHighlight();
};

function scheduleChunk() {
  if (!MP.appState.playState) return;
  const { ctx, startTime, beatSec, sorted } = MP.appState.playState;
  const LOOKAHEAD = 2;
  const now = ctx.currentTime - startTime;

  while (MP.appState.playState.idx < sorted.length) {
    const n = sorted[MP.appState.playState.idx];
    const noteStart = n.start * beatSec;
    if (noteStart > now + LOOKAHEAD) break;
    MP.appState.playState.idx++;
    const noteDur = n.dur * beatSec;
    const absStart = Math.max(ctx.currentTime, startTime + noteStart);
    const absEnd = startTime + noteStart + noteDur;
    if (absEnd <= ctx.currentTime) continue;
    if (MP._serialWriter) {
      var delayMs = (absStart - ctx.currentTime) * 1000;
      setTimeout(() => MP.sendSerialNote(n.freq, noteDur * 1000), Math.max(0, delayMs));
    } else {
      const releaseTime = Math.min(0.08, (absEnd - absStart) * 0.15);
      const og = MP.createOscGain(ctx);
      const osc = og.osc, gain = og.gain;
      osc.type = MP.AUDIO_OSC_TYPE; osc.frequency.value = n.freq;
      gain.gain.setValueAtTime(MP.AUDIO_GAIN, absStart);
      gain.gain.setValueAtTime(MP.AUDIO_GAIN, absEnd - releaseTime);
      gain.gain.exponentialRampToValueAtTime(MP.AUDIO_RELEASE_MIN, absEnd);
      osc.start(absStart); osc.stop(absEnd);
    }
  }

  if (MP.appState.playState.idx < sorted.length) {
    MP.appState.playState.scheduleTimer = setTimeout(scheduleChunk, 500);
  } else if (MP.appState.loopEnabled) {
    const loopDelay = MP.appState.playState.totalDur * 1000 - (ctx.currentTime - startTime) * 1000 + 100;
    MP.appState.playState.scheduleTimer = setTimeout(() => {
      if (!MP.appState.playState) return;
      MP.appState.playState.idx = 0;
      MP.appState.playState.startTime = MP.appState.playState.ctx.currentTime;
      if (MP.appState.currentView === 'roll') MP.startPlayhead();
      if (MP.appState.metronomeOn) {
        MP.appState.playState.nextMetroBeat = 0;
        MP.scheduleMetronomeChunk();
      }
      scheduleChunk();
    }, Math.max(0, loopDelay));
  }
}

MP._internalStop = function() {
  clearTimeout(MP.appState.playTimeout);
  MP.stopPlayhead();
  MP.stopChipHighlight();
  if (MP.appState.playState) {
    clearTimeout(MP.appState.playState.scheduleTimer);
    clearTimeout(MP.appState.playState.metroTimer);
    MP.appState.playState = null;
  }
  var playBtn = document.getElementById('btn-play');
  playBtn.innerHTML = '&#9654; Play';
  playBtn.classList.remove('btn-stop');
  playBtn.classList.add('btn-play');
  MP.dancingCat.stop();
  clearTimeout(MP.appState.metronomeTimer);
  MP.appState.metronomeTimer = null;
  MP.closeAudioCtx();
  if (MP.appState.metronomeOn) {
    MP.appState.metronomeBeat = 0;
    MP.tickMetronome();
  }
};

MP.refreshPlayback = function() {
  if (!MP.appState.playState) return;
  const elapsed = MP.appState.playState.ctx.currentTime - MP.appState.playState.startTime;
  const currentBeat = elapsed / MP.appState.playState.beatSec;
  MP.playSequence(currentBeat);
};

MP.stopPlayback = function() {
  var wasRecording = MP.appState.isRecording;
  MP._internalStop();
  if (wasRecording) MP.toggleRecording();
};

MP.startPlayhead = function() {
  MP.stopPlayhead();
  const container = document.getElementById('piano-roll');
  const inner = container.querySelector('.piano-roll-inner');
  if (!inner || !MP.appState.playState) return;

  const existing = inner.querySelector('.pr-playhead');
  if (existing) existing.remove();

  const gridH = parseInt(inner.style.height) - MP.PR_TIMELINE_H;
  const line = document.createElement('div');
  line.className = 'pr-playhead';
  line.style.left = MP.PR_LABEL_W + 'px';
  line.style.top = MP.PR_TIMELINE_H + 'px';
  line.style.height = gridH + 'px';
  inner.appendChild(line);

  const measureHL = document.createElement('div');
  measureHL.className = 'pr-measure-highlight';
  measureHL.style.top = MP.PR_TIMELINE_H + 'px';
  measureHL.style.height = gridH + 'px';
  inner.appendChild(measureHL);
  var lastMeasure = -1;
  var tsBeats = MP.getTimeSigBeats();
  var beatW = MP.PR_BEAT_W * MP.appState.prZoom;

  function animate() {
    if (!MP.appState.playState) { MP.stopPlayhead(); return; }
    const elapsed = MP.appState.playState.ctx.currentTime - MP.appState.playState.startTime;
    if (MP.appState.playState.totalDur <= 0) { MP.stopPlayhead(); return; }
    var currentBeat = elapsed / MP.appState.playState.beatSec;
    var totalBeats = MP.appState.playState.totalDur / MP.appState.playState.beatSec;
    if (MP.appState.loopEnabled && totalBeats > 0) currentBeat = currentBeat % totalBeats;
    const px = currentBeat * beatW;
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

    const visLeft = container.scrollLeft;
    const visRight = visLeft + container.clientWidth;
    const headPos = MP.PR_LABEL_W + px;
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
  const flat = MP.seqToFlat();
  if (flat.length === 0) return;
  const cumBeats = [];
  let cursor = 0;
  flat.forEach(n => { cumBeats.push(cursor); cursor += n._beats; });
  const totalBeats = cursor;
  const chips = document.querySelectorAll('#sequence .note-chip');
  let lastIdx = -1;

  function animate() {
    if (!MP.appState.playState) { MP.stopChipHighlight(); return; }
    const elapsed = MP.appState.playState.ctx.currentTime - MP.appState.playState.startTime;
    let beat = elapsed / MP.appState.playState.beatSec;
    if (MP.appState.loopEnabled && totalBeats > 0) beat = beat % totalBeats;
    let idx = 0;
    for (let i = cumBeats.length - 1; i >= 0; i--) {
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
  document.querySelectorAll('#sequence .note-chip.playing').forEach(c => c.classList.remove('playing'));
};

MP.stopPlayhead = function() {
  if (MP.appState.playheadRAF) {
    cancelAnimationFrame(MP.appState.playheadRAF);
    MP.appState.playheadRAF = null;
  }
  const inner = document.querySelector('.piano-roll-inner');
  if (inner) {
    const ph = inner.querySelector('.pr-playhead'); if (ph) ph.remove();
    const mh = inner.querySelector('.pr-measure-highlight'); if (mh) mh.remove();
  }
};
