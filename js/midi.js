MP.initMIDI = function() {
  if (!navigator.requestMIDIAccess) {
    MP.showToast('Web MIDI not supported in this browser', true);
    return;
  }
  navigator.requestMIDIAccess().then(access => {
    MP._midiAccess = access;
    var inputs = [...access.inputs.values()];
    if (inputs.length === 0) {
      MP.showToast('No MIDI devices found', true);
      return;
    }
    inputs.forEach(input => {
      input.onmidimessage = MP._onMIDIMessage;
    });
    MP.showToast('MIDI connected: ' + inputs.map(i => i.name).join(', '));
    document.getElementById('btn-midi').classList.add('active');

    access.onstatechange = (e) => {
      if (e.port.type === 'input') {
        if (e.port.state === 'connected') {
          e.port.onmidimessage = MP._onMIDIMessage;
          MP.showToast('MIDI connected: ' + e.port.name);
        } else {
          MP.showToast('MIDI disconnected: ' + e.port.name);
        }
        var active = [...access.inputs.values()].some(i => i.state === 'connected');
        document.getElementById('btn-midi').classList.toggle('active', active);
      }
    };
  }).catch(err => {
    MP.showToast('MIDI access denied', true);
  });
};

MP._midiNoteMap = {};

MP._onMIDIMessage = function(msg) {
  var cmd = msg.data[0] & 0xf0;
  var midiNote = msg.data[1];
  var velocity = msg.data.length > 2 ? msg.data[2] : 0;

  if (cmd === 0x90 && velocity > 0) {
    if (MP._midiNoteMap[midiNote]) return;
    var noteName = MP.nameFromMidi(midiNote);
    var note = MP.NOTES.find(n => n.name === noteName);
    if (!note) return;
    var el = MP.noteElMap[noteName];
    if (!el) return;
    var ctx = MP.getAudioCtx();
    var og = MP.createOscGain(ctx);
    var osc = og.osc, gain = og.gain;
    osc.type = MP.AUDIO_OSC_TYPE;
    osc.frequency.value = note.freq;
    gain.gain.setValueAtTime(MP.AUDIO_GAIN, ctx.currentTime);
    osc.start(ctx.currentTime);
    el.classList.add('pressed');
    var noteOctave = parseInt(noteName.match(/\d+$/)[0]);
    if (noteOctave !== MP.appState.kbOctave && noteOctave !== MP.appState.kbOctave + 1) {
      MP.appState.kbOctave = Math.max(0, Math.min(8, noteOctave));
      MP.updateKeyBindingLabels();
    }
    var wrap = document.getElementById('keyboard-wrap');
    var keyLeft = parseInt(el.style.left) || 0;
    var visLeft = wrap.scrollLeft;
    var visRight = visLeft + wrap.clientWidth;
    if (keyLeft < visLeft + 20 || keyLeft > visRight - 60) {
      wrap.scrollTo({ left: Math.max(0, keyLeft - wrap.clientWidth / 2), behavior: 'smooth' });
    }
    MP._midiNoteMap[midiNote] = { note: note, el: el, osc: osc, gain: gain, pressStart: performance.now() };
  } else if (cmd === 0x80 || (cmd === 0x90 && velocity === 0)) {
    var entry = MP._midiNoteMap[midiNote];
    if (!entry) return;
    delete MP._midiNoteMap[midiNote];
    entry.el.classList.remove('pressed');
    var ctx = MP.getAudioCtx();
    entry.gain.gain.exponentialRampToValueAtTime(MP.AUDIO_RELEASE_MIN, ctx.currentTime + MP.AUDIO_RELEASE);
    entry.osc.stop(ctx.currentTime + MP.AUDIO_RELEASE);
    MP.addNoteFromInput(entry.note, entry.pressStart);
  }
};

