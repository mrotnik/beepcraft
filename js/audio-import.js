MP.YIN_BUFFER_SIZE = 4096;
MP.IMPORT_SILENCE_THRESH = 0.015;
MP.IMPORT_MIN_NOTE_BEATS = 0.125;
MP.IMPORT_MIN_SEGMENT_FRAMES = 3;
MP.IMPORT_LP_CUTOFF = 1500;

MP._lowPassFilter = function(samples, sampleRate, cutoff) {
  var rc = 1.0 / (2 * Math.PI * cutoff);
  var dt = 1.0 / sampleRate;
  var alpha = dt / (rc + dt);
  var out = new Float32Array(samples.length);
  out[0] = samples[0];
  for (var i = 1; i < samples.length; i++) {
    out[i] = out[i - 1] + alpha * (samples[i] - out[i - 1]);
  }
  return out;
};

MP._yinDifference = function(buffer) {
  var size = Math.floor(buffer.length / 2);
  var diff = new Float32Array(size);
  for (var i = 0; i < size; i++) {
    var sum = 0;
    for (var j = 0; j < size; j++) {
      var delta = buffer[j] - buffer[j + i];
      sum += delta * delta;
    }
    diff[i] = sum;
  }
  diff[0] = 1;
  var runSum = 0;
  for (var i = 1; i < size; i++) {
    runSum += diff[i];
    diff[i] = diff[i] * i / runSum;
  }
  return diff;
};

