MP.SFX_PRESETS = {
  laser:   { startFreq: 3000, endFreq: 300,  durationMs: 200, curve: 'exponential', grains: 20 },
  explosion: { startFreq: 800, endFreq: 100, durationMs: 400, curve: 'random',      grains: 30 },
  jump:    { startFreq: 200,  endFreq: 1200, durationMs: 150, curve: 'exponential', grains: 16 },
  coin:    { startFreq: 988,  endFreq: 1319, durationMs: 150, curve: 'linear',      grains: 2  },
  powerup: { startFreq: 400,  endFreq: 2000, durationMs: 300, curve: 'exponential', grains: 24 },
  death:   { startFreq: 600,  endFreq: 80,   durationMs: 500, curve: 'linear',      grains: 4, wave: 'square' },
  hit:     { startFreq: 800,  endFreq: 200,  durationMs: 60,  curve: 'linear',      grains: 4  },
  fall:    { startFreq: 1000, endFreq: 100,  durationMs: 600, curve: 'exponential', grains: 17, wave: 'square' },
  siren:   { startFreq: 600,  endFreq: 1200, durationMs: 800, curve: 'linear',      grains: 48 },
  blip:    { startFreq: 1500, endFreq: 2000, durationMs: 50,  curve: 'linear',      grains: 2  },
  alarm:   { startFreq: 1400, endFreq: 1800, durationMs: 500, curve: 'sawtooth', grains: 30, wave: 'square' },
  alarm2:  { startFreq: 800,  endFreq: 2000, durationMs: 600, curve: 'pingpong',    grains: 40 },
  zap:     { startFreq: 4500, endFreq: 150,  durationMs: 100, curve: 'exponential', grains: 24 },
  whoosh:  { startFreq: 200,  endFreq: 3000, durationMs: 250, curve: 'exponential', grains: 32 },
  chirp:   { startFreq: 2000, endFreq: 4000, durationMs: 80,  curve: 'exponential', grains: 8  },
  stomp:   { startFreq: 400,  endFreq: 60,   durationMs: 80,  curve: 'exponential', grains: 6  },
  glitch:  { startFreq: 3000, endFreq: 500,  durationMs: 300, curve: 'random',      grains: 48 },
  warp:    { startFreq: 150,  endFreq: 5000, durationMs: 500, curve: 'exponential', grains: 40 },
  buzz:    { startFreq: 100,  endFreq: 120,  durationMs: 2000, curve: 'random',      grains: 50, wave: 'square' },
  motor:   { startFreq: 37,   endFreq: 45,   durationMs: 2000, curve: 'random',      grains: 50, wave: 'square' },
  meow:    { startFreq: 700,  endFreq: 900,  durationMs: 400, curve: 'pingpong',   grains: 24, wave: 'sine' },
  bark:    { startFreq: 600,  endFreq: 300,  durationMs: 120, curve: 'exponential', grains: 6,  wave: 'square' },
  bark2:   { startFreq: 162,  endFreq: 755,  durationMs: 115, curve: 'pingpong',    grains: 17, wave: 'square' },
  bird:    { startFreq: 2500, endFreq: 4000, durationMs: 200, curve: 'pingpong',   grains: 16, wave: 'sine' },
  cricket: { startFreq: 3437, endFreq: 3253, durationMs: 127, curve: 'sawtooth', grains: 64, wave: 'square' },
  duck:    { startFreq: 800,  endFreq: 500,  durationMs: 200, curve: 'linear',     grains: 8,  wave: 'sawtooth' },
  owl:     { startFreq: 500,  endFreq: 350,  durationMs: 600, curve: 'exponential', grains: 12, wave: 'sine' },
  snake:   { startFreq: 3000, endFreq: 6000, durationMs: 500, curve: 'random',     grains: 50, wave: 'sawtooth' },
  oneup:   { startFreq: 660,  endFreq: 1320, durationMs: 300, curve: 'stairs',      grains: 6 },
  gameover:{ startFreq: 800,  endFreq: 100,  durationMs: 800, curve: 'stairs',      grains: 12 },
  select:  { startFreq: 1200, endFreq: 1600, durationMs: 60,  curve: 'linear',      grains: 2 },
  dooropen:{ startFreq: 300,  endFreq: 800,  durationMs: 400, curve: 'stairs',      grains: 8 },
  itemget: { startFreq: 800,  endFreq: 2400, durationMs: 250, curve: 'stairs',      grains: 6 },
  lvlup:   { startFreq: 500,  endFreq: 2000, durationMs: 600, curve: 'stairs',      grains: 10 },
  warppipe:{ startFreq: 200,  endFreq: 600,  durationMs: 500, curve: 'wobble',      grains: 32 },
  phaser:  { startFreq: 1500, endFreq: 300,  durationMs: 300, curve: 'scurve',      grains: 24 },
  shield:  { startFreq: 2000, endFreq: 3000, durationMs: 200, curve: 'bounce',      grains: 16 },
  teleport:{ startFreq: 800,  endFreq: 4000, durationMs: 400, curve: 'exponential', grains: 32, wave: 'sine' },
  enghum:  { startFreq: 80,   endFreq: 120,  durationMs: 1500,curve: 'wobble',      grains: 50, wave: 'sawtooth' },
  commbeep:{ startFreq: 1800, endFreq: 2200, durationMs: 100, curve: 'pingpong',    grains: 4 },
  thunder: { startFreq: 60,   endFreq: 200,  durationMs: 800, curve: 'random',      grains: 50, wave: 'sawtooth', times: [0,0.01,0.02,0.03,0.04,0.05,0.06,0.07,0.08,0.09,0.10,0.11,0.12,0.14,0.16,0.18,0.21,0.24,0.27,0.30,0.34,0.38,0.42,0.46,0.50,0.54,0.58,0.62,0.66,0.69,0.72,0.74,0.76,0.78,0.80,0.82,0.84,0.85,0.87,0.88,0.89,0.90,0.91,0.92,0.93,0.94,0.95,0.96,0.98,1] },
  wind:    { startFreq: 300,  endFreq: 800,  durationMs: 1500,curve: 'noise',       grains: 50, wave: 'sawtooth' },
  drop:    { startFreq: 2000, endFreq: 400,  durationMs: 150, curve: 'logarithmic', grains: 10, wave: 'sine' },
  bee:     { startFreq: 200,  endFreq: 250,  durationMs: 1000,curve: 'wobble',      grains: 50, wave: 'square' },
  rain:    { startFreq: 1000, endFreq: 3000, durationMs: 500, curve: 'random',      grains: 40, wave: 'sawtooth', times: [0,0.01,0.04,0.06,0.08,0.12,0.14,0.16,0.20,0.22,0.25,0.28,0.30,0.33,0.36,0.38,0.41,0.44,0.47,0.49,0.51,0.54,0.57,0.59,0.62,0.64,0.67,0.70,0.72,0.74,0.77,0.79,0.82,0.84,0.87,0.89,0.91,0.94,0.97,1] },
  click:   { startFreq: 2000, endFreq: 1000, durationMs: 20,  curve: 'linear',      grains: 2 },
  gear:    { startFreq: 200,  endFreq: 400,  durationMs: 300, curve: 'sawtooth',    grains: 20 },
  spring:  { startFreq: 2000, endFreq: 200,  durationMs: 300, curve: 'bounce',      grains: 24, wave: 'sine' },
  brake:   { startFreq: 3000, endFreq: 1000, durationMs: 400, curve: 'noise',       grains: 40 },
  drill:   { startFreq: 100,  endFreq: 150,  durationMs: 1000,curve: 'random',      grains: 50, wave: 'square' },
  trill:   { startFreq: 1000, endFreq: 1200, durationMs: 200, curve: 'pingpong',    grains: 12, wave: 'sine' },
  gliss:   { startFreq: 262,  endFreq: 523,  durationMs: 300, curve: 'scurve',      grains: 24, wave: 'sine' },
  vibrato: { startFreq: 440,  endFreq: 460,  durationMs: 500, curve: 'wobble',      grains: 40, wave: 'sine' },
  heartbeat:{ startFreq: 80,  endFreq: 120,  durationMs: 600, curve: 'bounce',      grains: 16, wave: 'sine', times: [0,0.04,0.08,0.12,0.16,0.20,0.24,0.28,0.45,0.49,0.53,0.57,0.61,0.65,0.69,1] },
  ufo:     { startFreq: 400,  endFreq: 2000, durationMs: 800, curve: 'wobble',      grains: 40, wave: 'sine' },
  steam:   { startFreq: 500,  endFreq: 2000, durationMs: 600, curve: 'noise',       grains: 50, wave: 'sawtooth' },
  arcade:  { startFreq: 500,  endFreq: 1500, durationMs: 400, curve: 'stairs',      grains: 8 },
  transmit:{ startFreq: 255,  endFreq: 3575, durationMs: 2000,curve: 'random',      grains: 53, wave: 'sawtooth' },
  boing:   { startFreq: 200,  endFreq: 800,  durationMs: 300, curve: 'bounce',      grains: 20, wave: 'sine' },
  pop:     { startFreq: 1500, endFreq: 400,  durationMs: 40,  curve: 'exponential', grains: 3 },
  slide:   { startFreq: 500,  endFreq: 3000, durationMs: 500, curve: 'scurve',      grains: 32, wave: 'sine' },
  splat:   { startFreq: 1200, endFreq: 80,   durationMs: 150, curve: 'random',      grains: 16 },
  gulp:    { startFreq: 600,  endFreq: 200,  durationMs: 200, curve: 'logarithmic', grains: 12, wave: 'sine' },
  error:   { startFreq: 400,  endFreq: 200,  durationMs: 300, curve: 'sawtooth',    grains: 6 },
  success: { startFreq: 800,  endFreq: 1600, durationMs: 200, curve: 'stairs',      grains: 4 },
  notify:  { startFreq: 1047, endFreq: 1319, durationMs: 150, curve: 'linear',      grains: 3, wave: 'sine' },
  typing:  { startFreq: 3000, endFreq: 2500, durationMs: 30,  curve: 'linear',      grains: 2 },
  bubble:  { startFreq: 300,  endFreq: 1200, durationMs: 100, curve: 'exponential', grains: 8,  wave: 'sine' },
  swoosh:  { startFreq: 3000, endFreq: 100,  durationMs: 200, curve: 'scurve',      grains: 24, wave: 'sawtooth' },
  arp:     { startFreq: 262,  endFreq: 1047, durationMs: 300, curve: 'stairs',      grains: 8,  wave: 'sine' },
  fireball:{ startFreq: 200,  endFreq: 2000, durationMs: 300, curve: 'noise',       grains: 30 },
  damage:  { startFreq: 500,  endFreq: 100,  durationMs: 200, curve: 'random',      grains: 12 },
  heal:    { startFreq: 500,  endFreq: 2000, durationMs: 400, curve: 'scurve',      grains: 16, wave: 'sine' },
  horn:    { startFreq: 300,  endFreq: 500,  durationMs: 500, curve: 'wobble',      grains: 30, wave: 'sawtooth' },
  whistle: { startFreq: 1500, endFreq: 2500, durationMs: 400, curve: 'scurve',      grains: 20, wave: 'sine' },
  scratch: { startFreq: 1000, endFreq: 3000, durationMs: 200, curve: 'noise',       grains: 30, wave: 'sawtooth' },
  knock:   { startFreq: 880,  endFreq: 31,   durationMs: 34,  curve: 'exponential', grains: 6,  wave: 'square' }
};