MP.importMidiFile = function(file) {
  if (file.size > MP.IMPORT_MAX_FILE_SIZE) {
    MP.showToast('MIDI file too large (max ' + Math.round(MP.IMPORT_MAX_FILE_SIZE / 1024 / 1024) + 'MB)', true);
    return;
  }
  file.arrayBuffer().then(function(buf) {
    var d = new DataView(buf);
    var pos = 0;
    function readU16() { var v = d.getUint16(pos); pos += 2; return v; }
    function readU32() { var v = d.getUint32(pos); pos += 4; return v; }
    function readVLQ() {
      var val = 0;
      for (var i = 0; i < 4; i++) {
        if (pos >= d.byteLength) return val;
        var b = d.getUint8(pos++);
        val = (val << 7) | (b & 0x7f);
        if (!(b & 0x80)) break;
      }
      return val;
    }

    if (readU32() !== 0x4d546864) { MP.showToast('Invalid MIDI file', true); return; }
    readU32();
    var format = readU16();
    var numTracks = readU16();
    var timeDivision = readU16();
    if (timeDivision & 0x8000) { MP.showToast('SMPTE time division not supported', true); return; }
    var ticksPerBeat = timeDivision;
    if (ticksPerBeat <= 0) { MP.showToast('Invalid MIDI time division', true); return; }

    var events = [];
    for (var t = 0; t < Math.min(numTracks, MP.MIDI_MAX_TRACKS); t++) {
      if (readU32() !== 0x4d54726b) { MP.showToast('Invalid track chunk', true); return; }
      var trackLen = readU32();
      var trackEnd = Math.min(pos + trackLen, d.byteLength);
      var absTick = 0;
      var runningStatus = 0;
      while (pos < trackEnd) {
        absTick += readVLQ();
        var status = d.getUint8(pos);
        if (status < 0x80) { status = runningStatus; } else { pos++; runningStatus = status; }
        var cmd = status & 0xf0;
        if (cmd === 0x90 || cmd === 0x80) {
          var note = d.getUint8(pos++);
          var vel = d.getUint8(pos++);
          if (events.length < MP.MIDI_MAX_EVENTS) events.push({ tick: absTick, cmd: cmd, note: note, vel: vel });
        } else if (cmd === 0xa0 || cmd === 0xb0 || cmd === 0xe0) {
          pos += 2;
        } else if (cmd === 0xc0 || cmd === 0xd0) {
          pos += 1;
        } else if (status === 0xff) {
          var type = d.getUint8(pos++);
          var len = readVLQ();
          if (type === 0x2f) { pos = trackEnd; break; }
          pos += len;
        } else if (status === 0xf0 || status === 0xf7) {
          var len = readVLQ();
          pos += len;
        } else {
          pos++;
        }
      }
      pos = trackEnd;
    }

    events.sort(function(a, b) { return a.tick - b.tick || a.cmd - b.cmd; });

    var active = {};
    var seq = [];
    for (var i = 0; i < events.length; i++) {
      var ev = events[i];
      var isOn = ev.cmd === 0x90 && ev.vel > 0;
      var isOff = ev.cmd === 0x80 || (ev.cmd === 0x90 && ev.vel === 0);
      if (isOn) {
        active[ev.note] = ev.tick;
      } else if (isOff && active[ev.note] !== undefined) {
        var startTick = active[ev.note];
        delete active[ev.note];
        var startBeat = startTick / ticksPerBeat;
        var durBeat = (ev.tick - startTick) / ticksPerBeat;
        if (durBeat < 0.05) continue;
        var midi = ev.note;
        if (midi < MP.MIDI_MIN || midi > MP.MIDI_MAX) continue;
        seq.push({ name: MP.nameFromMidi(midi), freq: MP.freqFromMidi(midi), start: startBeat, dur: durBeat });
      }
    }

    if (seq.length === 0) { MP.showToast('No notes found in MIDI file', true); return; }
    seq.sort(function(a, b) { return a.start - b.start; });

    var minStart = seq[0].start;
    if (minStart > 0) {
      for (var i = 0; i < seq.length; i++) seq[i].start -= minStart;
    }

    var fileName = MP.sanitizeFilename(file.name.replace(/\.midi?$/i, ''));
    MP.pushUndo();
    MP.clearSelection();
    MP.appState.seq = seq;
    MP.resetNextNoteStart();
    MP.appState.melodyName = fileName;
    MP.stopPlayback();
    MP.updateSequence();
    MP.showToast('Loaded "' + fileName + '" (' + seq.length + ' notes from MIDI)');
  }).catch(function() {
    MP.showToast('Failed to read MIDI file', true);
  });
};
