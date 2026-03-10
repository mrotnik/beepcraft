window.MP = window.MP || {};
MP.VERSION = 'v0.0.6';

MP.appState = {
  seq: [],
  nextNoteStart: 0,
  selectedDur: 4,
  loopEnabled: true,
  currentView: 'roll',
  melodyName: null,

  pressStart: 0,
  pressedNote: null,
  pressedEl: null,
  currentOsc: null,
  currentGain: null,

  isRecording: false,
  lastNoteEndTime: 0,

  kbOctave: 4,
  kbPressedKey: null,
  kbPressedNote: null,
  kbPressedEl: null,

  metronomeOn: false,
  metronomeTimer: null,
  metronomeBeat: 0,
  _lastMetroIndicatorBeat: -1,

  playState: null,
  playTimeout: null,
  playheadRAF: null,

  undoStack: [],
  redoStack: [],
  selectedNoteIdxs: new Set(),
  clipboard: [],
  lastNoteDur: null,
  micStream: null,
  micChunks: [],
  micRecording: false,
  chipHighlightRAF: null,
  prZoom: 1.0,
  snapEnabled: true,
  timeSig: { beats: 4, value: 4 },
};

MP.MAX_UNDO = 50;