MP.SFX_PRESET_LABELS = {
  powerup: 'Power-up', oneup: '1-Up', gameover: 'Game Over', dooropen: 'Door',
  itemget: 'Item Get', lvlup: 'Level Up', warppipe: 'Warp Pipe', enghum: 'Engine',
  commbeep: 'Comm', ufo: 'UFO', bark2: 'Bark 2', alarm2: 'Alarm 2',
  transmit: 'Transmit', arp: 'Arpeggio'
};

MP._sfxSnapEnabled = true;

MP._sfxYinCandidates = function(diff, sampleRate, thresholds) {
  var size = diff.length;
  var candidates = [];
  var seen = {};
  for (var t = 0; t < thresholds.length; t++) {
    var thresh = thresholds[t];
    for (var i = 2; i < size; i++) {
      if (diff[i] < thresh) {
        while (i + 1 < size && diff[i + 1] < diff[i]) i++;
        var period = i;
        if (i > 0 && i < size - 1) {
          var s0 = diff[i - 1], s1 = diff[i], s2 = diff[i + 1];
          var denom = 2 * (s0 - 2 * s1 + s2);
          if (Math.abs(denom) > 1e-10) period = i + (s0 - s2) / denom;
        }
        var freq = sampleRate / period;
        if (freq < 40 || freq > 5000) break;
        var midi = MP.midiFromFreq(freq);
        if (midi < 16 || midi > 108) break;
        if (!seen[midi]) {
          seen[midi] = true;
          candidates.push({ midi: midi, confidence: 1 - diff[i], freq: freq });
        }
        break;
      }
    }
  }
  candidates.sort(function(a, b) { return b.confidence - a.confidence; });
  return candidates;
};

MP.SFX_MIN_FREQ = 31;
MP.SFX_MAX_FREQ = 8000;
MP.SFX_MIN_GRAINS = 2;
MP.SFX_MAX_GRAINS = 64;
MP.SFX_MIN_DURATION = 20;
MP.SFX_MAX_DURATION = 2000;

MP._sfxGrainFreqs = [];
MP._sfxGrainTimes = [];
MP._sfxDragState = null;

MP._sfxAnalyzeAudio = function(samples, sr) {
  var hpOut = new Float32Array(samples.length);
  hpOut[0] = samples[0];
  for (var hi = 1; hi < samples.length; hi++) {
    hpOut[hi] = samples[hi] - samples[hi - 1] + 0.995 * hpOut[hi - 1];
  }
  var filtered = MP._lowPassFilter(hpOut, sr, 5000);
  var winSize = 1024, hopSize = 256;
  var sfxThresholds = [];
  for (var ti = 0; ti < 10; ti++) sfxThresholds.push(0.03 + ti * 0.04);
  var maxRms = 0, windows = [];
  for (var pos = 0; pos + winSize <= filtered.length; pos += hopSize) {
    var win = filtered.subarray(pos, pos + winSize);
    var rms = 0;
    for (var k = 0; k < win.length; k++) rms += win[k] * win[k];
    rms = Math.sqrt(rms / win.length);
    if (rms > maxRms) maxRms = rms;
    windows.push({ win: win, rms: rms });
  }
  var silenceThresh = Math.max(0.005, maxRms * 0.08);
  var rawFreqs = [], prevFreq = 0;
  for (var i = 0; i < windows.length; i++) {
    if (windows[i].rms < silenceThresh) { rawFreqs.push(0); continue; }
    var diff = MP._yinDifference(windows[i].win);
    var candidates = MP._sfxYinCandidates(diff, sr, sfxThresholds);
    var bestCandidate = null;
    if (candidates.length > 0 && candidates[0].confidence > 0.85) {
      if (prevFreq > 0 && candidates.length > 1) {
        var closestDist = Infinity;
        for (var ci = 0; ci < candidates.length; ci++) {
          var dist = Math.abs(candidates[ci].freq - prevFreq);
          if (dist < closestDist) { closestDist = dist; bestCandidate = candidates[ci]; }
        }
      } else { bestCandidate = candidates[0]; }
    }
    if (bestCandidate) { rawFreqs.push(Math.round(bestCandidate.freq)); prevFreq = bestCandidate.freq; }
    else { rawFreqs.push(0); }
  }
  for (var mi = 1; mi < rawFreqs.length - 1; mi++) {
    if (rawFreqs[mi] > 0 && rawFreqs[mi - 1] > 0 && rawFreqs[mi + 1] > 0) {
      var vals = [rawFreqs[mi - 1], rawFreqs[mi], rawFreqs[mi + 1]].sort(function(a, b) { return a - b; });
      rawFreqs[mi] = vals[1];
    }
  }
  var voiced = rawFreqs.filter(function(f) { return f > 0; });
  if (voiced.length < 2) return null;
  var startIdx = 0, endIdx = rawFreqs.length - 1;
  while (startIdx < rawFreqs.length && rawFreqs[startIdx] === 0) startIdx++;
  while (endIdx > startIdx && rawFreqs[endIdx] === 0) endIdx--;
  var trimmed = rawFreqs.slice(startIdx, endIdx + 1);
  for (var j = 0; j < trimmed.length; j++) {
    if (trimmed[j] === 0) {
      var prev = j > 0 ? trimmed[j - 1] : voiced[0];
      var next = voiced[0];
      for (var nk = j + 1; nk < trimmed.length; nk++) { if (trimmed[nk] > 0) { next = trimmed[nk]; break; } }
      trimmed[j] = Math.round((prev + next) / 2);
    }
  }
  var grains = MP.clamp(trimmed.length, MP.SFX_MIN_GRAINS, MP.SFX_MAX_GRAINS);
  var resampled = [];
  for (var g = 0; g < grains; g++) {
    var t = grains > 1 ? g / (grains - 1) : 0;
    var srcIdx = t * (trimmed.length - 1);
    var lo = Math.floor(srcIdx);
    var hi2 = Math.min(lo + 1, trimmed.length - 1);
    var frac = srcIdx - lo;
    var freq = Math.round(trimmed[lo] * (1 - frac) + trimmed[hi2] * frac);
    resampled.push(MP.clamp(freq, MP.SFX_MIN_FREQ, MP.SFX_MAX_FREQ));
  }
  var voicedSamples = (endIdx - startIdx + 1) * hopSize + winSize;
  var voicedMs = Math.round((voicedSamples / sr) * 1000);
  return { resampled: resampled, grains: grains, voiced: voiced.length, durationMs: voicedMs };
};

