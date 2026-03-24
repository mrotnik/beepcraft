MP._autoSizeTextarea = function(el) {
  if (!el) return;
  if (!el.offsetParent) return;
  MP._keepScroll(function() {
    el.style.height = '0';
    el.style.height = Math.min(el.scrollHeight, 600) + 'px';
  });
};

MP.updateStats = function() {
  const statsEl = document.getElementById('melody-stats');
  const countEl = document.getElementById('note-count');
  const seq = MP.appState.seq;
  countEl.textContent = seq.length + ' note' + (seq.length !== 1 ? 's' : '');
  if (seq.length === 0) { statsEl.textContent = ''; return; }
  const bpm = MP.getBpm();
  const totalBeats = MP.totalBeats();
  const totalSec = (totalBeats * 60 / bpm).toFixed(1);
  const freqs = seq.map(n => n.freq).filter(f => f > 0);
  const minFreq = Math.min(...freqs);
  const maxFreq = Math.max(...freqs);
  const memBytes = seq.length * 4;
  statsEl.textContent = totalSec + 's | ' + minFreq + '-' + maxFreq + 'Hz | ~' + memBytes + 'B';
};

MP.generateCode = function() {
  const output = document.getElementById('output');
  const outputMp = document.getElementById('output-mp');
  const rtttlOutput = document.getElementById('rtttl-output');
  MP.updateStats();
  if (MP.appState.seq.length === 0) { output.value = ''; if (outputMp) outputMp.value = ''; rtttlOutput.value = ''; MP._autoSizeTextarea(output); MP._autoSizeTextarea(outputMp); MP._autoSizeTextarea(rtttlOutput); return; }

  const flat = MP.seqToFlat();
  const uniqueFreqs = {};
  flat.forEach(n => { if (n.freq > 0) uniqueFreqs[n.name] = n.freq; });
  const toDefine = name => 'NOTE_' + name.replace('#', 'S');

  const bpmVal = MP.getBpm();
  const wholeMs = Math.round(240000 / bpmVal);
  var codegenLoop = document.getElementById('codegen-loop');
  var loopEnabled = !codegenLoop || codegenLoop.checked;
  var compactEl = document.getElementById('codegen-compact');
  var compact = compactEl && compactEl.checked;
  var mpLoopEl = document.getElementById('codegen-mp-loop');
  var mpLoopEnabled = !mpLoopEl || mpLoopEl.checked;

  const flatDur = n => n.dotted ? -n.dur : n.dur;
  const noteRef = n => n.freq === 0 ? '0' : toDefine(n.name);

  var code;
  if (compact) {
    var defines = Object.entries(uniqueFreqs).map(([name, freq]) => '#define ' + toDefine(name) + ' ' + freq).join('\n');
    var loopLine = loopEnabled ? 'if(currentNote>=melodyLength)currentNote=0;' : 'if(currentNote>=melodyLength){noTone(BUZZER_PIN);return;}';
    code = defines + '\n';
    code += 'const int melody[]={' + flat.map(noteRef).join(',') + '};\n';
    code += 'const int noteDurations[]={' + flat.map(flatDur).join(',') + '};\n';
    code += 'int melodyLength=sizeof(melody)/sizeof(melody[0]);\n';
    code += 'int wholenote=' + wholeMs + ';\n';
    code += 'int currentNote=0;unsigned long noteStart=0;unsigned long noteDuration=0;\n';
    code += 'void melodyTick(){unsigned long now=millis();if(now-noteStart>=noteDuration){' + loopLine;
    code += 'int dur=noteDurations[currentNote];int duration=dur>0?(wholenote/dur):(-wholenote*3/(dur*2));';
    code += 'if(melody[currentNote]>0){tone(BUZZER_PIN,melody[currentNote],duration*9/10);}else{noTone(BUZZER_PIN);}';
    code += 'noteStart=now;noteDuration=duration;currentNote++;}}\n';
  } else {
    code = '// ===== MELODY DATA — paste after pin defines =====\n\n';
    code += '// Note frequency definitions\n';
    Object.entries(uniqueFreqs).forEach(([name, freq]) => {
      code += '#define ' + toDefine(name).padEnd(12) + ' ' + freq + '\n';
    });
    code += '\n// Melody (0 = rest/pause)\n';
    code += 'const int melody[] = {\n  ' + flat.map(noteRef).join(', ') + '\n};\n';
    code += '\n// Note durations: 1=whole, 2=half, 4=quarter, 8=eighth, 16=16th, 32=32nd, 64=64th, 128=128th (negative = dotted)\n';
    code += 'const int noteDurations[] = {\n  ' + flat.map(flatDur).join(', ') + '\n};\n';
    code += '\nint melodyLength = sizeof(melody) / sizeof(melody[0]);\n';
    code += '\n// BPM = ' + bpmVal + ' -> whole note = ' + wholeMs + 'ms\n';
    code += 'int wholenote = ' + wholeMs + ';\n';
    code += '\n// ===== PLAYBACK — paste after melody data, before setup() =====\n\n';
    code += 'int currentNote = 0;\n';
    code += 'unsigned long noteStart = 0;\n';
    code += 'unsigned long noteDuration = 0;\n';
    code += '\n// Non-blocking melody step — call every loop() iteration while playing\n';
    code += 'void melodyTick() {\n';
    code += '  unsigned long now = millis();\n';
    code += '  if (now - noteStart >= noteDuration) {\n';
    if (!loopEnabled) {
      code += '    if (currentNote >= melodyLength) { noTone(BUZZER_PIN); return; }\n';
    } else {
      code += '    if (currentNote >= melodyLength) currentNote = 0;\n';
    }
    code += '    int dur = noteDurations[currentNote];\n';
    code += '    int duration = dur > 0 ? (wholenote / dur) : (-wholenote * 3 / (dur * 2));\n';
    code += '    if (melody[currentNote] > 0) {\n';
    code += '      tone(BUZZER_PIN, melody[currentNote], duration * 9 / 10);\n';
    code += '    } else {\n';
    code += '      noTone(BUZZER_PIN);\n';
    code += '    }\n';
    code += '    noteStart = now;\n';
    code += '    noteDuration = duration;\n';
    code += '    currentNote++;\n';
    code += '  }\n';
    code += '}\n';
    code += '\n// ===== USAGE: call melodyTick() in loop() while playing =====\n';
  }
  output.value = code;
  MP._autoSizeTextarea(output);

  if (outputMp) {
    var mpCode = 'from machine import Pin, PWM\nimport time\n\n';
    var mpPin = (document.getElementById('buzzer-pin').value || '5').replace(/\D/g, '') || '5';
    mpCode += 'BUZZER_PIN = ' + mpPin + '\n';
    mpCode += 'melody = [' + flat.map(n => n.freq).join(', ') + ']\n';
    mpCode += 'durations = [' + flat.map(flatDur).join(', ') + ']\n';
    mpCode += 'wholenote = ' + wholeMs + '\n\n';
    mpCode += 'pwm = PWM(Pin(BUZZER_PIN))\n';
    if (mpLoopEnabled) {
      mpCode += 'while True:\n';
      mpCode += '    for i in range(len(melody)):\n';
    } else {
      mpCode += 'for i in range(len(melody)):\n';
    }
    var indent = mpLoopEnabled ? '        ' : '    ';
    mpCode += indent + 'dur = durations[i]\n';
    mpCode += indent + 'duration = wholenote // dur if dur > 0 else -wholenote * 3 // (dur * 2)\n';
    mpCode += indent + 'if melody[i] > 0:\n';
    mpCode += indent + '    pwm.freq(melody[i])\n';
    mpCode += indent + '    pwm.duty(512)\n';
    mpCode += indent + '    time.sleep_ms(duration * 9 // 10)\n';
    mpCode += indent + '    pwm.duty(0)\n';
    mpCode += indent + 'time.sleep_ms(duration // 10)\n';
    if (!mpLoopEnabled) {
      mpCode += 'pwm.deinit()\n';
    }
    outputMp.value = mpCode;
    MP._autoSizeTextarea(outputMp);
  }

  rtttlOutput.value = MP.generateRTTTL(flat, MP.getBpm());
  MP._autoSizeTextarea(rtttlOutput);

  var rtttlWarn = document.getElementById('rtttl-warn');
  if (rtttlWarn) {
    rtttlWarn.style.display = MP.hasOverlappingNotes() ? '' : 'none';
  }
};

