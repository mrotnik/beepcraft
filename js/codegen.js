MP.updateStats = function() {
  const statsEl = document.getElementById('melody-stats');
  const countEl = document.getElementById('note-count');
  const seq = MP.appState.seq;
  countEl.textContent = seq.length + ' note' + (seq.length !== 1 ? 's' : '');
  if (seq.length === 0) { statsEl.textContent = ''; return; }
  const bpm = MP.getBpm();
  const totalBeats = Math.max(MP.seqEndBeat(), MP.appState.nextNoteStart);
  const totalSec = (totalBeats * 60 / bpm).toFixed(1);
  const freqs = seq.map(n => n.freq).filter(f => f > 0);
  const minFreq = Math.min(...freqs);
  const maxFreq = Math.max(...freqs);
  const memBytes = seq.length * 4;
  statsEl.textContent = totalSec + 's | ' + minFreq + '-' + maxFreq + 'Hz | ~' + memBytes + 'B';
};

MP.generateCode = function() {
  const output = document.getElementById('output');
  const rtttlOutput = document.getElementById('rtttl-output');
  MP.updateStats();
  if (MP.appState.seq.length === 0) { output.value = ''; rtttlOutput.value = ''; return; }

  const flat = MP.seqToFlat();
  const uniqueFreqs = {};
  flat.forEach(n => { if (n.freq > 0) uniqueFreqs[n.name] = n.freq; });
  const toDefine = name => 'NOTE_' + name.replace('#', 'S');

  const bpmVal = MP.getBpm();
  const wholeMs = Math.round(240000 / bpmVal);

  let code = '// ===== MELODY DATA — paste after pin defines =====\n\n';
  code += '// Note frequency definitions\n';
  Object.entries(uniqueFreqs).forEach(([name, freq]) => {
    code += '#define ' + toDefine(name).padEnd(12) + ' ' + freq + '\n';
  });
  code += '\n// Melody (0 = rest/pause)\n';
  code += 'int melody[] = {\n  ' + flat.map(n => n.freq === 0 ? '0' : toDefine(n.name)).join(', ') + '\n};\n';
  code += '\n// Note durations: 1=whole, 2=half, 4=quarter, 8=eighth, 16=16th, 32=32nd, 64=64th, 128=128th (negative = dotted)\n';
  code += 'int noteDurations[] = {\n  ' + flat.map(n => n.dotted ? -n.dur : n.dur).join(', ') + '\n};\n';
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
  code += '    if (currentNote >= melodyLength) currentNote = 0;\n';
  code += '    int dur = noteDurations[currentNote];\n';
  code += '    int duration = dur > 0 ? (wholenote / dur) : (-wholenote * 3 / (dur * 2));\n';
  code += '    if (melody[currentNote] > 0) {\n';
  code += '      tone(BUZZER_PIN, melody[currentNote], duration * 0.9);\n';
  code += '    } else {\n';
  code += '      noTone(BUZZER_PIN);\n';
  code += '    }\n';
  code += '    noteStart = now;\n';
  code += '    noteDuration = duration;\n';
  code += '    currentNote++;\n';
  code += '  }\n';
  code += '}\n';
  code += '\n// ===== USAGE: call melodyTick() in loop() while playing =====\n';
  output.value = code;

  rtttlOutput.value = MP.generateRTTTL(flat, MP.getBpm());
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
