MP.dancingCat = (function() {
  var D = 'D', M = 'M', L = 'L', C = 'C', P = 'P', E = 'E', N = 'N', H = 'H', W = 'W', S = 'S', _ = null;

  var themes = {
    light: { D: '#3a1f6e', M: '#8b50c0', L: '#b07ee0', C: '#c9a0f0', P: '#f0b0a0', E: '#1a1030', N: '#e8a878', H: '#c090e0', W: '#e8d0ff', S: '#2d1854' },
    dark:  { D: '#3a1f6e', M: '#8b50c0', L: '#b07ee0', C: '#c9a0f0', P: '#f0b0a0', E: '#1a1030', N: '#e8a878', H: '#c090e0', W: '#e8d0ff', S: '#2d1854' },
  };

  function patchFrame(base, patches) {
    var frame = [];
    for (var i = 0; i < base.length; i++) frame.push(patches[i] || base[i]);
    return frame;
  }

  function shiftRows(frame, startRow, endRow, dx) {
    var out = [];
    for (var i = 0; i < frame.length; i++) {
      if (i >= startRow && i <= endRow) {
        var row = frame[i].slice();
        if (dx > 0) { for (var j = 0; j < dx; j++) { row.pop(); row.unshift(null); } }
        else { for (var j = 0; j < -dx; j++) { row.shift(); row.push(null); } }
        out.push(row);
      } else { out.push(frame[i]); }
    }
    return out;
  }

  var sit = [
    [_,_,_,_,_,_,_,_,D,D,_,_,_,_,_,_,_,_,_,D,D,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,D,M,M,D,_,_,_,_,_,_,_,D,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,_,_,D,M,M,M,D,_,_,_,_,_,_,D,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,_,D,M,M,P,M,D,_,_,_,_,_,_,D,M,P,M,M,D,_,_,_,_,_],
    [_,_,_,_,D,M,M,P,P,M,M,D,_,_,_,_,D,M,M,P,P,M,M,D,_,_,_,_],
    [_,_,_,_,D,M,M,P,M,M,M,D,D,D,D,D,D,M,M,M,P,M,M,D,_,_,_,_],
    [_,_,_,D,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,D,_,_,_],
    [_,_,_,D,M,M,M,M,M,L,L,L,L,L,L,L,L,M,M,M,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,M,M,L,L,L,L,H,H,H,H,L,L,L,L,M,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,M,L,L,H,H,H,W,H,H,W,H,H,H,L,L,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,L,L,H,H,H,H,H,H,H,H,H,H,H,H,L,L,M,M,D,_,_,_,_],
    [_,_,D,M,M,E,E,E,M,M,M,M,M,M,M,M,M,M,E,E,E,M,M,D,_,_,_,_],
    [_,_,D,M,E,E,S,E,M,M,M,M,M,M,M,M,M,M,E,S,E,E,M,D,_,_,_,_],
    [_,_,D,M,M,E,E,E,M,M,M,M,M,M,M,M,M,M,E,E,E,M,M,D,_,_,_,_],
    [_,_,_,D,M,M,M,M,M,M,M,N,N,N,N,M,M,M,M,M,M,M,D,_,_,_,_,_],
    [_,_,_,D,M,M,M,M,M,M,M,M,N,N,M,M,M,M,M,M,M,M,D,_,_,_,_,_],
    [_,_,_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,D,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,D,_,_,_,_,_,_],
    [_,_,_,_,_,D,D,D,M,M,M,M,M,M,M,M,M,M,D,D,D,_,_,_,_,_,_,_],
    [_,_,_,_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_,_,_,_],
    [_,_,_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_],
    [_,_,_,D,M,M,M,C,C,C,C,C,C,C,C,C,C,C,C,M,M,M,D,_,_,_,_,_],
    [_,_,_,D,M,M,M,C,C,C,C,C,C,C,C,C,C,C,C,M,M,M,D,_,D,D,_,_],
    [_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,C,C,M,M,M,M,D,D,M,D,_,_],
    [_,_,_,D,M,M,M,M,M,C,C,C,C,C,C,C,C,M,M,M,M,D,D,_,_,_,_,_],
    [_,_,_,D,M,M,D,D,D,M,M,M,M,M,M,M,M,D,D,D,M,M,D,_,_,_,_,_],
    [_,_,_,_,D,D,D,_,_,D,D,M,M,M,M,D,D,_,_,D,D,D,_,_,_,_,_,_],
    [_,_,_,_,_,D,_,_,_,_,D,D,D,D,D,D,_,_,_,_,D,_,_,_,_,_,_,_],
  ];

  var squint = patchFrame(sit, {
    11: [_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_],
    12: [_,_,D,M,M,E,E,E,M,M,M,M,M,M,M,M,M,M,E,E,E,M,M,D,_,_,_,_],
    13: [_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_],
  });

  var wideEye = patchFrame(sit, {
    11: [_,_,D,M,E,E,E,E,M,M,M,M,M,M,M,M,M,M,E,E,E,E,M,D,_,_,_,_],
    12: [_,_,D,M,E,W,W,E,M,M,M,M,M,M,M,M,M,M,E,W,W,E,M,D,_,_,_,_],
    13: [_,_,D,M,E,E,E,E,M,M,M,M,M,M,M,M,M,M,E,E,E,E,M,D,_,_,_,_],
    15: [_,_,_,D,M,M,M,M,M,M,M,N,P,P,N,M,M,M,M,M,M,M,D,_,_,_,_,_],
  });

  var blink = patchFrame(sit, {
    11: [_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_],
    12: [_,_,D,M,M,D,D,D,M,M,M,M,M,M,M,M,M,M,D,D,D,M,M,D,_,_,_,_],
    13: [_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_],
  });

  var lick = patchFrame(sit, {
    16: [_,_,_,_,D,M,M,M,M,M,M,M,M,P,P,M,M,M,M,M,M,D,_,_,_,_,_,_],
  });

  var tailUp = patchFrame(sit, {
    21: [_,_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,D,_,_],
    22: [_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,C,C,M,M,M,M,D,_,D,M,D,_],
    23: [_,_,_,D,M,M,M,C,C,C,C,C,C,C,C,C,C,C,C,M,M,M,D,D,M,D,_,_],
    24: [_,_,_,D,M,M,M,C,C,C,C,C,C,C,C,C,C,C,C,M,M,M,D,D,_,_,_,_],
    25: [_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_],
  });

  var dance1 = squint;

  var dance2base = [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,D,D,_,_,_,_,_,_,_,_,_,D,D,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,D,M,M,D,_,_,_,_,_,_,_,D,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,_,_,D,M,M,M,D,_,_,_,_,_,_,D,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,_,D,M,M,P,M,D,_,_,_,_,_,_,D,M,P,M,M,D,_,_,_,_,_],
    [_,_,_,_,D,M,M,P,P,M,M,D,_,_,_,_,D,M,M,P,P,M,M,D,_,_,_,_],
    [_,_,_,_,D,M,M,P,M,M,M,D,D,D,D,D,D,M,M,M,P,M,M,D,_,_,_,_],
    [_,_,_,D,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,D,_,_,_],
    [_,_,_,D,M,M,M,M,M,L,L,L,L,L,L,L,L,M,M,M,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,M,M,L,L,L,L,H,H,H,H,L,L,L,L,M,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,M,L,L,H,H,H,W,H,H,W,H,H,H,L,L,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_],
    [_,_,D,M,M,E,E,E,M,M,M,M,M,M,M,M,M,M,E,E,E,M,M,D,_,_,_,_],
    [_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_],
    [_,_,_,D,M,M,M,M,M,M,M,N,N,N,N,M,M,M,M,M,M,M,D,_,_,_,_,_],
    [_,_,_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,D,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,D,_,_,_,_,_,_],
    [_,_,_,_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_,_,_,_],
    [D,D,_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,D,D,_,_],
    [_,D,D,_,D,M,M,M,M,C,C,C,C,C,C,C,C,M,M,M,M,D,_,D,D,_,_,_],
    [_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_],
    [_,_,_,D,M,M,M,C,C,C,C,C,C,C,C,C,C,C,C,M,M,M,D,_,_,_,_,_],
    [_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,C,C,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,M,M,M,D,_,_,_,_,_,_,_],
    [_,_,_,_,D,M,M,D,D,M,M,M,M,M,M,M,M,D,D,M,D,_,_,_,_,_,_,_],
    [_,_,_,_,_,D,D,_,_,D,D,_,_,_,_,D,D,_,_,D,D,_,_,_,_,_,_,_],
    [_,_,_,_,D,D,_,_,_,_,D,D,_,_,D,D,_,_,_,_,D,D,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
  var dance2 = shiftRows(dance2base, 1, 15, -1);

  var dance3base = [
    [_,_,_,_,_,_,_,_,D,D,_,_,_,_,_,_,_,_,_,D,D,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,D,M,M,D,_,_,_,_,_,_,_,D,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,_,_,D,M,M,M,D,_,_,_,_,_,_,D,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,_,D,M,M,P,M,D,_,_,_,_,_,_,D,M,P,M,M,D,_,_,_,_,_],
    [_,_,_,_,D,M,M,P,P,M,M,D,_,_,_,_,D,M,M,P,P,M,M,D,_,_,_,_],
    [_,_,_,_,D,M,M,P,M,M,M,D,D,D,D,D,D,M,M,M,P,M,M,D,_,_,_,_],
    [_,_,_,D,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,D,_,_,_],
    [_,_,_,D,M,M,M,M,M,L,L,L,L,L,L,L,L,M,M,M,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,M,M,L,L,L,L,H,H,H,H,L,L,L,L,M,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,M,L,L,H,H,H,W,H,H,W,H,H,H,L,L,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,L,L,H,H,H,H,H,H,H,H,H,H,H,H,L,L,M,M,D,_,_,_,_],
    [_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_],
    [_,_,D,M,M,E,E,E,M,M,M,M,M,M,M,M,M,M,E,E,E,M,M,D,_,_,_,_],
    [_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_],
    [_,_,_,D,M,M,M,M,M,M,M,N,N,N,N,M,M,M,M,M,M,M,D,_,_,_,_,_],
    [_,_,_,D,M,M,M,M,M,M,M,M,N,N,M,M,M,M,M,M,M,M,D,_,_,_,_,_],
    [_,_,_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,D,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,D,_,_,_,_,_,_],
    [_,_,_,_,_,D,D,D,M,M,M,M,M,M,M,M,M,M,D,D,D,_,_,_,_,_,_,_],
    [_,_,_,_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_,_,_,_],
    [_,_,_,_,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_],
    [_,_,_,D,M,M,M,C,C,C,C,C,C,C,C,C,C,C,C,M,M,M,D,_,_,_,_,_],
    [_,_,_,D,M,M,M,C,C,C,C,C,C,C,C,C,C,C,C,M,M,M,D,_,_,_,_,_],
    [_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_],
    [_,_,_,D,M,M,M,M,M,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,D,M,D,D,M,M,M,M,M,M,M,M,M,M,M,D,D,M,D,_,_,_,_,_,_],
    [_,_,_,_,D,_,_,D,D,_,_,D,D,D,D,_,_,D,D,_,D,_,D,D,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,D,D,_,_,_,_,_],
  ];
  var dance3 = shiftRows(dance3base, 0, 15, 1);

  var jump1 = [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,D,D,_,_,_,_,_,_,_,_,_,D,D,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,D,M,M,D,_,_,_,_,_,_,_,D,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,_,_,D,M,M,M,D,_,_,_,_,_,_,D,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,_,D,M,M,P,M,D,_,_,_,_,_,_,D,M,P,M,M,D,_,_,_,_,_],
    [_,_,_,_,D,M,M,P,P,M,M,D,_,_,_,_,D,M,M,P,P,M,M,D,_,_,_,_],
    [_,_,_,_,D,M,M,P,M,M,M,D,D,D,D,D,D,M,M,M,P,M,M,D,_,_,_,_],
    [_,_,_,D,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,D,_,_,_],
    [_,_,_,D,M,M,M,M,M,L,L,L,L,L,L,L,L,M,M,M,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,M,M,L,L,L,L,H,H,H,H,L,L,L,L,M,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,M,L,L,H,H,H,W,H,H,W,H,H,H,L,L,M,M,M,M,D,_,_,_],
    [D,D,D,M,E,E,E,E,M,M,M,M,M,M,M,M,M,M,E,E,E,E,M,D,D,D,_,_],
    [_,_,D,M,E,W,W,E,M,M,M,M,M,M,M,M,M,M,E,W,W,E,M,D,_,_,_,_],
    [_,_,_,D,E,E,E,E,M,M,M,N,N,N,N,M,M,M,E,E,E,E,M,D,_,_,_,_],
    [_,_,_,_,D,M,M,M,M,M,M,N,P,P,N,M,M,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_],
    [_,_,_,D,M,M,M,M,M,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,D,M,M,D,D,M,M,M,M,M,M,M,M,D,D,M,D,_,_,_,_,_,_,_],
    [_,_,_,_,_,D,D,_,_,D,D,_,_,_,_,D,D,_,_,D,D,_,_,_,_,_,_,_],
    [_,_,_,_,D,D,_,_,_,_,D,D,_,_,D,D,_,_,_,_,D,D,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];

  var jump2 = [
    [_,_,_,_,_,_,_,_,D,D,_,_,_,_,_,_,_,_,_,D,D,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,D,M,M,D,_,_,_,_,_,_,_,D,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,_,_,D,M,M,M,D,_,_,_,_,_,_,D,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,_,D,M,M,P,M,D,_,_,_,_,_,_,D,M,P,M,M,D,_,_,_,_,_],
    [_,_,_,_,D,M,M,P,P,M,M,D,_,_,_,_,D,M,M,P,P,M,M,D,_,_,_,_],
    [_,_,_,_,D,M,M,P,M,M,M,D,D,D,D,D,D,M,M,M,P,M,M,D,_,_,_,_],
    [D,D,_,D,D,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,M,D,D,_,D,D],
    [_,_,_,D,M,M,M,M,M,L,L,L,L,L,L,L,L,M,M,M,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,M,M,L,L,L,L,H,H,H,H,L,L,L,L,M,M,M,M,M,D,_,_,_],
    [_,_,D,M,M,M,L,L,H,H,H,W,H,H,W,H,H,H,L,L,M,M,M,M,D,_,_,_],
    [_,_,D,M,E,E,E,E,M,M,M,M,M,M,M,M,M,M,E,E,E,E,M,D,_,_,_,_],
    [_,_,_,D,E,W,W,E,M,M,M,N,N,N,N,M,M,M,E,W,W,E,D,_,_,_,_,_],
    [_,_,_,_,D,M,M,M,M,M,M,N,P,P,N,M,M,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,D,M,M,M,M,C,C,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_],
    [_,_,_,D,M,M,M,M,M,C,C,C,C,C,C,C,C,M,M,M,M,D,_,_,_,_,_,_],
    [_,_,_,_,D,M,M,D,D,M,M,M,M,M,M,M,M,D,D,M,D,_,_,_,_,_,_,_],
    [_,_,_,_,_,D,D,_,_,D,D,_,_,_,_,D,D,_,_,D,D,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];

  var headLeft = shiftRows(sit, 0, 15, -1);
  var headRight = shiftRows(sit, 0, 15, 1);

  var danceFrames = [dance1, dance2, dance3];
  var jumpFrames = [jump1, jump2, jump2, wideEye, sit];

  var COLS = 28, ROWS = 30;
  var canvas, ctx, raf, lastDraw = 0;
  var PX = 1;
  var FPS_DANCE = 3, FPS_IDLE = 1;

  var mode = 'idle';
  var seqFrames = null, seqIdx = 0, seqFps = 1;
  var nextIdleAction = 0;
  var seqOnDone = null;

  function getColors() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? themes.dark : themes.light;
  }

  function draw(frame) {
    var c = getColors();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var y = 0; y < frame.length; y++) {
      for (var x = 0; x < frame[y].length; x++) {
        if (frame[y][x]) {
          ctx.fillStyle = c[frame[y][x]];
          ctx.fillRect(x * PX, y * PX, PX, PX);
        }
      }
    }
  }

  function scheduleIdleAction() {
    nextIdleAction = performance.now() + 2000 + Math.random() * 4000;
  }

  function playSequence(frames, fps, onDone) {
    mode = 'seq';
    seqFrames = frames;
    seqIdx = 0;
    seqFps = fps;
    seqOnDone = onDone || function() {
      mode = MP.appState.playState ? 'dance' : 'idle';
      if (mode === 'idle') scheduleIdleAction();
    };
  }

  function animate(ts) {
    var fps;
    if (mode === 'dance') fps = FPS_DANCE;
    else if (mode === 'seq') fps = seqFps;
    else fps = FPS_IDLE;

    if (ts - lastDraw > 1000 / fps) {
      lastDraw = ts;

      if (mode === 'dance') {
        seqIdx = (seqIdx + 1) % danceFrames.length;
        draw(danceFrames[seqIdx]);
      } else if (mode === 'seq') {
        if (seqIdx < seqFrames.length) {
          draw(seqFrames[seqIdx]);
          seqIdx++;
        } else {
          if (seqOnDone) { var cb = seqOnDone; seqOnDone = null; cb(); }
        }
      } else {
        if (ts > nextIdleAction) {
          var actions = [
            [blink, sit],
            [blink, blink, sit],
            [squint, squint, sit],
            [lick, lick, sit],
            [tailUp, sit, tailUp, sit],
            [squint, squint, squint, sit],
          ];
          var pick = actions[Math.floor(Math.random() * actions.length)];
          playSequence(pick, 2, null);
          return (raf = requestAnimationFrame(animate));
        }
        draw(sit);
      }
    }

    if (MP.appState.playState && mode === 'idle') {
      mode = 'dance'; seqIdx = 0;
    } else if (!MP.appState.playState && mode === 'dance') {
      mode = 'idle'; scheduleIdleAction(); draw(sit);
    }

    raf = requestAnimationFrame(animate);
  }

  function chirp() {
    var ctx2 = MP.getAudioCtx();
    var og = MP.createOscGain(ctx2);
    og.osc.type = 'sine';
    og.osc.frequency.setValueAtTime(900, ctx2.currentTime);
    og.osc.frequency.exponentialRampToValueAtTime(1800, ctx2.currentTime + 0.06);
    og.osc.frequency.exponentialRampToValueAtTime(600, ctx2.currentTime + 0.12);
    og.gain.gain.setValueAtTime(0.12, ctx2.currentTime);
    og.gain.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + 0.15);
    og.osc.start(ctx2.currentTime);
    og.osc.stop(ctx2.currentTime + 0.15);
  }

  var pokeActions = [
    function() { chirp(); playSequence(jumpFrames, 5, null); },
    function() { playSequence([blink, blink, sit], 2, null); },
    function() { playSequence([headLeft, headLeft, sit], 2, null); },
    function() { playSequence([headRight, headRight, sit], 2, null); },
    function() { chirp(); },
  ];

  function poke() {
    pokeActions[Math.floor(Math.random() * pokeActions.length)]();
  }

  function start() { mode = 'dance'; seqIdx = 0; }
  function stop() { mode = 'idle'; scheduleIdleAction(); draw(sit); }

  function init() {
    canvas = document.getElementById('dance-cat');
    if (!canvas) return;
    canvas.width = COLS * PX;
    canvas.height = ROWS * PX;
    canvas.style.display = '';
    canvas.style.cursor = 'pointer';
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    draw(sit);
    scheduleIdleAction();
    raf = requestAnimationFrame(animate);
    canvas.addEventListener('click', poke);
  }

  return { init: init, start: start, stop: stop };
})();
