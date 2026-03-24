MP._audioCtx = null;

MP.getAudioCtx = function() {
  if (!MP._audioCtx) MP._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (MP._audioCtx.state === 'suspended') MP._audioCtx.resume();
  return MP._audioCtx;
};

MP.closeAudioCtx = function() {
  if (MP._audioCtx) { MP._audioCtx.close(); MP._audioCtx = null; }
};

MP.createOscGain = function(ctx) {
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  return { osc: osc, gain: gain };
};

MP.playNotePreview = function(freq) {
  if (MP.appState.playState) return null;
  if (MP._serialWriter) {
    MP.sendSerialNote(freq, 300);
    return { serial: true };
  }
  const ctx = MP.getAudioCtx();
  const og = MP.createOscGain(ctx);
  const osc = og.osc, gain = og.gain;
  osc.type = MP.AUDIO_OSC_TYPE;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(MP.AUDIO_GAIN, ctx.currentTime);
  osc.start(ctx.currentTime);
  return { osc, gain, ctx };
};

MP.stopNotePreview = function(preview) {
  if (!preview) return;
  if (preview.serial) { MP.sendSerialNote(0, 0); return; }
  preview.gain.gain.exponentialRampToValueAtTime(MP.AUDIO_RELEASE_MIN, preview.ctx.currentTime + MP.AUDIO_RELEASE);
  preview.osc.stop(preview.ctx.currentTime + MP.AUDIO_RELEASE);
};

MP.startNoteInput = function(freq) {
  if (MP._serialWriter) {
    MP.sendSerialNote(freq, 300);
    return;
  }
  var ctx = MP.getAudioCtx();
  var og = MP.createOscGain(ctx);
  MP.appState.currentOsc = og.osc;
  MP.appState.currentGain = og.gain;
  MP.appState.currentOsc.type = MP.AUDIO_OSC_TYPE;
  MP.appState.currentOsc.frequency.value = freq;
  MP.appState.currentGain.gain.setValueAtTime(MP.AUDIO_GAIN, ctx.currentTime);
  MP.appState.currentOsc.start(ctx.currentTime);
};

MP.stopNoteInput = function() {
  if (MP._serialWriter) { MP.sendSerialNote(0, 0); return; }
  if (!MP.appState.currentGain || !MP.appState.currentOsc) return;
  var ctx = MP.getAudioCtx();
  MP.appState.currentGain.gain.exponentialRampToValueAtTime(MP.AUDIO_RELEASE_MIN, ctx.currentTime + MP.AUDIO_RELEASE);
  MP.appState.currentOsc.stop(ctx.currentTime + MP.AUDIO_RELEASE);
  MP.appState.currentOsc = null;
  MP.appState.currentGain = null;
};

MP.exportMelodyWav = function() {
  var seq = MP.appState.seq;
  if (seq.length === 0) { MP.showToast('No notes to export', true); return; }
  var bpm = MP.getBpm();
  var beatSec = 60 / bpm;
  var totalBeats = MP.totalBeats();
  var duration = totalBeats * beatSec + 0.1;
  var sampleRate = 44100;
  var numSamples = Math.ceil(sampleRate * duration);
  var offCtx = new OfflineAudioContext(1, numSamples, sampleRate);

  seq.forEach(function(n) {
    if (n.freq <= 0) return;
    var osc = offCtx.createOscillator();
    var gain = offCtx.createGain();
    osc.connect(gain);
    gain.connect(offCtx.destination);
    osc.type = 'square';
    osc.frequency.value = n.freq;
    var startTime = n.start * beatSec;
    var noteDur = n.dur * beatSec * 0.9;
    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.setValueAtTime(0, startTime + noteDur);
    osc.start(startTime);
    osc.stop(startTime + noteDur + 0.01);
  });

  offCtx.startRendering().then(function(buffer) {
    var samples = buffer.getChannelData(0);
    var wav = MP._encodeWav(samples, sampleRate);
    var blob = new Blob([wav], { type: 'audio/wav' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (MP.appState.melodyName || 'melody') + '.wav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    MP.showToast('Exported WAV (' + seq.length + ' notes)');
  });
};
