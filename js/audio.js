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
  preview.gain.gain.exponentialRampToValueAtTime(MP.AUDIO_RELEASE_MIN, preview.ctx.currentTime + MP.AUDIO_RELEASE);
  preview.osc.stop(preview.ctx.currentTime + MP.AUDIO_RELEASE);
};

MP.startNoteInput = function(freq) {
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
  if (!MP.appState.currentGain || !MP.appState.currentOsc) return;
  var ctx = MP.getAudioCtx();
  MP.appState.currentGain.gain.exponentialRampToValueAtTime(MP.AUDIO_RELEASE_MIN, ctx.currentTime + MP.AUDIO_RELEASE);
  MP.appState.currentOsc.stop(ctx.currentTime + MP.AUDIO_RELEASE);
  MP.appState.currentOsc = null;
  MP.appState.currentGain = null;
};