MP._yinCandidates = function(diff, sampleRate, thresholds) {
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
        if (freq < 50 || freq > 2000) break;
        var midi = Math.round(MP.A4_MIDI + 12 * Math.log2(freq / MP.A4_FREQ));
        if (midi < 24 || midi > 96) break;
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

MP._viterbiSmooth = function(framesCandidates, hopSec) {
  var N = framesCandidates.length;
  if (N === 0) return [];

  var SILENCE = -1;
  var SELF_TRANSITION = 0.95;
  var TO_SILENCE = 0.01;
  var FROM_SILENCE = 0.05;
  var SILENCE_SELF = 0.9;
  var MAX_JUMP_SEMITONES = 5;

  var states = [];
  var backptr = [];

  var first = framesCandidates[0];
  var initStates = {};
  if (first.silence) {
    initStates[SILENCE] = { prob: Math.log(0.9), midi: SILENCE };
  }
  for (var c = 0; c < first.candidates.length; c++) {
    var cand = first.candidates[c];
    var p = Math.log(Math.max(1e-10, cand.confidence * 0.5));
    if (!initStates[cand.midi] || p > initStates[cand.midi].prob) {
      initStates[cand.midi] = { prob: p, midi: cand.midi };
    }
  }
  if (Object.keys(initStates).length === 0) {
    initStates[SILENCE] = { prob: 0, midi: SILENCE };
  }
  states.push(initStates);

  for (var t = 1; t < N; t++) {
    var frame = framesCandidates[t];
    var prevStates = states[t - 1];
    var curStates = {};
    var curBack = {};

    var curCandidates = [];
    if (frame.silence) curCandidates.push({ midi: SILENCE, confidence: 0.5 });
    for (var c = 0; c < frame.candidates.length; c++) {
      curCandidates.push(frame.candidates[c]);
    }
    if (curCandidates.length === 0) curCandidates.push({ midi: SILENCE, confidence: 0.5 });

    for (var ci = 0; ci < curCandidates.length; ci++) {
      var cand = curCandidates[ci];
      var curMidi = cand.midi;
      var emitProb = Math.log(Math.max(1e-10, curMidi === SILENCE ? 0.5 : cand.confidence));

      var bestProb = -Infinity;
      var bestPrev = SILENCE;

      var prevKeys = Object.keys(prevStates);
      for (var pi = 0; pi < prevKeys.length; pi++) {
        var prevMidi = parseInt(prevKeys[pi]);
        var prevProb = prevStates[prevMidi].prob;
        var transProb;

        if (curMidi === SILENCE && prevMidi === SILENCE) {
          transProb = Math.log(SILENCE_SELF);
        } else if (curMidi === SILENCE) {
          transProb = Math.log(TO_SILENCE);
        } else if (prevMidi === SILENCE) {
          transProb = Math.log(FROM_SILENCE);
        } else if (curMidi === prevMidi) {
          transProb = Math.log(SELF_TRANSITION);
        } else {
          var jump = Math.abs(curMidi - prevMidi);
          if (jump <= MAX_JUMP_SEMITONES) {
            transProb = Math.log((1 - SELF_TRANSITION - TO_SILENCE) / MAX_JUMP_SEMITONES);
          } else {
            transProb = Math.log(1e-6);
          }
        }

        var total = prevProb + transProb + emitProb;
        if (total > bestProb) {
          bestProb = total;
          bestPrev = prevMidi;
        }
      }

      if (!curStates[curMidi] || bestProb > curStates[curMidi].prob) {
        curStates[curMidi] = { prob: bestProb, midi: curMidi };
        curBack[curMidi] = bestPrev;
      }
    }

    if (Object.keys(curStates).length === 0) {
      curStates[SILENCE] = { prob: -100, midi: SILENCE };
      curBack[SILENCE] = SILENCE;
    }

    states.push(curStates);
    backptr.push(curBack);
  }

  var path = new Array(N);
  var lastStates = states[N - 1];
  var bestMidi = SILENCE;
  var bestProb = -Infinity;
  var keys = Object.keys(lastStates);
  for (var k = 0; k < keys.length; k++) {
    if (lastStates[keys[k]].prob > bestProb) {
      bestProb = lastStates[keys[k]].prob;
      bestMidi = parseInt(keys[k]);
    }
  }
  path[N - 1] = bestMidi;

  for (var t = N - 2; t >= 0; t--) {
    path[t] = backptr[t][path[t + 1]] !== undefined ? backptr[t][path[t + 1]] : SILENCE;
  }

  return path;
};

MP._analyzeAudioBuffer = function(audioBuffer, bpm) {
  var raw = audioBuffer.getChannelData(0);
  if (audioBuffer.numberOfChannels > 1) {
    var ch2 = audioBuffer.getChannelData(1);
    var mono = new Float32Array(raw.length);
    for (var m = 0; m < raw.length; m++) mono[m] = (raw[m] + ch2[m]) * 0.5;
    raw = mono;
  }

  var sr = audioBuffer.sampleRate;
  raw = MP._lowPassFilter(raw, sr, MP.IMPORT_LP_CUTOFF);

  var winSize = MP.YIN_BUFFER_SIZE;
  var hopSize = Math.floor(winSize / 4);
  var hopSec = hopSize / sr;

  var thresholds = [];
  for (var ti = 0; ti < 10; ti++) {
    thresholds.push(0.05 + ti * 0.05);
  }

  var maxRms = 0;
  var winData = [];
  for (var pos = 0; pos + winSize <= raw.length; pos += hopSize) {
    var win = raw.subarray(pos, pos + winSize);
    var rms = 0;
    for (var k = 0; k < win.length; k++) rms += win[k] * win[k];
    rms = Math.sqrt(rms / win.length);
    if (rms > maxRms) maxRms = rms;
    winData.push({ win: win, rms: rms, time: pos / sr });
  }

  var silenceThresh = Math.max(MP.IMPORT_SILENCE_THRESH, maxRms * 0.08);

  var framesCandidates = [];
  for (var i = 0; i < winData.length; i++) {
    var w = winData[i];
    if (w.rms < silenceThresh) {
      framesCandidates.push({ silence: true, candidates: [], time: w.time });
      continue;
    }
    var diff = MP._yinDifference(w.win);
    var candidates = MP._yinCandidates(diff, sr, thresholds);
    framesCandidates.push({
      silence: candidates.length === 0,
      candidates: candidates,
      time: w.time
    });
  }

  if (framesCandidates.length === 0) return [];

  var path = MP._viterbiSmooth(framesCandidates, hopSec);

  var segments = [];
  var seg = { midi: path[0], startTime: framesCandidates[0].time, endTime: framesCandidates[0].time, count: 1 };

  for (var fi = 1; fi < path.length; fi++) {
    if (path[fi] !== seg.midi) {
      seg.endTime += hopSec;
      segments.push(seg);
      seg = { midi: path[fi], startTime: framesCandidates[fi].time, endTime: framesCandidates[fi].time, count: 1 };
    } else {
      seg.endTime = framesCandidates[fi].time;
      seg.count++;
    }
  }
  seg.endTime += hopSec;
  segments.push(seg);

  var notes = [];
  var beatSec = 60 / bpm;

  for (var s = 0; s < segments.length; s++) {
    if (segments[s].midi < 0) continue;
    if (segments[s].count < MP.IMPORT_MIN_SEGMENT_FRAMES) continue;

    var startBeat = segments[s].startTime / beatSec;
    var durSec = segments[s].endTime - segments[s].startTime;
    var durBeat = durSec / beatSec;

    startBeat = MP.snapBeats(startBeat);
    durBeat = Math.max(MP.IMPORT_MIN_NOTE_BEATS, MP.snapBeats(durBeat));

    notes.push({
      name: MP.nameFromMidi(segments[s].midi),
      freq: MP.freqFromMidi(segments[s].midi),
      start: startBeat,
      dur: durBeat
    });
  }

  for (var n = 1; n < notes.length; n++) {
    var prev = notes[n - 1];
    if (prev.start + prev.dur > notes[n].start) {
      prev.dur = notes[n].start - prev.start;
      if (prev.dur < MP.IMPORT_MIN_NOTE_BEATS) prev.dur = MP.IMPORT_MIN_NOTE_BEATS;
    }
  }

  return notes;
};

MP._processAudioBuffer = function(audioBuffer, melodyName) {
  var modal = document.getElementById('import-modal');
  var status = document.getElementById('import-status');
  modal.style.display = '';
  status.textContent = 'Analyzing pitches...';
  setTimeout(function() {
    var notes = MP._analyzeAudioBuffer(audioBuffer, MP.getBpm());
    modal.style.display = 'none';
    if (notes.length === 0) {
      MP.showToast('No pitches detected \u2014 try a clearer monophonic recording', true);
      return;
    }
    MP.pushUndo();
    MP.appState.seq = notes;
    MP.resetNextNoteStart();
    MP.appState.melodyName = melodyName;
    MP.updateSequence();
    MP.showToast('Imported ' + notes.length + ' notes from ' + melodyName);
  }, 50);
};

MP.importAudioFile = function(file) {
  if (!file) return;
  if (file.size > MP.IMPORT_MAX_FILE_SIZE) {
    MP.showToast('File too large (max ' + Math.round(MP.IMPORT_MAX_FILE_SIZE / 1024 / 1024) + 'MB)', true);
    return;
  }
  var modal = document.getElementById('import-modal');
  var status = document.getElementById('import-status');
  modal.style.display = '';
  status.textContent = 'Reading file...';

  var reader = new FileReader();
  reader.onload = function() {
    status.textContent = 'Decoding audio...';
    var ctx = MP.getAudioCtx();
    ctx.decodeAudioData(reader.result, function(audioBuffer) {
      var name = MP.sanitizeFilename(file.name.replace(/\.[^.]+$/, ''));
      MP._processAudioBuffer(audioBuffer, name);
    }, function() {
      modal.style.display = 'none';
      MP.showToast('Failed to decode audio file', true);
    });
  };
  reader.readAsArrayBuffer(file);
};

MP.startMicRecording = function() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    MP.showToast('Microphone not supported in this browser', true);
    return;
  }
  var ctx = MP.getAudioCtx();
  navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
  }).then(function(stream) {
    MP.appState.micStream = stream;
    MP.appState.micChunks = [];
    MP.appState.micRecording = true;

    var source = ctx.createMediaStreamSource(stream);
    var processor = ctx.createScriptProcessor(4096, 1, 1);
    processor.onaudioprocess = function(e) {
      if (!MP.appState.micRecording) return;
      var data = e.inputBuffer.getChannelData(0);
      MP.appState.micChunks.push(new Float32Array(data));
    };
    source.connect(processor);
    processor.connect(ctx.destination);
    MP.appState._micSource = source;
    MP.appState._micProcessor = processor;

    MP.appState._micTimeout = setTimeout(function() {
      if (MP.appState.micRecording) {
        MP.stopMicRecording();
        MP.showToast('Mic recording stopped (max ' + Math.round(MP.MIC_MAX_DURATION_SEC / 60) + ' min)');
      }
    }, MP.MIC_MAX_DURATION_SEC * 1000);

    var btn = document.getElementById('btn-mic-record');
    btn.classList.add('recording');
    btn.innerHTML = '&#9632;<span class="btn-text">Stop Mic</span>';
    document.getElementById('btn-play').disabled = true;
    document.getElementById('btn-metronome').disabled = true;
    document.getElementById('btn-record').disabled = true;
  }).catch(function() {
    MP.showToast('Microphone access denied', true);
  });
};