MP._sfxDefaultTimes = function(n) {
  var times = [];
  for (var i = 0; i < n; i++) times.push(n > 1 ? i / (n - 1) : 0);
  return times;
};

MP._sfxClearPresetActive = function() {
  document.querySelectorAll('.sfx-preset-btn').forEach(function(b) { b.classList.remove('active'); });
  MP._sfxLastPresetName = '';
};

MP._sfxFindNearestDot = function(mx, my, gs) {
  var bestIdx = -1, bestDist = Infinity;
  var n = MP._sfxGrainFreqs.length;
  var gTimes = MP._sfxGrainTimes.length === n ? MP._sfxGrainTimes : MP._sfxDefaultTimes(n);
  for (var i = 0; i < n; i++) {
    var dx = gs.padL + gTimes[i] * gs.graphW - mx;
    var dy = gs.freqToY(MP._sfxGrainFreqs[i]) - my;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < bestDist) { bestDist = dist; bestIdx = i; }
  }
  return { idx: bestIdx, dist: bestDist };
};

MP._sfxSetupCanvas = function(canvas) {
  var rect = canvas.getBoundingClientRect();
  var dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx: ctx, w: rect.width, h: rect.height, dpr: dpr };
};

MP._sfxGrainDurs = function(times) {
  var n = times.length;
  if (n === 0) return [];
  if (n === 1) return [1];
  var durs = [];
  for (var i = 0; i < n; i++) {
    var left = i === 0 ? 0 : (times[i - 1] + times[i]) / 2;
    var right = i === n - 1 ? 1 : (times[i] + times[i + 1]) / 2;
    durs.push(right - left);
  }
  return durs;
};

MP.computeSfxFreqs = function(params) {
  var freqs = [];
  for (var i = 0; i < params.grains; i++) {
    var t = params.grains > 1 ? i / (params.grains - 1) : 0;
    var freq;
    if (params.curve === 'random') {
      var range = params.startFreq - params.endFreq;
      var center = params.startFreq - range * t * 0.6;
      freq = center + (Math.random() - 0.5) * range * 0.8;
    } else if (params.curve === 'pingpong') {
      var pp = t < 0.5 ? t * 2 : (1 - t) * 2;
      freq = params.startFreq + (params.endFreq - params.startFreq) * pp;
    } else if (params.curve === 'exponential') {
      freq = params.startFreq * Math.pow(params.endFreq / params.startFreq, t);
    } else if (params.curve === 'stairs') {
      var steps = Math.max(3, Math.floor(params.grains / 4));
      var st = Math.floor(t * steps) / steps;
      freq = params.startFreq + (params.endFreq - params.startFreq) * st;
    } else if (params.curve === 'wobble') {
      var base = params.startFreq + (params.endFreq - params.startFreq) * t;
      freq = base + Math.sin(t * Math.PI * 6) * Math.abs(params.endFreq - params.startFreq) * 0.15;
    } else if (params.curve === 'bounce') {
      var decay = 1 - t * 0.7;
      var bounce = Math.abs(Math.sin(t * Math.PI * 3)) * decay;
      freq = params.startFreq + (params.endFreq - params.startFreq) * bounce;
    } else if (params.curve === 'logarithmic') {
      var lt = Math.log(t * (Math.E - 1) + 1);
      freq = params.startFreq + (params.endFreq - params.startFreq) * lt;
    } else if (params.curve === 'scurve') {
      var s = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      freq = params.startFreq + (params.endFreq - params.startFreq) * s;
    } else if (params.curve === 'sawtooth') {
      var saw = (t * 3) % 1;
      freq = params.startFreq + (params.endFreq - params.startFreq) * saw;
    } else if (params.curve === 'noise') {
      var nbase = params.startFreq + (params.endFreq - params.startFreq) * t;
      freq = nbase + (Math.random() - 0.5) * Math.abs(params.endFreq - params.startFreq) * 0.15;
    } else {
      freq = params.startFreq + (params.endFreq - params.startFreq) * t;
    }
    freq = Math.round(MP.clamp(freq, MP.SFX_MIN_FREQ, MP.SFX_MAX_FREQ));
    if (params.quantize) {
      var midi = MP.midiFromFreq(freq);
      freq = Math.round(440 * Math.pow(2, (midi - 69) / 12));
    }
    freqs.push(freq);
  }
  return freqs;
};

MP._sfxTimesAreUniform = function(times) {
  var def = MP._sfxDefaultTimes(times.length);
  for (var i = 0; i < times.length; i++) {
    if (Math.abs(times[i] - def[i]) > 0.001) return false;
  }
  return true;
};

MP.rebuildSfxFreqs = function(params) {
  MP._sfxGrainFreqs = MP.computeSfxFreqs(params);
  if (params.times && params.times.length === params.grains) {
    MP._sfxGrainTimes = params.times.slice();
  } else {
    MP._sfxGrainTimes = MP._sfxDefaultTimes(params.grains);
  }
};

MP.generateSfxNotes = function(params, insertStart) {
  var bpm = MP.getBpm();
  var totalBeats = (params.durationMs / 1000) * (bpm / 60);
  var freqs = MP._sfxGrainFreqs.length === params.grains ? MP._sfxGrainFreqs : MP.computeSfxFreqs(params);
  var times = MP._sfxGrainTimes.length === params.grains ? MP._sfxGrainTimes : MP._sfxDefaultTimes(params.grains);
  var durs = MP._sfxGrainDurs(times);
  var notes = [];

  for (var i = 0; i < params.grains; i++) {
    var freq = freqs[i];
    var midi = MP.midiFromFreq(freq);
    midi = MP.clamp(midi, MP.MIDI_MIN, MP.MIDI_MAX);
    notes.push({
      name: MP.nameFromMidi(midi),
      freq: freq,
      start: insertStart + (i === 0 ? 0 : (times[i - 1] + times[i]) / 2) * totalBeats,
      dur: durs[i] * totalBeats
    });
  }
  return notes;
};

MP._sfxPreviewOsc = null;

MP.previewSfx = function(params) {
  if (MP._sfxPreviewOsc) {
    try { MP._sfxPreviewOsc.stop(); } catch(e) {}
    MP._sfxPreviewOsc = null;
  }
  var ctx = MP.getAudioCtx();
  var og = MP.createOscGain(ctx);
  var osc = og.osc;
  var gain = og.gain;
  osc.type = params.wave || MP.AUDIO_OSC_TYPE;
  gain.gain.setValueAtTime(MP.AUDIO_GAIN, ctx.currentTime);
  var durSec = params.durationMs / 1000;
  var freqs = MP._sfxGrainFreqs.length === params.grains ? MP._sfxGrainFreqs : MP.computeSfxFreqs(params);
  var times = MP._sfxGrainTimes.length === params.grains ? MP._sfxGrainTimes : MP._sfxDefaultTimes(params.grains);

  osc.frequency.setValueAtTime(freqs[0], ctx.currentTime);
  for (var i = 1; i < freqs.length; i++) {
    var boundary = (times[i - 1] + times[i]) / 2;
    osc.frequency.setValueAtTime(freqs[i], ctx.currentTime + boundary * durSec);
  }

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durSec);
  MP._sfxPreviewOsc = osc;
  osc.onended = function() { MP._sfxPreviewOsc = null; };
};

MP._sfxNextGroupId = Date.now();
MP._sfxLastPresetName = '';
MP._sfxEditingGroup = null;

MP.openSfxForGroup = function(groupId) {
  var notes = MP.appState.seq.filter(function(n) { return n.sfxGroup === groupId; });
  if (notes.length === 0) return;
  notes.sort(function(a, b) { return a.start - b.start; });
  MP._sfxEditingGroup = groupId;
  MP._sfxLastPresetName = notes[0].sfxName || '';
  MP._sfxGrainFreqs = notes.map(function(n) { return n.freq; });
  var totalDur = notes[notes.length - 1].start + notes[notes.length - 1].dur - notes[0].start;
  var bpm = MP.getBpm();
  var durationMs = Math.round(totalDur * 60000 / bpm);
  MP._sfxGrainTimes = MP._sfxDefaultTimes(notes.length);
  document.getElementById('sfx-start-freq').value = notes[0].freq;
  document.getElementById('sfx-end-freq').value = notes[notes.length - 1].freq;
  document.getElementById('sfx-duration').value = MP.clamp(durationMs, MP.SFX_MIN_DURATION, MP.SFX_MAX_DURATION);
  document.getElementById('sfx-grains').value = notes.length;
  document.getElementById('sfx-modal').style.display = '';
  document.getElementById('sfx-insert').textContent = 'Update';
  var p = MP.getSfxParams();
  MP.drawSfxGraph(p);
  MP.drawSfxWaveform(p);
};