MP._detectSfxRuns = function(grains) {
  var runs = [];
  var i = 0;
  while (i < grains.length) {
    var j = i + 1;
    var meanDur = grains[i].durMs;
    while (j < grains.length) {
      var newMean = 0;
      for (var s = i; s <= j; s++) newMean += grains[s].durMs;
      newMean /= (j - i + 1);
      var tol = Math.max(newMean * 0.05, 1);
      var allClose = true;
      for (var c = i; c <= j; c++) {
        if (Math.abs(grains[c].durMs - newMean) > tol) { allClose = false; break; }
      }
      if (!allClose) break;
      meanDur = newMean;
      j++;
    }
    var len = j - i;
    if (len >= 4) {
      var step = len > 1 ? (grains[i + 1].freq - grains[i].freq) : 0;
      var isLinear = true;
      for (var f = i + 1; f < j; f++) {
        var expected = grains[i].freq + (f - i) * step;
        if (Math.abs(grains[f].freq - expected) > 2) { isLinear = false; break; }
      }
      if (isLinear) {
        runs.push({ start: i, len: len, type: 'loop', freq0: grains[i].freq, step: step, durMs: Math.round(meanDur) });
        i = j;
        continue;
      }
    }
    runs.push({ start: i, len: 1, type: 'single', freq: grains[i].freq, durMs: grains[i].durMs });
    i++;
  }
  return runs;
};

