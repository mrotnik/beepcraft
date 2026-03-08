MP.beatsFromDur = function(d) { return 4 / d; };

MP.durFromBeats = function(b) {
  if (b <= 0) return { dur: 64, dotted: false };
  const options = [1, 2, 4, 8, 16, 32, 64, 128];
  let best = 4, bestDist = Infinity, bestDotted = false;
  options.forEach(d => {
    const plain = 4 / d;
    const dot = plain * 1.5;
    const distPlain = Math.abs(b - plain);
    const distDot = Math.abs(b - dot);
    if (distPlain < bestDist) { bestDist = distPlain; best = d; bestDotted = false; }
    if (distDot < bestDist) { bestDist = distDot; best = d; bestDotted = true; }
  });
  return { dur: best, dotted: bestDotted };
};

MP.snapBeats = function(b) {
  var step = MP.appState.snapEnabled ? MP.SNAP_BEATS : MP.FINE_SNAP_BEATS;
  return Math.max(0, Math.round(b / step) * step);
};

MP.seqEndBeat = function() {
  const seq = MP.appState.seq;
  if (seq.length === 0) return 0;
  return Math.max(...seq.map(n => n.start + n.dur));
};

MP.seqToFlat = function() {
  const seq = MP.appState.seq;
  if (seq.length === 0 && MP.appState.nextNoteStart <= 0) return [];
  const sorted = [...seq].sort((a, b) => a.start - b.start);
  const flat = [];
  let cursor = 0;
  sorted.forEach(n => {
    const gap = n.start - cursor;
    if (gap > 0.03) {
      const gd = MP.durFromBeats(gap);
      flat.push({ name: 'REST', freq: 0, dur: gd.dur, dotted: gd.dotted, _beats: gap });
    }
    const nd = MP.durFromBeats(n.dur);
    flat.push({ name: n.name, freq: n.freq, dur: nd.dur, dotted: nd.dotted, _beats: n.dur, _seqRef: n });
    cursor = n.start + n.dur;
  });
  const trailing = MP.appState.nextNoteStart - cursor;
  if (trailing > 0.03) {
    const td = MP.durFromBeats(trailing);
    flat.push({ name: 'REST', freq: 0, dur: td.dur, dotted: td.dotted, _beats: trailing });
  }
  return flat;
};

MP.oldSeqToTimeline = function(oldSeq) {
  const result = [];
  let cursor = 0;
  oldSeq.forEach(n => {
    const beats = MP.beatsFromDur(n.dur) * (n.dotted ? 1.5 : 1);
    if (n.freq > 0) {
      result.push({ name: n.name, freq: n.freq, start: cursor, dur: beats });
    }
    cursor += beats;
  });
  return result;
};

MP.rebuildSeqFromFlat = function(flat) {
  const newSeq = [];
  let cursor = 0;
  flat.forEach(n => {
    if (n.freq > 0) {
      newSeq.push({ name: n.name, freq: n.freq, start: cursor, dur: n._beats });
    }
    cursor += n._beats;
  });
  return newSeq;
};

MP.msToDuration = function(ms) {
  const bpm = MP.getBpm();
  const quarterMs = 60000 / bpm;
  if (ms >= quarterMs * 2.8) return 1;
  if (ms >= quarterMs * 1.4) return 2;
  if (ms >= quarterMs * 0.6) return 4;
  if (ms >= quarterMs * 0.25) return 8;
  if (ms >= quarterMs * 0.12) return 16;
  if (ms >= quarterMs * 0.06) return 32;
  if (ms >= quarterMs * 0.03) return 64;
  return 128;
};

MP.msToClosestDuration = function(ms) {
  const bpm = MP.getBpm();
  const quarterMs = 60000 / bpm;
  if (ms <= 0) return 128;
  const durations = [
    { val: 1, ms: quarterMs * 4 }, { val: 2, ms: quarterMs * 2 },
    { val: 4, ms: quarterMs }, { val: 8, ms: quarterMs / 2 },
    { val: 16, ms: quarterMs / 4 }, { val: 32, ms: quarterMs / 8 },
    { val: 64, ms: quarterMs / 16 }, { val: 128, ms: quarterMs / 32 },
  ];
  let best = durations[2], bestDist = Infinity;
  durations.forEach(d => {
    const dist = Math.abs(Math.log(ms) - Math.log(d.ms));
    if (dist < bestDist) { bestDist = dist; best = d; }
  });
  return best.val;
};