MP.stopMicRecording = function() {
  MP.appState.micRecording = false;
  clearTimeout(MP.appState._micTimeout);
  if (MP.appState._micProcessor) {
    MP.appState._micProcessor.disconnect();
    MP.appState._micProcessor = null;
  }
  if (MP.appState._micSource) {
    MP.appState._micSource.disconnect();
    MP.appState._micSource = null;
  }
  if (MP.appState.micStream) {
    MP.appState.micStream.getTracks().forEach(function(t) { t.stop(); });
    MP.appState.micStream = null;
  }

  var btn = document.getElementById('btn-mic-record');
  btn.classList.remove('recording');
  btn.innerHTML = '&#127908;<span class="btn-text">Mic</span>';
  btn.blur();
  document.getElementById('btn-play').disabled = false;
  document.getElementById('btn-metronome').disabled = false;
  document.getElementById('btn-record').disabled = false;

  var chunks = MP.appState.micChunks;
  if (!chunks || chunks.length === 0) {
    MP.showToast('No audio recorded', true);
    return;
  }

  var totalLen = 0;
  chunks.forEach(function(c) { totalLen += c.length; });
  var merged = new Float32Array(totalLen);
  var offset = 0;
  chunks.forEach(function(c) { merged.set(c, offset); offset += c.length; });
  MP.appState.micChunks = [];

  var ctx = MP.getAudioCtx();
  var audioBuffer = ctx.createBuffer(1, merged.length, ctx.sampleRate);
  audioBuffer.getChannelData(0).set(merged);

  MP._processAudioBuffer(audioBuffer, 'Mic Recording');
};