MP.generateSfxFunction = function(params, freqs, times, lang) {
  var n = freqs.length;
  var t = times.length === n ? times : MP._sfxDefaultTimes(n);
  var durs = MP._sfxGrainDurs(t);
  var grains = [];
  for (var i = 0; i < n; i++) {
    grains.push({ freq: freqs[i], durMs: Math.round(durs[i] * params.durationMs) });
  }
  var runs = MP._detectSfxRuns(grains);

  if (lang === 'micropython') {
    var code = 'from machine import Pin, PWM\nimport time\n\n';
    code += 'def play_sfx(pin_num):\n';
    code += '    pwm = PWM(Pin(pin_num))\n';
    for (var r = 0; r < runs.length; r++) {
      var run = runs[r];
      if (run.type === 'loop') {
        var playMs = Math.round(run.durMs * 9 / 10);
        var restMs = run.durMs - playMs;
        if (run.step === 0) {
          code += '    for i in range(' + run.len + '):\n';
          code += '        pwm.freq(' + run.freq0 + ')\n';
          code += '        pwm.duty(512)\n';
          code += '        time.sleep_ms(' + playMs + ')\n';
          code += '        pwm.duty(0)\n';
          if (restMs > 0) code += '        time.sleep_ms(' + restMs + ')\n';
        } else {
          code += '    for i in range(' + run.len + '):\n';
          code += '        pwm.freq(' + run.freq0 + (run.step > 0 ? ' + i * ' + run.step : ' - i * ' + (-run.step)) + ')\n';
          code += '        pwm.duty(512)\n';
          code += '        time.sleep_ms(' + playMs + ')\n';
          code += '        pwm.duty(0)\n';
          if (restMs > 0) code += '        time.sleep_ms(' + restMs + ')\n';
        }
      } else {
        var g = grains[run.start];
        var pMs = Math.round(g.durMs * 9 / 10);
        var rMs = g.durMs - pMs;
        code += '    pwm.freq(' + g.freq + ')\n';
        code += '    pwm.duty(512)\n';
        code += '    time.sleep_ms(' + pMs + ')\n';
        code += '    pwm.duty(0)\n';
        if (rMs > 0) code += '    time.sleep_ms(' + rMs + ')\n';
      }
    }
    code += '    pwm.deinit()\n';
    return code;
  }

  var code = 'void playSfx(int pin) {\n';
  for (var r = 0; r < runs.length; r++) {
    var run = runs[r];
    if (run.type === 'loop') {
      if (run.step === 0) {
        code += '  for (int i = 0; i < ' + run.len + '; i++) {\n';
        code += '    tone(pin, ' + run.freq0 + ', ' + Math.round(run.durMs * 9 / 10) + ');\n';
        code += '    delay(' + run.durMs + ');\n';
        code += '  }\n';
      } else {
        code += '  for (int i = 0; i < ' + run.len + '; i++) {\n';
        code += '    tone(pin, ' + run.freq0 + (run.step > 0 ? ' + i * ' + run.step : ' - i * ' + (-run.step)) + ', ' + Math.round(run.durMs * 9 / 10) + ');\n';
        code += '    delay(' + run.durMs + ');\n';
        code += '  }\n';
      }
    } else {
      var g = grains[run.start];
      code += '  tone(pin, ' + g.freq + ', ' + Math.round(g.durMs * 9 / 10) + ');\n';
      code += '  delay(' + g.durMs + ');\n';
    }
  }
  code += '  noTone(pin);\n';
  code += '}\n';
  return code;
};

