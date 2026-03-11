MP.generateRTTTL = function(flat, bpm) {
  flat = flat.map(n => n.dur > 32 ? Object.assign({}, n, { dur: 32 }) : n);
  const durCounts = {};
  flat.forEach(n => { if (!n.dotted) durCounts[n.dur] = (durCounts[n.dur] || 0) + 1; });
  let defDur = 4, maxCount = 0;
  Object.entries(durCounts).forEach(([d, c]) => { if (c > maxCount) { maxCount = c; defDur = Math.min(32, parseInt(d)); } });

  const octCounts = {};
  flat.forEach(n => {
    if (n.freq === 0) return;
    const m = n.name.match(/(\d)$/);
    if (m) { const o = parseInt(m[1]); octCounts[o] = (octCounts[o] || 0) + 1; }
  });
  let defOct = 5;
  maxCount = 0;
  Object.entries(octCounts).forEach(([o, c]) => { if (c > maxCount) { maxCount = c; defOct = parseInt(o); } });

  const tokens = flat.map(n => {
    let tok = '';
    if (n.dur !== defDur || n.dotted) tok += n.dur;
    if (n.freq === 0) {
      tok += 'p';
    } else {
      const m = n.name.match(/^([A-G])(#?)(\d)$/);
      if (!m) return '';
      tok += m[1].toLowerCase();
      if (m[2]) tok += '#';
      if (n.dotted) tok += '.';
      const oct = parseInt(m[3]);
      if (oct !== defOct) tok += oct;
    }
    if (n.freq === 0 && n.dotted) tok += '.';
    return tok;
  });

  var melName = (MP.appState.melodyName || 'Melody').replace(/:/g, '_');
  return melName + ':d=' + defDur + ',o=' + defOct + ',b=' + bpm + ':' + tokens.join(',');
};

MP.parseRTTTL = function(rtttl) {
  if (rtttl.length > 100000) return null;
  const match = rtttl.match(/^([^:]+):([^:]+):(.+)$/);
  if (!match) return null;

  const name = match[1].trim();
  const params = match[2].trim();
  const noteStr = match[3].trim();

  let defDur = 4, defOct = 5, bpm = 120;
  params.split(',').forEach(p => {
    const [k, v] = p.trim().split('=');
    if (k === 'd') defDur = parseInt(v);
    else if (k === 'o') defOct = parseInt(v);
    else if (k === 'b') bpm = parseInt(v);
  });
  defDur = Math.max(1, Math.min(128, defDur || 4));
  defOct = Math.max(0, Math.min(8, defOct || 5));
  bpm = Math.max(10, Math.min(900, bpm || 120));

  const noteNames = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  const notes = [];

  noteStr.split(',').forEach(token => {
    if (notes.length >= 5000) return;
    token = token.trim();
    if (!token) return;

    let pos = 0, dur = 0;
    while (pos < token.length && token[pos] >= '0' && token[pos] <= '9') {
      dur = dur * 10 + parseInt(token[pos]); pos++;
    }
    if (dur === 0) dur = defDur;
    if (pos >= token.length) return;
    const noteCh = token[pos].toLowerCase(); pos++;

    if (noteCh === 'p') {
      let dotted = false;
      while (pos < token.length) { if (token[pos] === '.') { dotted = true; } pos++; }
      notes.push({ name: 'REST', freq: 0, dur, dotted });
      return;
    }

    if (!(noteCh in noteNames)) return;
    let semitone = noteNames[noteCh];
    if (pos < token.length && token[pos] === '#') { semitone++; pos++; }
    let dotted = false;
    if (pos < token.length && token[pos] === '.') { dotted = true; pos++; }
    let oct = defOct;
    if (pos < token.length && token[pos] >= '0' && token[pos] <= '9') { oct = parseInt(token[pos]); pos++; }
    if (pos < token.length && token[pos] === '.') { dotted = true; pos++; }

    const noteName = MP.NOTE_NAMES[semitone] + oct;
    const midi = (oct + 1) * 12 + semitone;
    const freq = MP.freqFromMidi(midi);
    notes.push({ name: noteName, freq, dur, dotted });
  });

  return { name, bpm, notes };
};
