MP.beatsFromDur = function(d) { return 4 / d; };

MP.durFromBeats = function(b) {
  if (b <= 0) return { dur: 64, dotted: false };
  var options = MP.DUR_VALUES;
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
  if (MP.appState.snapEnabled) {
    return Math.max(0, Math.round(b / MP.SNAP_BEATS) * MP.SNAP_BEATS);
  }
  var fine = Math.max(0, Math.round(b / MP.FINE_SNAP_BEATS) * MP.FINE_SNAP_BEATS);
  var nearest = Math.round(fine / MP.SNAP_BEATS) * MP.SNAP_BEATS;
  if (Math.abs(fine - nearest) < MP.MAGNETIC_THRESHOLD) return nearest;
  return fine;
};

MP.seqEndBeat = function() {
  var seq = MP.appState.seq;
  var m = 0;
  for (var i = 0; i < seq.length; i++) {
    var e = seq[i].start + seq[i].dur;
    if (e > m) m = e;
  }
  return m;
};

MP.totalBeats = function() {
  var end = Math.max(MP.seqEndBeat(), MP.appState.nextNoteStart);
  if (end <= 0) return MP.getTimeSigBeats() * 6;
  return end;
};

MP.seqToFlat = function() {
  const seq = MP.appState.seq;
  if (seq.length === 0 && MP.appState.nextNoteStart <= 0) return [];
  const sorted = [...seq].sort((a, b) => a.start - b.start);
  const flat = [];
  let cursor = 0;
  sorted.forEach(n => {
    const gap = n.start - cursor;
    if (gap > MP.REST_GAP_THRESHOLD) {
      const gd = MP.durFromBeats(gap);
      flat.push({ name: 'REST', freq: 0, dur: gd.dur, dotted: gd.dotted, _beats: gap });
    }
    const nd = MP.durFromBeats(n.dur);
    flat.push({ name: n.name, freq: n.freq, dur: nd.dur, dotted: nd.dotted, _beats: n.dur, _seqRef: n });
    cursor = n.start + n.dur;
  });
  const trailing = MP.appState.nextNoteStart - cursor;
  if (trailing > MP.REST_GAP_THRESHOLD) {
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
  var durations = MP.DUR_VALUES.map(function(d) { return { val: d, ms: quarterMs * 4 / d }; });
  let best = durations[2], bestDist = Infinity;
  durations.forEach(d => {
    const dist = Math.abs(Math.log(ms) - Math.log(d.ms));
    if (dist < bestDist) { bestDist = dist; best = d; }
  });
  return best.val;
};

MP.hasOverlappingNotes = function() {
  var seq = MP.appState.seq;
  if (seq.length <= 1) return false;
  var sorted = [...seq].sort(function(a, b) { return a.start - b.start; });
  for (var i = 1; i < sorted.length; i++) {
    if (sorted[i].start < sorted[i - 1].start + sorted[i - 1].dur - 0.001) return true;
  }
  return false;
};
