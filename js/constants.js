MP.A4_MIDI = 69;
MP.A4_FREQ = 440;
MP.MIDI_MIN = 12;
MP.MIDI_MAX = 108;
MP.BPM_MIN = 40;
MP.BPM_MAX = 300;
MP.TONE_DUTY = 0.9;
MP.ZOOM_STEP = 0.25;
MP.ZOOM_WHEEL_STEP = 0.125;
MP.ZOOM_MIN = 0.25;
MP.ZOOM_MAX = 5;
MP.DRAG_THRESHOLD = 4;

MP.NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

MP.NOTES = [];
for (let octave = 0; octave <= 9; octave++) {
  for (let i = 0; i < 12; i++) {
    const name = MP.NOTE_NAMES[i] + octave;
    const midi = (octave + 1) * 12 + i;
    const freq = Math.round(MP.A4_FREQ * Math.pow(2, (midi - MP.A4_MIDI) / 12));
    const type = MP.NOTE_NAMES[i].includes('#') ? 'black' : 'white';
    MP.NOTES.push({ name, freq, type });
  }
}

MP.DUR_NAMES = { 1: 'whole', 2: 'half', 4: 'quarter', 8: 'eighth', 16: '16th', 32: '32nd', 64: '64th', 128: '128th' };
MP.DUR_VALUES = Object.keys(MP.DUR_NAMES).map(Number);
MP.SNAP_BEATS = 0.125;
MP.FINE_SNAP_BEATS = 0.03125;
MP.MAGNETIC_THRESHOLD = 0.04;

MP.KEY_MAP = {
  'a': {semi: 0, oct: 0}, 's': {semi: 2, oct: 0}, 'd': {semi: 4, oct: 0},
  'f': {semi: 5, oct: 0}, 'g': {semi: 7, oct: 0}, 'h': {semi: 9, oct: 0},
  'j': {semi: 11, oct: 0}, 'k': {semi: 0, oct: 1}, 'l': {semi: 2, oct: 1},
  ';': {semi: 4, oct: 1}, "'": {semi: 5, oct: 1},
  'w': {semi: 1, oct: 0}, 'e': {semi: 3, oct: 0}, 't': {semi: 6, oct: 0},
  'y': {semi: 8, oct: 0}, 'u': {semi: 10, oct: 0}, 'i': {semi: 1, oct: 1},
  'o': {semi: 3, oct: 1}, '[': {semi: 6, oct: 1},
};

MP.W = 32;
MP.GAP = 1;
MP.BWIDTH = 20;
MP.PR_ROW_H = 20;
MP.PR_BEAT_W = 40;
MP.PR_LABEL_W = 50;
MP.PR_TIMELINE_H = 20;

MP.midiFromName = function(name) {
  if (name === 'REST') return -1;
  const m = name.match(/^([A-G]#?)(\d)$/);
  if (!m) return -1;
  return (parseInt(m[2]) + 1) * 12 + MP.NOTE_NAMES.indexOf(m[1]);
};

MP.nameFromMidi = function(midi) {
  const octave = Math.floor(midi / 12) - 1;
  return MP.NOTE_NAMES[midi % 12] + octave;
};

MP.freqFromMidi = function(midi) {
  return Math.round(MP.A4_FREQ * Math.pow(2, (midi - MP.A4_MIDI) / 12));
};

MP.getBpm = function() {
  return parseInt(document.getElementById('bpm').value) || 120;
};

MP.getTimeSigBeats = function() {
  return MP.appState.timeSig ? MP.appState.timeSig.beats : 4;
};

MP.LS_AUTOSAVE = 'beepcraft-autosave';
MP.LS_THEME = 'beepcraft-theme';
MP.LS_SERIAL_BAUD = 'beepcraft-serial-baud';
MP.LS_BUZZER_PIN = 'beepcraft-buzzer-pin';
MP.LS_INPUT_COLLAPSED = 'beepcraft-input-collapsed';

MP.AUDIO_OSC_TYPE = 'square';
MP.AUDIO_GAIN = 0.15;
MP.AUDIO_RELEASE = 0.05;
MP.AUDIO_RELEASE_MIN = 0.001;

MP.METRO_FREQ_DOWN = 1000;
MP.METRO_FREQ_UP = 800;
MP.METRO_GAIN_DOWN = 0.7;
MP.METRO_GAIN_UP = 0.4;
MP.METRO_FLASH_MS = 80;
MP.METRO_RELEASE = 0.05;

MP.escHtml = function(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };

MP.updateNoteFromMidi = function(note, midi) {
  note.name = MP.nameFromMidi(midi);
  note.freq = MP.freqFromMidi(midi);
};

MP.COPY_FEEDBACK_MS = 1500;
MP.TOAST_MS = 3000;
MP.MIDI_INFO_MS = 6000;
MP.SCHEDULE_INTERVAL = 500;
MP.SCHEDULE_LOOKAHEAD = 2;
MP.PLAYBACK_BUFFER_MS = 200;
MP.REST_GAP_THRESHOLD = 0.03;
MP.IMPORT_MAX_FILE_SIZE = 50 * 1024 * 1024;
MP.IMPORT_MAX_RTTTL_FILES = 500;
MP.IMPORT_MAX_RTTTL_FILE_SIZE = 100 * 1024;
MP.IMPORT_MAX_HASH_LEN = 200000;
MP.MIDI_MAX_TRACKS = 100;
MP.MIDI_MAX_EVENTS = 100000;
MP.MIC_MAX_DURATION_SEC = 300;

MP.IS_MAC = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
MP.MOD_KEY = MP.IS_MAC ? 'Cmd' : 'Ctrl';
MP.modKey = function(e) { return MP.IS_MAC ? e.metaKey : e.ctrlKey; };