MP.generateMIDI = function() {
  var seq = MP.appState.seq;
  if (seq.length === 0) return null;
  var bpm = MP.getBpm();
  var PPQ = 480;
  var sorted = [...seq].sort(function(a, b) { return a.start - b.start; });

  function writeVLQ(val) {
    var bytes = [];
    bytes.push(val & 0x7F);
    val >>= 7;
    while (val > 0) {
      bytes.push((val & 0x7F) | 0x80);
      val >>= 7;
    }
    bytes.reverse();
    return bytes;
  }

  function writeUint16(val) { return [(val >> 8) & 0xFF, val & 0xFF]; }
  function writeUint32(val) { return [(val >> 24) & 0xFF, (val >> 16) & 0xFF, (val >> 8) & 0xFF, val & 0xFF]; }

  var trackData = [];
  trackData.push.apply(trackData, writeVLQ(0));
  trackData.push(0xFF, 0x51, 0x03);
  var usPerBeat = Math.round(60000000 / bpm);
  trackData.push((usPerBeat >> 16) & 0xFF, (usPerBeat >> 8) & 0xFF, usPerBeat & 0xFF);

  var name = MP.appState.melodyName || 'Melody';
  var nameBytes = [];
  for (var ci = 0; ci < name.length; ci++) nameBytes.push(name.charCodeAt(ci) & 0x7F);
  trackData.push.apply(trackData, writeVLQ(0));
  trackData.push(0xFF, 0x03);
  trackData.push.apply(trackData, writeVLQ(nameBytes.length));
  trackData.push.apply(trackData, nameBytes);

  var events = [];
  sorted.forEach(function(n) {
    var midi = MP.midiFromName(n.name);
    if (midi < 0) return;
    var startTick = Math.round(n.start * PPQ);
    var durTick = Math.max(1, Math.round(n.dur * PPQ));
    events.push({ tick: startTick, type: 'on', midi: midi, vel: 100 });
    events.push({ tick: startTick + durTick, type: 'off', midi: midi, vel: 0 });
  });
  events.sort(function(a, b) { return a.tick - b.tick || (a.type === 'off' ? -1 : 1); });

  var lastTick = 0;
  events.forEach(function(ev) {
    var delta = ev.tick - lastTick;
    lastTick = ev.tick;
    trackData.push.apply(trackData, writeVLQ(delta));
    trackData.push(ev.type === 'on' ? 0x90 : 0x80, ev.midi, ev.vel);
  });

  trackData.push.apply(trackData, writeVLQ(0));
  trackData.push(0xFF, 0x2F, 0x00);

  var header = [0x4D, 0x54, 0x68, 0x64];
  header.push.apply(header, writeUint32(6));
  header.push.apply(header, writeUint16(0));
  header.push.apply(header, writeUint16(1));
  header.push.apply(header, writeUint16(PPQ));

  var track = [0x4D, 0x54, 0x72, 0x6B];
  track.push.apply(track, writeUint32(trackData.length));
  track.push.apply(track, trackData);

  var out = new Uint8Array(header.length + track.length);
  out.set(header, 0);
  out.set(track, header.length);
  return out;
};