MP.insertSfx = function(params) {
  MP.pushUndo();
  var sfxName = MP._sfxLastPresetName || '';
  var groupId, insertAt;

  if (MP._sfxEditingGroup) {
    groupId = MP._sfxEditingGroup;
    var existing = MP.appState.seq.filter(function(n) { return n.sfxGroup === groupId; });
    insertAt = existing.length > 0 ? Math.min.apply(null, existing.map(function(n) { return n.start; })) : MP.seqEndBeat();
    MP.appState.seq = MP.appState.seq.filter(function(n) { return n.sfxGroup !== groupId; });
  } else {
    groupId = 'sfx_' + MP._sfxNextGroupId++;
    insertAt = MP.seqEndBeat();
  }

  var notes = MP.generateSfxNotes(params, insertAt);
  notes.forEach(function(n) { n.sfxGroup = groupId; if (sfxName) n.sfxName = sfxName; MP.appState.seq.push(n); });
  var lastNote = notes[notes.length - 1];
  MP.appState.nextNoteStart = Math.max(MP.appState.nextNoteStart, lastNote.start + lastNote.dur);
  MP.updateSequence();
  MP.showToast(MP._sfxEditingGroup ? 'Updated SFX (' + notes.length + ' notes)' : 'Inserted SFX (' + notes.length + ' notes)');
};

MP.SFX_MIC_MAX_SEC = 3;
MP._sfxMicRecording = false;
MP._sfxMicStream = null;
MP._sfxMicChunks = [];
MP._sfxMicSource = null;
MP._sfxMicProcessor = null;

MP.sfxMicStart = function(onDone) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    MP.showToast('Microphone not supported', true);
    return;
  }
  var ctx = MP.getAudioCtx();
  navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
  }).then(function(stream) {
    MP._sfxMicRecording = true;
    MP._sfxMicStream = stream;
    MP._sfxMicChunks = [];

    var source = ctx.createMediaStreamSource(stream);
    var processor = ctx.createScriptProcessor(4096, 1, 1);
    processor.onaudioprocess = function(e) {
      if (!MP._sfxMicRecording) return;
      MP._sfxMicChunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
    };
    source.connect(processor);
    processor.connect(ctx.destination);
    MP._sfxMicSource = source;
    MP._sfxMicProcessor = processor;

    var btn = document.getElementById('sfx-mic');
    btn.classList.add('recording');
    btn.textContent = 'Stop';

    MP._sfxMicTimeout = setTimeout(function() {
      if (MP._sfxMicRecording) MP.sfxMicStop(onDone);
    }, MP.SFX_MIC_MAX_SEC * 1000);
  }).catch(function() {
    MP.showToast('Microphone access denied', true);
  });
};

MP.sfxMicStop = function(onDone) {
  MP._sfxMicRecording = false;
  clearTimeout(MP._sfxMicTimeout);
  if (MP._sfxMicProcessor) { MP._sfxMicProcessor.disconnect(); MP._sfxMicProcessor = null; }
  if (MP._sfxMicSource) { MP._sfxMicSource.disconnect(); MP._sfxMicSource = null; }
  if (MP._sfxMicStream) {
    MP._sfxMicStream.getTracks().forEach(function(t) { t.stop(); });
    MP._sfxMicStream = null;
  }

  var btn = document.getElementById('sfx-mic');
  btn.classList.remove('recording');
  btn.innerHTML = '&#127908; Record';

  var chunks = MP._sfxMicChunks;
  MP._sfxMicChunks = [];
  if (!chunks || chunks.length === 0) { MP.showToast('No audio captured', true); return; }

  var totalLen = 0;
  chunks.forEach(function(c) { totalLen += c.length; });
  var merged = new Float32Array(totalLen);
  var offset = 0;
  chunks.forEach(function(c) { merged.set(c, offset); offset += c.length; });

  var result = MP._sfxAnalyzeAudio(merged, MP.getAudioCtx().sampleRate);
  if (!result) { MP.showToast('No pitch detected - try a clearer sound', true); return; }

  MP._sfxUndoStack.push(MP._sfxSnapshot());
  if (MP._sfxUndoStack.length > MP._sfxMaxUndo) MP._sfxUndoStack.shift();
  MP._sfxRedoStack = [];
  MP._sfxUpdateUndoButtons();
  MP._sfxGrainFreqs = result.resampled;
  MP._sfxGrainTimes = MP._sfxDefaultTimes(result.resampled.length);

  document.getElementById('sfx-duration').value = MP.clamp(result.durationMs, MP.SFX_MIN_DURATION, MP.SFX_MAX_DURATION);
  document.getElementById('sfx-grains').value = result.grains;
  document.getElementById('sfx-start-freq').value = result.resampled[0];
  document.getElementById('sfx-end-freq').value = result.resampled[result.resampled.length - 1];

  MP._sfxClearPresetActive();
  if (onDone) onDone();
  MP.showToast('Sound captured (' + result.voiced + ' frames, ' + result.grains + ' grains)');
};

