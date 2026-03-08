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