MP.drawSfxWaveform = function(params) {
  var canvas = document.getElementById('sfx-waveform');
  if (!canvas) return;
  var cs = MP._sfxSetupCanvas(canvas);
  var ctx = cs.ctx, w = cs.w, h = cs.h, dpr = cs.dpr;
  var pad = 6;
  var drawW = w - pad * 2;
  var drawH = h - pad * 2;
  var midY = pad + drawH / 2;

  ctx.clearRect(0, 0, w, h);

  var styles = getComputedStyle(document.documentElement);
  var gridColor = styles.getPropertyValue('--section-border').trim() || '#ddd';
  var accentColor = styles.getPropertyValue('--accent').trim() || '#705dcf';
  var mutedColor = styles.getPropertyValue('--muted').trim() || '#888';

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, midY);
  ctx.lineTo(w - pad, midY);
  ctx.stroke();

  var wave = params.wave || 'square';
  var freqs = MP._sfxGrainFreqs;
  if (!freqs || freqs.length === 0) return;
  var totalMs = params.durationMs;
  var times = MP._sfxGrainTimes.length === freqs.length ? MP._sfxGrainTimes : MP._sfxDefaultTimes(freqs.length);
  var durs = MP._sfxGrainDurs(times);
  var boundaries = [0];
  for (var bi = 0; bi < freqs.length - 1; bi++) {
    boundaries.push((times[bi] + times[bi + 1]) / 2);
  }
  boundaries.push(1);
  var cycles = 0;
  for (var g = 0; g < freqs.length; g++) {
    cycles += freqs[g] * (durs[g] * totalMs / 1000);
  }
  var samplesPerPx = Math.max(1, Math.ceil(cycles * 2 / drawW));
  var totalSamples = drawW * samplesPerPx;

  function waveVal(phase, type) {
    var p = phase % 1;
    if (p < 0) p += 1;
    switch (type) {
      case 'sine': return Math.sin(p * Math.PI * 2);
      case 'square': return p < 0.5 ? 1 : -1;
      case 'sawtooth': return 2 * p - 1;
      case 'triangle': return p < 0.5 ? 4 * p - 1 : 3 - 4 * p;
      default: return p < 0.5 ? 1 : -1;
    }
  }

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  var phase = 0;
  var prevGrainIdx = -1;
  for (var s = 0; s < totalSamples; s++) {
    var x = pad + (s / totalSamples) * drawW;
    var timeMs = (s / totalSamples) * totalMs;
    var tRatio = timeMs / totalMs;
    var grainIdx = freqs.length - 1;
    for (var bi2 = 1; bi2 < boundaries.length; bi2++) {
      if (tRatio < boundaries[bi2]) { grainIdx = bi2 - 1; break; }
    }
    var freq = freqs[grainIdx];
    if (prevGrainIdx !== grainIdx && prevGrainIdx >= 0) {
      phase = phase % 1;
    }
    prevGrainIdx = grainIdx;
    var dt = totalMs / totalSamples / 1000;
    phase += freq * dt;
    var val = waveVal(phase, wave);
    var y = midY - val * (drawH / 2 - 2);
    if (s === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

};

MP.SFX_GRAPH_PAD = 28;
MP.SFX_GRAPH_PAD_RIGHT = 8;
MP.SFX_GRAPH_PAD_BOTTOM = 16;
MP.SFX_GRAPH_GRID_FREQS = [50, 100, 200, 500, 1000, 2000, 4000, 8000];

MP.drawSfxGraph = function(params) {
  var canvas = document.getElementById('sfx-graph');
  if (!canvas) return;
  var cs = MP._sfxSetupCanvas(canvas);
  var ctx = cs.ctx, w = cs.w, h = cs.h, dpr = cs.dpr;
  var padL = MP.SFX_GRAPH_PAD;
  var padR = MP.SFX_GRAPH_PAD_RIGHT;
  var padT = 8;
  var padB = MP.SFX_GRAPH_PAD_BOTTOM;
  var graphW = w - padL - padR;
  var graphH = h - padT - padB;

  ctx.clearRect(0, 0, w, h);

  var freqs = MP._sfxGrainFreqs;
  var allFreqs = freqs.concat([params.startFreq, params.endFreq]);
  var minF = Math.min.apply(null, allFreqs);
  var maxF = Math.max.apply(null, allFreqs);
  if (minF === maxF) { minF *= 0.8; maxF *= 1.2; }
  var logMin = Math.log(Math.max(1, minF * 0.8));
  var logMax = Math.log(maxF * 1.2);

  function freqToY(f) {
    var logF = Math.log(Math.max(1, f));
    return padT + graphH - (logF - logMin) / (logMax - logMin) * graphH;
  }
  function yToFreq(y) {
    var ratio = (padT + graphH - y) / graphH;
    var logF = logMin + ratio * (logMax - logMin);
    return Math.round(MP.clamp(Math.exp(logF), MP.SFX_MIN_FREQ, MP.SFX_MAX_FREQ));
  }

  var styles = getComputedStyle(document.documentElement);
  var gridColor = styles.getPropertyValue('--section-border').trim() || '#ddd';
  var mutedColor = styles.getPropertyValue('--muted').trim() || '#888';
  var accentColor = styles.getPropertyValue('--accent').trim() || '#705dcf';

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.fillStyle = mutedColor;
  ctx.font = '8px sans-serif';
  ctx.textAlign = 'right';
  MP.SFX_GRAPH_GRID_FREQS.forEach(function(gf) {
    if (gf < minF * 0.7 || gf > maxF * 1.3) return;
    var gy = freqToY(gf);
    if (gy < padT || gy > padT + graphH) return;
    ctx.beginPath();
    ctx.moveTo(padL, gy);
    ctx.lineTo(w - padR, gy);
    ctx.stroke();
    var hzLabel = gf >= 1000 ? (gf / 1000) + 'k' : gf;
    var gMidi = MP.midiFromFreq(gf);
    var noteName = (gMidi >= MP.MIDI_MIN && gMidi <= MP.MIDI_MAX) ? MP.nameFromMidi(gMidi) : '';
    ctx.fillText(hzLabel + (noteName ? ' ' + noteName : ''), padL - 3, gy + 3);
  });

  if (MP._sfxSnapEnabled && freqs.length > 1) {
    var seen = {};
    ctx.strokeStyle = accentColor;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    for (var si = 0; si < freqs.length; si++) {
      var sf = freqs[si];
      if (seen[sf]) continue;
      seen[sf] = true;
      var sy = freqToY(sf);
      if (sy >= padT && sy <= padT + graphH) {
        ctx.beginPath();
        ctx.moveTo(padL, sy);
        ctx.lineTo(padL + graphW, sy);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  ctx.textAlign = 'center';
  var timeSteps = params.durationMs <= 50 ? 5 : params.durationMs <= 100 ? 10 : params.durationMs <= 200 ? 50 : params.durationMs <= 500 ? 100 : 200;
  for (var ms = 0; ms <= params.durationMs; ms += timeSteps) {
    var tx = padL + (ms / params.durationMs) * graphW;
    ctx.beginPath();
    ctx.moveTo(tx, padT);
    ctx.lineTo(tx, padT + graphH);
    ctx.stroke();
    ctx.fillText(ms + 'ms', tx, h - 2);
  }

  var dotR = freqs.length > 32 ? 2 : 3.5;
  var drag = MP._sfxDragState;

  var gTimes = MP._sfxGrainTimes.length === freqs.length ? MP._sfxGrainTimes : MP._sfxDefaultTimes(freqs.length);

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (var i = 0; i < freqs.length; i++) {
    var lx = (drag && i === drag.idx) ? drag.mx : padL + gTimes[i] * graphW;
    var ly = (drag && i === drag.idx) ? drag.my : freqToY(freqs[i]);
    if (i === 0) ctx.moveTo(lx, ly);
    else ctx.lineTo(lx, ly);
  }
  ctx.stroke();

  ctx.fillStyle = accentColor;
  for (var j = 0; j < freqs.length; j++) {
    if (drag && j === drag.idx) continue;
    var dotX = padL + gTimes[j] * graphW;
    var dotY = freqToY(freqs[j]);
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
    ctx.fill();
  }

  if (drag) {
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(drag.mx, padT);
    ctx.lineTo(drag.mx, padT + graphH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(drag.mx, drag.my, dotR + 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  canvas._sfxGraphState = {
    padL: padL, padR: padR, padT: padT, padB: padB,
    graphW: graphW, graphH: graphH, dotR: dotR,
    freqToY: freqToY, yToFreq: yToFreq,
    dpr: dpr
  };
};

MP._sfxActiveBtn = function(group) {
  var btn = document.querySelector('.sfx-opt-btn[data-sfx-' + group + '].active');
  return btn ? btn.getAttribute('data-sfx-' + group) : (group === 'curve' ? 'linear' : 'square');
};

MP.getSfxParams = function() {
  var qEl = document.getElementById('sfx-quantize');
  return {
    startFreq: parseInt(document.getElementById('sfx-start-freq').value),
    endFreq: parseInt(document.getElementById('sfx-end-freq').value),
    durationMs: parseInt(document.getElementById('sfx-duration').value),
    curve: MP._sfxActiveBtn('curve'),
    quantize: qEl ? qEl.checked : false,
    grains: parseInt(document.getElementById('sfx-grains').value),
    wave: MP._sfxActiveBtn('wave')
  };
};

MP.SFX_STORAGE_KEY = 'beepcraft_sfx_custom';
MP.SFX_OVERRIDES_KEY = 'beepcraft_sfx_overrides';

MP._sfxValidatePresetObj = function(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};
  var clean = {};
  Object.keys(obj).forEach(function(k) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') return;
    var v = obj[k];
    if (v && typeof v === 'object' && typeof v.startFreq === 'number' && typeof v.endFreq === 'number' && typeof v.durationMs === 'number' && typeof v.grains === 'number') {
      clean[k] = v;
    }
  });
  return clean;
};

MP._sfxLoadCustomPresets = function() {
  try { return MP._sfxValidatePresetObj(JSON.parse(localStorage.getItem(MP.SFX_STORAGE_KEY))); } catch(e) { return {}; }
};

MP._sfxSaveCustomPresets = function(presets) {
  localStorage.setItem(MP.SFX_STORAGE_KEY, JSON.stringify(presets));
};

MP._sfxLoadOverrides = function() {
  try { return MP._sfxValidatePresetObj(JSON.parse(localStorage.getItem(MP.SFX_OVERRIDES_KEY))); } catch(e) { return {}; }
};

MP._sfxSaveOverrides = function(overrides) {
  localStorage.setItem(MP.SFX_OVERRIDES_KEY, JSON.stringify(overrides));
};

MP._sfxUndoStack = [];
MP._sfxRedoStack = [];
MP._sfxMaxUndo = 50;

MP._sfxSnapshot = function() {
  return {
    params: MP.getSfxParams(),
    freqs: MP._sfxGrainFreqs.slice(),
    times: MP._sfxGrainTimes.slice()
  };
};

MP._sfxRestoreSnapshot = function(snap, setOptBtn, startFreqInput, endFreqInput, durationInput, grainsInput) {
  var p = snap.params;
  startFreqInput.value = p.startFreq;
  endFreqInput.value = p.endFreq;
  durationInput.value = p.durationMs;
  grainsInput.value = p.grains;
  setOptBtn('curve', p.curve);
  setOptBtn('wave', p.wave);
  MP._sfxGrainFreqs = snap.freqs.slice();
  MP._sfxGrainTimes = snap.times ? snap.times.slice() : MP._sfxDefaultTimes(snap.freqs.length);
  MP._sfxClearPresetActive();
};

MP._sfxUpdateUndoButtons = function() {
  var u = document.getElementById('sfx-undo');
  var r = document.getElementById('sfx-redo');
  if (u) u.disabled = MP._sfxUndoStack.length === 0;
  if (r) r.disabled = MP._sfxRedoStack.length === 0;
};

MP._encodeWav = function(samples, sampleRate) {
  var numSamples = samples.length;
  var buffer = new ArrayBuffer(44 + numSamples * 2);
  var view = new DataView(buffer);
  function writeStr(offset, str) { for (var i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); }
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples * 2, true);
  for (var i = 0; i < numSamples; i++) {
    var s = MP.clamp(samples[i], -1, 1);
    view.setInt16(44 + i * 2, Math.round(s * 32767), true);
  }
  return buffer;
};

MP.exportSfxWav = function(params) {
  var sampleRate = 44100;
  var duration = params.durationMs / 1000;
  var numSamples = Math.ceil(sampleRate * duration);
  var ctx = new OfflineAudioContext(1, numSamples, sampleRate);
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = params.wave || 'square';
  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.5, 0);

  var freqs = MP._sfxGrainFreqs.length === params.grains ? MP._sfxGrainFreqs : MP.computeSfxFreqs(params);
  var times = MP._sfxGrainTimes.length === params.grains ? MP._sfxGrainTimes : MP._sfxDefaultTimes(params.grains);
  var n = freqs.length;
  osc.frequency.setValueAtTime(freqs[0], 0);
  for (var i = 1; i < n; i++) {
    var boundary = (times[i - 1] + times[i]) / 2;
    osc.frequency.setValueAtTime(freqs[i], boundary * duration);
  }
  osc.start(0);
  osc.stop(duration);

  ctx.startRendering().then(function(buffer) {
    var samples = buffer.getChannelData(0);
    var wav = MP._encodeWav(samples, sampleRate);
    var blob = new Blob([wav], { type: 'audio/wav' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'sfx.wav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
};

MP.initSfxDialog = function() {
  var modal = document.getElementById('sfx-modal');
  if (!modal) return;

  var _sfxDragOnMove = null, _sfxDragOnUp = null;

  var startFreqInput = document.getElementById('sfx-start-freq');
  var endFreqInput = document.getElementById('sfx-end-freq');
  var durationInput = document.getElementById('sfx-duration');
  var grainsInput = document.getElementById('sfx-grains');
  var startFreqVal = document.getElementById('sfx-start-freq-val');
  var endFreqVal = document.getElementById('sfx-end-freq-val');
  var durationVal = document.getElementById('sfx-duration-val');
  var grainsVal = document.getElementById('sfx-grains-val');
  var canvas = document.getElementById('sfx-graph');

  function setOptBtn(group, value) {
    document.querySelectorAll('.sfx-opt-btn[data-sfx-' + group + ']').forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-sfx-' + group) === value);
    });
  }

  function pushSfxUndo() {
    MP._sfxUndoStack.push(MP._sfxSnapshot());
    if (MP._sfxUndoStack.length > MP._sfxMaxUndo) MP._sfxUndoStack.shift();
    MP._sfxRedoStack = [];
    MP._sfxUpdateUndoButtons();
  }

  function updateDisplayValues() {
    startFreqVal.textContent = startFreqInput.value + ' Hz';
    endFreqVal.textContent = endFreqInput.value + ' Hz';
    durationVal.textContent = durationInput.value + ' ms';
    grainsVal.textContent = grainsInput.value;
    var p = MP.getSfxParams();
    MP.drawSfxGraph(p);
    MP.drawSfxWaveform(p);
  }

  function rebuildAndUpdate() {
    MP.rebuildSfxFreqs(MP.getSfxParams());
    updateDisplayValues();
  }

  function getPresetData(name) {
    var overrides = MP._sfxLoadOverrides();
    if (overrides[name]) return overrides[name];
    var custom = MP._sfxLoadCustomPresets();
    if (custom[name]) return custom[name];
    return MP.SFX_PRESETS[name] || null;
  }

  function applyParams(p) {
    startFreqInput.value = p.startFreq;
    endFreqInput.value = p.endFreq;
    durationInput.value = p.durationMs;
    setOptBtn('curve', p.curve);
    setOptBtn('wave', p.wave || 'square');
    grainsInput.value = p.grains;
  }

  function loadPreset(name) {
    var p = getPresetData(name);
    if (!p) return;
    applyParams(p);
    MP._sfxLastPresetName = MP.SFX_PRESET_LABELS[name] || name.charAt(0).toUpperCase() + name.slice(1);
    document.querySelectorAll('.sfx-preset-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.sfx === name);
    });
    rebuildAndUpdate();
    if (p.times && p.times.length === p.grains) {
      MP._sfxGrainTimes = p.times.slice();
      updateDisplayValues();
    }
  }

  function saveOverride(name) {
    var overrides = MP._sfxLoadOverrides();
    var p = MP.getSfxParams();
    var data = { startFreq: p.startFreq, endFreq: p.endFreq, durationMs: p.durationMs, curve: p.curve, grains: p.grains, wave: p.wave };
    if (MP._sfxGrainTimes.length === p.grains && !MP._sfxTimesAreUniform(MP._sfxGrainTimes)) {
      data.times = MP._sfxGrainTimes.slice();
    }
    overrides[name] = data;
    MP._sfxSaveOverrides(overrides);
    MP.showToast('Saved to "' + name + '"');
  }

  function resetOverride(name) {
    var overrides = MP._sfxLoadOverrides();
    delete overrides[name];
    MP._sfxSaveOverrides(overrides);
    loadPreset(name);
    MP.showToast('Reset "' + name + '" to default');
  }

  function saveCustomPreset() {
    var name = prompt('Preset name:');
    if (!name || !name.trim()) return;
    name = name.trim();
    if (name.length > 50) name = name.substring(0, 50);
    if (name === '__proto__' || name === 'constructor' || name === 'prototype') return;
    if (MP.SFX_PRESETS[name]) {
      saveOverride(name);
      return;
    }
    var custom = MP._sfxLoadCustomPresets();
    var p = MP.getSfxParams();
    var data = { startFreq: p.startFreq, endFreq: p.endFreq, durationMs: p.durationMs, curve: p.curve, grains: p.grains, wave: p.wave };
    if (MP._sfxGrainTimes.length === p.grains && !MP._sfxTimesAreUniform(MP._sfxGrainTimes)) {
      data.times = MP._sfxGrainTimes.slice();
    }
    custom[name] = data;
    MP._sfxSaveCustomPresets(custom);
    renderCustomPresets();
    MP.showToast('Saved "' + name + '"');
  }

  function deleteCustomPreset(name) {
    var custom = MP._sfxLoadCustomPresets();
    delete custom[name];
    MP._sfxSaveCustomPresets(custom);
    renderCustomPresets();
    MP.showToast('Deleted "' + name + '"');
  }

  var presetsContainer = document.querySelector('#sfx-modal .sfx-presets');
  var diceBtn = document.getElementById('sfx-dice');

  function renderCustomPresets() {
    presetsContainer.querySelectorAll('.sfx-preset-custom').forEach(function(b) { b.remove(); });
    var custom = MP._sfxLoadCustomPresets();
    Object.keys(custom).forEach(function(name) {
      var btn = document.createElement('button');
      btn.className = 'sfx-preset-btn sfx-preset-custom';
      btn.dataset.sfx = name;
      btn.textContent = name;
      var del = document.createElement('span');
      del.className = 'sfx-preset-del';
      del.textContent = '\u00d7';
      del.title = 'Delete preset';
      del.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteCustomPreset(name);
      });
      btn.appendChild(del);
      btn.addEventListener('click', function() {
        pushSfxUndo();
        loadPreset(name);
        MP.previewSfx(MP.getSfxParams());
      });
      btn.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (confirm('Save current sound to "' + name + '"?')) saveOverride(name);
      });
      presetsContainer.insertBefore(btn, diceBtn);
    });
  }

  function setupBuiltinPresetBtn(btn) {
    btn.addEventListener('click', function() {
      pushSfxUndo();
      loadPreset(btn.dataset.sfx);
      MP.previewSfx(MP.getSfxParams());
    });
    btn.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      var name = btn.dataset.sfx;
      var overrides = MP._sfxLoadOverrides();
      if (overrides[name]) {
        var choice = confirm('Reset "' + name + '" to default?\n\n(Cancel = save current sound to "' + name + '")');
        if (choice) resetOverride(name);
        else saveOverride(name);
      } else {
        if (confirm('Save current sound to "' + name + '"?')) saveOverride(name);
      }
    });
  }

  Object.keys(MP.SFX_PRESETS).forEach(function(key) {
    var btn = document.createElement('button');
    btn.className = 'sfx-preset-btn';
    btn.dataset.sfx = key;
    btn.textContent = MP.SFX_PRESET_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1);
    setupBuiltinPresetBtn(btn);
    presetsContainer.insertBefore(btn, diceBtn);
  });

  renderCustomPresets();

  var sliderUndoPushed = false;
  [startFreqInput, endFreqInput, durationInput, grainsInput].forEach(function(inp) {
    inp.addEventListener('mousedown', function() { sliderUndoPushed = false; });
    inp.addEventListener('touchstart', function() { sliderUndoPushed = false; });
    inp.addEventListener('input', function() {
      if (!sliderUndoPushed) { pushSfxUndo(); sliderUndoPushed = true; }
      MP._sfxClearPresetActive();
      rebuildAndUpdate();
    });
  });
  document.querySelectorAll('.sfx-opt-btn[data-sfx-curve]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      pushSfxUndo();
      setOptBtn('curve', btn.getAttribute('data-sfx-curve'));
      MP._sfxClearPresetActive();
      rebuildAndUpdate();
      MP.previewSfx(MP.getSfxParams());
    });
  });
  document.querySelectorAll('.sfx-opt-btn[data-sfx-wave]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      pushSfxUndo();
      setOptBtn('wave', btn.getAttribute('data-sfx-wave'));
      updateDisplayValues();
      MP.previewSfx(MP.getSfxParams());
    });
  });

  canvas.addEventListener('mousedown', function(e) {
    var gs = canvas._sfxGraphState;
    if (!gs) return;
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;

    var hit = MP._sfxFindNearestDot(mx, my, gs);
    if (hit.idx < 0 || hit.dist > 15) return;

    e.preventDefault();
    pushSfxUndo();
    canvas.style.cursor = 'grabbing';
    MP._sfxClearPresetActive();
    var dragIdx = hit.idx;
    var n = MP._sfxGrainFreqs.length;
    MP._sfxDragState = { idx: dragIdx, mx: mx, my: my };

    var tip = document.getElementById('sfx-graph-tip');
    function onMove(e2) {
      var curRect = canvas.getBoundingClientRect();
      var nx = e2.clientX - curRect.left;
      var ny = e2.clientY - curRect.top;
      var cgs = canvas._sfxGraphState || gs;
      var rawFreq = cgs.yToFreq(ny);
      var snappedFreq = rawFreq;
      if (MP._sfxSnapEnabled) {
        for (var si = 0; si < MP._sfxGrainFreqs.length; si++) {
          if (si === dragIdx) continue;
          var otherY = cgs.freqToY(MP._sfxGrainFreqs[si]);
          if (Math.abs(ny - otherY) < 8) {
            snappedFreq = MP._sfxGrainFreqs[si];
            ny = otherY;
            break;
          }
        }
      }
      MP._sfxGrainFreqs[dragIdx] = snappedFreq;
      var newT = (nx - cgs.padL) / cgs.graphW;
      var minT = dragIdx > 0 ? MP._sfxGrainTimes[dragIdx - 1] + 0.001 : 0;
      var maxT = dragIdx < n - 1 ? MP._sfxGrainTimes[dragIdx + 1] - 0.001 : 1;
      MP._sfxGrainTimes[dragIdx] = MP.clamp(newT, minT, maxT);
      MP._sfxDragState.idx = dragIdx;
      MP._sfxDragState.mx = nx;
      MP._sfxDragState.my = ny;
      var p = MP.getSfxParams();
      MP.drawSfxGraph(p);
      MP.drawSfxWaveform(p);
      var freq = MP._sfxGrainFreqs[dragIdx];
      var midi = MP.clamp(MP.midiFromFreq(freq), MP.MIDI_MIN, MP.MIDI_MAX);
      tip.textContent = freq + ' Hz (' + MP.nameFromMidi(midi) + ')';
      var tipX = e2.clientX - curRect.left + 10;
      var tipW = tip.offsetWidth || 80;
      if (tipX + tipW > curRect.width) tipX = e2.clientX - curRect.left - tipW - 5;
      tip.style.left = tipX + 'px';
      tip.style.top = (e2.clientY - curRect.top - 20) + 'px';
      tip.style.display = 'block';
    }
    function onUp() {
      canvas.style.cursor = '';
      MP._sfxDragState = null;
      tip.style.display = 'none';
      var p = MP.getSfxParams();
      MP.drawSfxGraph(p);
      MP.drawSfxWaveform(p);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    _sfxDragOnMove = onMove;
    _sfxDragOnUp = onUp;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  document.getElementById('sfx-dice').addEventListener('click', function() {
    pushSfxUndo();
    function rr(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    var curves = ['linear', 'exponential', 'logarithmic', 'scurve', 'pingpong', 'bounce', 'stairs', 'sawtooth', 'wobble', 'noise', 'random'];
    var waves = ['square', 'sawtooth', 'triangle', 'sine'];
    startFreqInput.value = rr(50, 6000);
    endFreqInput.value = rr(50, 6000);
    durationInput.value = rr(30, 1500);
    grainsInput.value = rr(2, 64);
    setOptBtn('curve', curves[rr(0, curves.length - 1)]);
    setOptBtn('wave', waves[rr(0, 3)]);
    MP._sfxClearPresetActive();
    rebuildAndUpdate();
    MP.previewSfx(MP.getSfxParams());
  });

  document.getElementById('sfx-swap').addEventListener('click', function() {
    pushSfxUndo();
    var tmp = startFreqInput.value;
    startFreqInput.value = endFreqInput.value;
    endFreqInput.value = tmp;
    MP._sfxClearPresetActive();
    rebuildAndUpdate();
    MP.previewSfx(MP.getSfxParams());
  });

  document.getElementById('sfx-reverse').addEventListener('click', function() {
    pushSfxUndo();
    MP._sfxGrainFreqs.reverse();
    MP._sfxGrainTimes = MP._sfxGrainTimes.map(function(t) { return 1 - t; }).reverse();
    MP._sfxClearPresetActive();
    updateDisplayValues();
    MP.previewSfx(MP.getSfxParams());
  });

  document.getElementById('sfx-mic').addEventListener('click', function() {
    if (MP._sfxMicRecording) {
      MP.sfxMicStop(function() {
        updateDisplayValues();
        MP.previewSfx(MP.getSfxParams());
      });
    } else {
      MP.sfxMicStart(function() {
        updateDisplayValues();
        MP.previewSfx(MP.getSfxParams());
      });
    }
  });

  document.getElementById('sfx-save').addEventListener('click', function() {
    saveCustomPreset();
  });

  document.getElementById('sfx-preview').addEventListener('click', function() {
    MP.previewSfx(MP.getSfxParams());
  });

  document.getElementById('sfx-insert').addEventListener('click', function() {
    MP.insertSfx(MP.getSfxParams());
  });

  document.getElementById('sfx-undo').addEventListener('click', function() {
    if (MP._sfxUndoStack.length === 0) return;
    MP._sfxRedoStack.push(MP._sfxSnapshot());
    var snap = MP._sfxUndoStack.pop();
    MP._sfxRestoreSnapshot(snap, setOptBtn, startFreqInput, endFreqInput, durationInput, grainsInput);
    updateDisplayValues();
    MP._sfxUpdateUndoButtons();
    MP.previewSfx(MP.getSfxParams());
  });

  document.getElementById('sfx-redo').addEventListener('click', function() {
    if (MP._sfxRedoStack.length === 0) return;
    MP._sfxUndoStack.push(MP._sfxSnapshot());
    var snap = MP._sfxRedoStack.pop();
    MP._sfxRestoreSnapshot(snap, setOptBtn, startFreqInput, endFreqInput, durationInput, grainsInput);
    updateDisplayValues();
    MP._sfxUpdateUndoButtons();
    MP.previewSfx(MP.getSfxParams());
  });

  document.querySelectorAll('[data-grains]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      pushSfxUndo();
      grainsInput.value = btn.dataset.grains;
      MP._sfxClearPresetActive();
      rebuildAndUpdate();
    });
  });

  var quantizeEl = document.getElementById('sfx-quantize');
  if (quantizeEl) {
    quantizeEl.addEventListener('change', function() {
      quantizeEl.closest('.sfx-quantize-label').classList.toggle('active', quantizeEl.checked);
      pushSfxUndo();
      rebuildAndUpdate();
      MP.previewSfx(MP.getSfxParams());
    });
  }

  canvas.addEventListener('dblclick', function(e) {
    if (MP._sfxDragState) {
      if (_sfxDragOnMove) document.removeEventListener('mousemove', _sfxDragOnMove);
      if (_sfxDragOnUp) document.removeEventListener('mouseup', _sfxDragOnUp);
      MP._sfxDragState = null;
      canvas.style.cursor = '';
    }
    var gs = canvas._sfxGraphState;
    if (!gs) return;
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var n = MP._sfxGrainFreqs.length;
    var hit = MP._sfxFindNearestDot(mx, my, gs);
    if (hit.idx >= 0 && hit.dist <= 15) {
      if (n <= MP.SFX_MIN_GRAINS) { MP.showToast('Minimum grains reached'); return; }
      var bestIdx = hit.idx;
      pushSfxUndo();
      MP._sfxGrainFreqs.splice(bestIdx, 1);
      MP._sfxGrainTimes.splice(bestIdx, 1);
      if (MP._sfxGrainTimes.length > 0) {
        MP._sfxGrainTimes[0] = 0;
        MP._sfxGrainTimes[MP._sfxGrainTimes.length - 1] = 1;
      }
      grainsInput.value = MP._sfxGrainFreqs.length;
      MP._sfxClearPresetActive();
      updateDisplayValues();
    } else {
      if (n >= MP.SFX_MAX_GRAINS) { MP.showToast('Maximum grains reached'); return; }
      var newTime = MP.clamp((mx - gs.padL) / gs.graphW, 0, 1);
      var newFreq = Math.round(MP.clamp(gs.yToFreq(my), MP.SFX_MIN_FREQ, MP.SFX_MAX_FREQ));
      pushSfxUndo();
      var insertIdx = 0;
      while (insertIdx < MP._sfxGrainTimes.length && MP._sfxGrainTimes[insertIdx] < newTime) insertIdx++;
      MP._sfxGrainFreqs.splice(insertIdx, 0, newFreq);
      MP._sfxGrainTimes.splice(insertIdx, 0, newTime);
      grainsInput.value = MP._sfxGrainFreqs.length;
      MP._sfxClearPresetActive();
      updateDisplayValues();
    }
  });

  canvas.addEventListener('mousemove', function(e) {
    var gs = canvas._sfxGraphState;
    if (!gs || MP._sfxDragState) return;
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var hit = MP._sfxFindNearestDot(mx, my, gs);
    var tip = document.getElementById('sfx-graph-tip');
    if (hit.idx >= 0 && hit.dist <= 15) {
      var freq = MP._sfxGrainFreqs[hit.idx];
      var midi = MP.midiFromFreq(freq);
      midi = MP.clamp(midi, MP.MIDI_MIN, MP.MIDI_MAX);
      tip.textContent = freq + ' Hz (' + MP.nameFromMidi(midi) + ')';
      var tipX = e.clientX - rect.left + 10;
      var tipW = tip.offsetWidth || 80;
      if (tipX + tipW > rect.width) tipX = e.clientX - rect.left - tipW - 5;
      tip.style.left = tipX + 'px';
      tip.style.top = (e.clientY - rect.top - 20) + 'px';
      tip.style.display = 'block';
      canvas.style.cursor = 'grab';
    } else {
      tip.style.display = 'none';
      canvas.style.cursor = '';
    }
  });
  canvas.addEventListener('mouseleave', function() {
    document.getElementById('sfx-graph-tip').style.display = 'none';
    canvas.style.cursor = '';
  });

  document.getElementById('sfx-reset-timing').addEventListener('click', function() {
    pushSfxUndo();
    MP._sfxGrainTimes = MP._sfxDefaultTimes(MP._sfxGrainFreqs.length);
    updateDisplayValues();
  });

  document.getElementById('sfx-graph-play').addEventListener('click', function() {
    MP.previewSfx(MP.getSfxParams());
  });

  function transposeSfx(semitones) {
    if (MP._sfxGrainFreqs.length === 0) return;
    var midis = MP._sfxGrainFreqs.map(function(f) { return MP.midiFromFreq(f); });
    var minMidi = Math.min.apply(null, midis);
    var maxMidi = Math.max.apply(null, midis);
    if (minMidi + semitones < MP.MIDI_MIN || maxMidi + semitones > MP.MIDI_MAX) return;
    pushSfxUndo();
    for (var i = 0; i < MP._sfxGrainFreqs.length; i++) {
      MP._sfxGrainFreqs[i] = MP.freqFromMidi(midis[i] + semitones);
    }
    startFreqInput.value = MP._sfxGrainFreqs[0];
    endFreqInput.value = MP._sfxGrainFreqs[MP._sfxGrainFreqs.length - 1];
    MP._sfxClearPresetActive();
    updateDisplayValues();
    MP.previewSfx(MP.getSfxParams());
  }

  document.getElementById('sfx-oct-down').addEventListener('click', function() { transposeSfx(-12); });
  document.getElementById('sfx-semi-down').addEventListener('click', function() { transposeSfx(-1); });
  document.getElementById('sfx-semi-up').addEventListener('click', function() { transposeSfx(1); });
  document.getElementById('sfx-oct-up').addEventListener('click', function() { transposeSfx(12); });

  var snapBtn = document.getElementById('sfx-graph-snap');
  snapBtn.classList.toggle('active', MP._sfxSnapEnabled);
  snapBtn.addEventListener('click', function() {
    MP._sfxSnapEnabled = !MP._sfxSnapEnabled;
    snapBtn.classList.toggle('active', MP._sfxSnapEnabled);
    MP.drawSfxGraph(MP.getSfxParams());
  });

  document.getElementById('sfx-copy-json').addEventListener('click', function() {
    var p = MP.getSfxParams();
    if (MP._sfxGrainTimes.length === p.grains && !MP._sfxTimesAreUniform(MP._sfxGrainTimes)) {
      p.times = MP._sfxGrainTimes.map(function(t) { return Math.round(t * 1000) / 1000; });
    }
    var json = JSON.stringify(p);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).then(function() { MP.showToast('SFX params copied'); });
    }
  });

  document.getElementById('sfx-copy-fn').addEventListener('click', function() {
    var p = MP.getSfxParams();
    var freqs = MP._sfxGrainFreqs.length === p.grains ? MP._sfxGrainFreqs : MP.computeSfxFreqs(p);
    var times = MP._sfxGrainTimes.length === p.grains ? MP._sfxGrainTimes : MP._sfxDefaultTimes(p.grains);
    var mpTab = document.querySelector('.view-tab[data-output="micropython"]');
    var lang = (mpTab && mpTab.classList.contains('active')) ? 'micropython' : 'arduino';
    var code = MP.generateSfxFunction(p, freqs, times, lang);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(function() { MP.showToast('SFX function copied (' + lang + ')'); });
    }
  });

  document.getElementById('sfx-export-wav').addEventListener('click', function() {
    MP.exportSfxWav(MP.getSfxParams());
  });

  var sfxFileInput = document.getElementById('sfx-import-file');
  document.getElementById('sfx-import-audio').addEventListener('click', function() {
    sfxFileInput.click();
  });
  sfxFileInput.addEventListener('change', function() {
    var file = sfxFileInput.files[0];
    if (!file) return;
    sfxFileInput.value = '';
    var reader = new FileReader();
    reader.onload = function() {
      var ctx = MP.getAudioCtx();
      ctx.decodeAudioData(reader.result, function(audioBuffer) {
        var result = MP._sfxAnalyzeAudio(audioBuffer.getChannelData(0), audioBuffer.sampleRate);
        if (!result) { MP.showToast('No pitch detected in audio', true); return; }
        pushSfxUndo();
        MP._sfxGrainFreqs = result.resampled;
        MP._sfxGrainTimes = MP._sfxDefaultTimes(result.resampled.length);
        document.getElementById('sfx-duration').value = MP.clamp(result.durationMs, MP.SFX_MIN_DURATION, MP.SFX_MAX_DURATION);
        grainsInput.value = result.grains;
        startFreqInput.value = result.resampled[0];
        endFreqInput.value = result.resampled[result.resampled.length - 1];
        MP._sfxClearPresetActive();
        updateDisplayValues();
        MP.showToast('Imported audio (' + result.voiced + ' frames, ' + result.grains + ' grains)');
      }, function() { MP.showToast('Failed to decode audio file', true); });
    };
    reader.readAsArrayBuffer(file);
  });

  function applySfxJson(text) {
    try {
      var p = JSON.parse(text);
      if (p.startFreq && p.endFreq && p.durationMs && p.grains) {
        pushSfxUndo();
        startFreqInput.value = MP.clamp(parseInt(p.startFreq) || 440, MP.SFX_MIN_FREQ, MP.SFX_MAX_FREQ);
        endFreqInput.value = MP.clamp(parseInt(p.endFreq) || 440, MP.SFX_MIN_FREQ, MP.SFX_MAX_FREQ);
        durationInput.value = MP.clamp(parseInt(p.durationMs) || 200, MP.SFX_MIN_DURATION, MP.SFX_MAX_DURATION);
        grainsInput.value = MP.clamp(parseInt(p.grains) || 20, MP.SFX_MIN_GRAINS, MP.SFX_MAX_GRAINS);
        if (p.curve) setOptBtn('curve', p.curve);
        if (p.wave) setOptBtn('wave', p.wave);
        MP._sfxClearPresetActive();
        rebuildAndUpdate();
        var clampedGrains = parseInt(grainsInput.value);
        if (p.times && Array.isArray(p.times) && p.times.length === clampedGrains) {
          var validTimes = p.times.every(function(t) { return typeof t === 'number' && isFinite(t) && t >= 0 && t <= 1; });
          if (validTimes) {
            MP._sfxGrainTimes = p.times.slice();
            updateDisplayValues();
          }
        }
        MP.previewSfx(MP.getSfxParams());
        MP.showToast('SFX params pasted');
      }
    } catch(ex) {}
  }

  function pasteSfxFromClipboard() {
    if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(applySfxJson).catch(function() {});
      return;
    }
    var input = document.createElement('textarea');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.focus();
    document.execCommand('paste');
    var text = input.value;
    document.body.removeChild(input);
    if (text) applySfxJson(text);
  }

  document.addEventListener('paste', function(e) {
    if (modal.style.display === 'none') return;
    var text = (e.clipboardData || window.clipboardData).getData('text');
    if (text) { e.preventDefault(); applySfxJson(text); }
  });

  modal.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;
    if (e.key === ' ') { e.preventDefault(); e.target.blur(); MP.previewSfx(MP.getSfxParams()); }
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('sfx-insert').click(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') { e.preventDefault(); pasteSfxFromClipboard(); }
  });

  loadPreset('laser');
  setupModalDismiss('sfx-modal', 'sfx-modal-close');

  var sfxModalEl = document.getElementById('sfx-modal');
  var sfxCloseEl = document.getElementById('sfx-modal-close');
  function onSfxModalClose() {
    MP._sfxEditingGroup = null;
    document.getElementById('sfx-insert').textContent = 'Insert';
  }
  sfxCloseEl.addEventListener('click', onSfxModalClose);
  sfxModalEl.addEventListener('click', function(e) { if (e.target === sfxModalEl) onSfxModalClose(); });
};
