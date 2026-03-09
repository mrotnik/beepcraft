function startDrag(onMove, onUp) {
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', function handler(e) {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', handler);
    onUp(e);
  });
}

function calcPrRange(seq, containerH) {
  var minMidi, maxMidi;
  if (seq.length === 0) {
    minMidi = 48; maxMidi = 72;
  } else {
    var midiNotes = seq.map(function(n) { return MP.midiFromName(n.name); });
    minMidi = Math.min.apply(null, midiNotes) - 2;
    maxMidi = Math.max.apply(null, midiNotes) + 2;
    if (maxMidi - minMidi < 24) {
      var center = Math.round((minMidi + maxMidi) / 2);
      minMidi = center - 12; maxMidi = center + 12;
    }
    minMidi = Math.max(12, minMidi);
    maxMidi = Math.min(108, maxMidi);
  }
  var visibleH = containerH - MP.PR_TIMELINE_H;
  var minRows = Math.max(maxMidi - minMidi + 1, Math.ceil(visibleH / MP.PR_ROW_H));
  var currentRange = maxMidi - minMidi + 1;
  if (minRows > currentRange) {
    var extra = minRows - currentRange;
    var expandDown = Math.min(minMidi - 12, Math.ceil(extra / 2));
    var expandUp = Math.min(108 - maxMidi, extra - expandDown);
    minMidi -= expandDown + Math.max(0, extra - expandDown - expandUp);
    maxMidi += expandUp;
    minMidi = Math.max(12, minMidi);
    maxMidi = Math.min(108, maxMidi);
  }
  return { minMidi: minMidi, maxMidi: maxMidi, midiNotes: midiNotes || [] };
}

function buildPrTimeline(inner, totalBeats, beatW, tsBeats, gridH) {
  var totalW = totalBeats * beatW;
  var timeline = document.createElement('div');
  timeline.className = 'pr-timeline';
  timeline.style.width = (MP.PR_LABEL_W + totalW) + 'px';
  timeline.style.height = MP.PR_TIMELINE_H + 'px';
  var tlLabel = document.createElement('div');
  tlLabel.className = 'pr-timeline-label';
  tlLabel.style.position = 'sticky'; tlLabel.style.left = '0';
  tlLabel.textContent = 'Beat';
  timeline.appendChild(tlLabel);
  var tlInner = document.createElement('div');
  tlInner.className = 'pr-timeline-inner';
  tlInner.style.width = totalW + 'px';
  for (var beat = 0; beat <= totalBeats; beat++) {
    var tick = document.createElement('div');
    tick.className = 'pr-timeline-beat';
    if (beat % tsBeats === 0) tick.classList.add('measure');
    tick.style.left = (beat * beatW) + 'px';
    tick.style.width = beatW + 'px';
    tick.textContent = beat % tsBeats === 0 ? (Math.floor(beat / tsBeats) + 1) : '';
    tlInner.appendChild(tick);
  }
  timeline.appendChild(tlInner);

  var hoverLine = document.createElement('div');
  hoverLine.className = 'pr-hover-line';
  hoverLine.style.height = (gridH + MP.PR_TIMELINE_H) + 'px';
  hoverLine.style.display = 'none';
  inner.appendChild(hoverLine);

  tlInner.addEventListener('mousemove', function(e) {
    var innerRect = inner.getBoundingClientRect();
    var x = e.clientX - innerRect.left;
    hoverLine.style.left = x + 'px';
    hoverLine.style.display = 'block';
  });
  tlInner.addEventListener('mouseleave', function() {
    hoverLine.style.display = 'none';
  });
  tlInner.addEventListener('mousedown', function(e) {
    e.preventDefault(); e.stopPropagation();
    hoverLine.style.display = 'none';
    var innerRect = inner.getBoundingClientRect();
    var x = e.clientX - innerRect.left - MP.PR_LABEL_W;
    MP.playSequence(Math.max(0, x / beatW));
  });
  inner.appendChild(timeline);
}

function buildPrLabels(inner, minMidi, maxMidi, gridH, totalW) {
  var labelsWrap = document.createElement('div');
  labelsWrap.className = 'pr-labels-sticky';
  labelsWrap.style.position = 'sticky'; labelsWrap.style.left = '0';
  labelsWrap.style.width = MP.PR_LABEL_W + 'px'; labelsWrap.style.height = gridH + 'px';
  labelsWrap.style.zIndex = '5'; labelsWrap.style.flexShrink = '0';

  for (var midi = maxMidi; midi >= minMidi; midi--) {
    var row = maxMidi - midi;
    var label = document.createElement('div');
    label.className = 'pr-label';
    var noteName = MP.nameFromMidi(midi);
    if (noteName.match(/^C\d$/)) label.classList.add('octave-c');
    if (noteName.includes('#')) label.classList.add('black-key-row');
    label.textContent = noteName;
    label.style.position = 'absolute';
    label.style.top = (row * MP.PR_ROW_H) + 'px';
    label.style.left = '0'; label.style.width = MP.PR_LABEL_W + 'px'; label.style.height = MP.PR_ROW_H + 'px';
    labelsWrap.appendChild(label);

    if (noteName.includes('#')) {
      var rowBg = document.createElement('div');
      rowBg.className = 'pr-row-bg black-key-row';
      rowBg.style.top = (MP.PR_TIMELINE_H + row * MP.PR_ROW_H) + 'px'; rowBg.style.width = totalW + 'px';
      inner.appendChild(rowBg);
    }
  }

  var labelPreview = null, labelCurrentMidi = null;
  function labelMidiFromY(clientY) {
    var wrapRect = labelsWrap.getBoundingClientRect();
    var y = clientY - wrapRect.top;
    return Math.max(minMidi, Math.min(maxMidi, maxMidi - Math.floor(y / MP.PR_ROW_H)));
  }
  labelsWrap.addEventListener('mousedown', function(e) {
    e.preventDefault(); e.stopPropagation();
    labelCurrentMidi = labelMidiFromY(e.clientY);
    labelPreview = MP.playNotePreview(MP.freqFromMidi(labelCurrentMidi));
    var onMove = function(e2) {
      var newMidi = labelMidiFromY(e2.clientY);
      if (newMidi !== labelCurrentMidi) {
        MP.stopNotePreview(labelPreview);
        labelCurrentMidi = newMidi;
        labelPreview = MP.playNotePreview(MP.freqFromMidi(newMidi));
      }
    };
    var onUp = function() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      MP.stopNotePreview(labelPreview); labelPreview = null;
      labelCurrentMidi = null;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  inner.appendChild(labelsWrap);
}

function buildPrGrid(inner, minMidi, maxMidi, gridH, totalBeats, beatW, tsBeats) {
  var totalW = totalBeats * beatW;
  for (var midi = maxMidi; midi >= minMidi; midi--) {
    var row = maxMidi - midi;
    var line = document.createElement('div');
    line.className = 'pr-gridline-h';
    if (MP.nameFromMidi(midi).match(/^C\d$/)) line.classList.add('octave-c');
    line.style.top = (MP.PR_TIMELINE_H + (row + 1) * MP.PR_ROW_H - 1) + 'px';
    line.style.left = MP.PR_LABEL_W + 'px'; line.style.width = totalW + 'px';
    inner.appendChild(line);
  }
  for (var beat = 0; beat <= totalBeats; beat++) {
    var vline = document.createElement('div');
    vline.className = 'pr-gridline-v';
    if (beat % tsBeats === 0) vline.classList.add('measure');
    vline.style.left = (MP.PR_LABEL_W + beat * beatW) + 'px';
    vline.style.top = MP.PR_TIMELINE_H + 'px'; vline.style.height = gridH + 'px';
    inner.appendChild(vline);
  }
}

function setupPrResize(resizeHandle, n, i, beatW, noteBlocks) {
  resizeHandle.addEventListener('mousedown', function(e) {
    e.stopPropagation(); e.preventDefault();
    var startX = e.clientX;
    var snap = function(b) {
      var step = MP.appState.snapEnabled ? MP.SNAP_BEATS : MP.FINE_SNAP_BEATS;
      return Math.max(step, Math.round(b / step) * step);
    };
    var batchIdxs = MP.appState.selectedNoteIdxs.has(i) && MP.appState.selectedNoteIdxs.size > 1
      ? [...MP.appState.selectedNoteIdxs] : [i];
    var origDurs = {};
    batchIdxs.forEach(function(idx) { origDurs[idx] = MP.appState.seq[idx].dur; });
    var onMove = function(e2) {
      var delta = (e2.clientX - startX) / beatW;
      batchIdxs.forEach(function(idx) {
        var snapped = snap(origDurs[idx] + delta);
        var b = noteBlocks[idx];
        if (b) b.style.width = Math.max(8, snapped * beatW - 2) + 'px';
      });
    };
    var onUp = function(e3) {
      var delta = (e3.clientX - startX) / beatW;
      var changed = false;
      batchIdxs.forEach(function(idx) {
        if (snap(origDurs[idx] + delta) !== origDurs[idx]) changed = true;
      });
      if (!changed) return;
      MP.pushUndo();
      var newDur;
      batchIdxs.forEach(function(idx) {
        newDur = snap(origDurs[idx] + delta);
        MP.appState.seq[idx].dur = newDur;
      });
      MP.appState.lastNoteDur = newDur;
      MP.ensureNextNoteStart();
      MP.updateSequence();
    };
    startDrag(onMove, onUp);
  });
}

function setupPrNoteDrag(block, n, i, midi, noteW, beatW, minMidi, maxMidi, noteBlocks) {
  block.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    if (e.target.classList.contains('pr-resize')) return;
    e.preventDefault();
    var isSelected = MP.appState.selectedNoteIdxs.has(i);
    if (!MP.modKey(e) && !e.shiftKey && !isSelected) {
      MP.appState.selectedNoteIdxs.clear();
      document.querySelectorAll('.pr-note.selected').forEach(function(b) { b.classList.remove('selected'); });
    }
    MP.appState.selectedNoteIdxs.add(i);
    block.classList.add('selected');
    MP.appState.selectedNoteIdx = i;
    MP.appState.lastNoteDur = n.dur;

    var isClone = e.shiftKey;
    var dragMode = null, startX, startY;

    if (MP.appState.selectedNoteIdxs.size > 1 && isSelected) {
      startX = e.clientX; startY = e.clientY;
      var origPositions = {};
      MP.appState.selectedNoteIdxs.forEach(function(idx) {
        origPositions[idx] = { start: MP.appState.seq[idx].start, midi: MP.midiFromName(MP.appState.seq[idx].name) };
      });
      var ghostBlocks = [];
      var onMove = function(e2) {
        var dx = e2.clientX - startX, dy = e2.clientY - startY;
        if (!dragMode) {
          if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
          dragMode = 'free';
          if (isClone) {
            MP.appState.selectedNoteIdxs.forEach(function(idx) {
              var b = noteBlocks[idx];
              if (!b) return;
              var ghost = b.cloneNode(true);
              ghost.style.opacity = '0.5';
              ghost.style.pointerEvents = 'none';
              b.parentElement.appendChild(ghost);
              ghostBlocks.push({ ghost: ghost, origBlock: b });
              b.style.left = (MP.PR_LABEL_W + origPositions[idx].start * beatW + 1) + 'px';
              b.style.top = (MP.PR_TIMELINE_H + (maxMidi - origPositions[idx].midi) * MP.PR_ROW_H + 1) + 'px';
            });
          }
        }
        var dBeat = MP.snapBeats(Math.abs(dx / beatW)) * Math.sign(dx / beatW);
        var dMidi = -Math.round(dy / MP.PR_ROW_H);
        var targets = isClone ? ghostBlocks.map(function(g) { return g.ghost; }) : null;
        var ti = 0;
        MP.appState.selectedNoteIdxs.forEach(function(idx) {
          var b = isClone ? targets[ti++] : noteBlocks[idx];
          if (!b) return;
          var orig = origPositions[idx];
          var newStart = Math.max(0, orig.start + dBeat);
          var newMidi = Math.max(minMidi, Math.min(maxMidi, orig.midi + dMidi));
          b.style.left = (MP.PR_LABEL_W + newStart * beatW + 1) + 'px';
          b.style.top = (MP.PR_TIMELINE_H + (maxMidi - newMidi) * MP.PR_ROW_H + 1) + 'px';
          var w = MP.appState.seq[idx].dur * beatW;
          var lbl = b ? b.querySelector('.pr-note-label') : null;
          if (lbl && w > 30) lbl.textContent = MP.nameFromMidi(newMidi);
          b._newStart = newStart;
          b._previewMidi = newMidi;
        });
      };
      var onUp = function() {
        ghostBlocks.forEach(function(g) { g.ghost.remove(); });
        if (dragMode === 'free') {
          var diffs = [];
          var ti = 0;
          MP.appState.selectedNoteIdxs.forEach(function(idx) {
            var b = isClone ? ghostBlocks[ti++] : { ghost: noteBlocks[idx] };
            var src = isClone ? b.ghost : noteBlocks[idx];
            if (!src) return;
            var orig = origPositions[idx];
            diffs.push({ idx: idx, newMidi: src._previewMidi, newStart: src._newStart, orig: orig });
          });
          var changed = diffs.some(function(d) { return d.newMidi !== d.orig.midi || d.newStart !== d.orig.start; });
          if (changed) {
            MP.pushUndo();
            if (isClone) {
              var newIdxs = new Set();
              diffs.forEach(function(d) {
                var srcNote = MP.appState.seq[d.idx];
                var cloneMidi = d.newMidi !== undefined ? d.newMidi : d.orig.midi;
                var cloneStart = d.newStart !== undefined ? d.newStart : d.orig.start;
                var newIdx = MP.appState.seq.length;
                MP.appState.seq.push({ name: MP.nameFromMidi(cloneMidi), freq: MP.freqFromMidi(cloneMidi), start: cloneStart, dur: srcNote.dur });
                newIdxs.add(newIdx);
              });
              MP.appState.selectedNoteIdxs = newIdxs;
            } else {
              diffs.forEach(function(d) {
                if (d.newMidi !== undefined) {
                  MP.updateNoteFromMidi(MP.appState.seq[d.idx], d.newMidi);
                }
                if (d.newStart !== undefined) MP.appState.seq[d.idx].start = d.newStart;
              });
            }
            MP.ensureNextNoteStart();
            MP.updateSequence();
          }
        }
      };
      startDrag(onMove, onUp);
      return;
    }

    startX = e.clientX; startY = e.clientY;
    var origMidi = midi, origStart = n.start, currentDragMidi = midi;
    dragMode = null;
    var notePreview = MP.playNotePreview(n.freq);
    var ghostBlock = null;

    var onMove = function(e2) {
      var dx = e2.clientX - startX, dy = e2.clientY - startY;
      if (!dragMode) {
        if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
        dragMode = 'free';
        if (isClone) {
          ghostBlock = block.cloneNode(true);
          ghostBlock.style.opacity = '0.5';
          ghostBlock.style.pointerEvents = 'none';
          block.parentElement.appendChild(ghostBlock);
          block.style.left = (MP.PR_LABEL_W + origStart * beatW + 1) + 'px';
          block.style.top = (MP.PR_TIMELINE_H + (maxMidi - origMidi) * MP.PR_ROW_H + 1) + 'px';
        }
      }
      var target = isClone ? ghostBlock : block;
      var newMidi = Math.max(minMidi, Math.min(maxMidi, origMidi - Math.round(dy / MP.PR_ROW_H)));
      target.style.top = (MP.PR_TIMELINE_H + (maxMidi - newMidi) * MP.PR_ROW_H + 1) + 'px';
      var lbl = target.querySelector('.pr-note-label');
      if (lbl && noteW > 30) lbl.textContent = MP.nameFromMidi(newMidi);
      target._previewMidi = newMidi;
      if (newMidi !== currentDragMidi) { MP.stopNotePreview(notePreview); notePreview = MP.playNotePreview(MP.freqFromMidi(newMidi)); currentDragMidi = newMidi; }
      var newStart = Math.max(0, MP.snapBeats(origStart + dx / beatW));
      target.style.left = (MP.PR_LABEL_W + newStart * beatW + 1) + 'px';
      target._newStart = newStart;
    };
    var onUp = function() {
      MP.stopNotePreview(notePreview);
      var clonedMidi = ghostBlock ? ghostBlock._previewMidi : undefined;
      var clonedStart = ghostBlock ? ghostBlock._newStart : undefined;
      if (ghostBlock) ghostBlock.remove();
      if (dragMode === 'free') {
        var finalMidi = isClone ? clonedMidi : block._previewMidi;
        var finalStart = isClone ? clonedStart : block._newStart;
        var pitchChanged = finalMidi !== undefined && finalMidi !== midi;
        var startChanged = finalStart !== undefined && finalStart !== n.start;
        if (pitchChanged || startChanged) {
          MP.pushUndo();
          if (isClone) {
            var cm = pitchChanged ? finalMidi : midi;
            var cs = startChanged ? finalStart : n.start;
            MP.appState.seq.push({ name: MP.nameFromMidi(cm), freq: MP.freqFromMidi(cm), start: cs, dur: n.dur });
          } else {
            if (pitchChanged) {
              MP.updateNoteFromMidi(MP.appState.seq[i], finalMidi);
            }
            if (startChanged) {
              MP.appState.seq[i].start = finalStart;
            }
          }
          MP.ensureNextNoteStart();
          MP.updateSequence();
        }
        delete block._previewMidi; delete block._newStart;
      }
    };
    startDrag(onMove, onUp);
  });
}

function buildPrNoteBlocks(inner, minMidi, maxMidi, beatW, noteBlocks) {
  MP.appState.seq.forEach(function(n, i) {
    var midi = MP.midiFromName(n.name);
    var row = maxMidi - midi;
    var block = document.createElement('div');
    block.className = 'pr-note';
    block.dataset.seqIdx = i;
    if (MP.appState.selectedNoteIdxs.has(i)) block.classList.add('selected');
    var xPos = n.start * beatW;
    var noteW = n.dur * beatW;
    block.style.left = (MP.PR_LABEL_W + xPos + 1) + 'px';
    block.style.top = (MP.PR_TIMELINE_H + row * MP.PR_ROW_H + 1) + 'px';
    block.style.width = Math.max(8, noteW - 2) + 'px';
    block.style.height = (MP.PR_ROW_H - 2) + 'px';
    block.style.lineHeight = (MP.PR_ROW_H - 2) + 'px';
    var noteLabel = document.createElement('span');
    noteLabel.className = 'pr-note-label';
    if (noteW > 30) noteLabel.textContent = n.name;
    block.appendChild(noteLabel);
    noteBlocks[i] = block;

    var resizeHandle = document.createElement('div');
    resizeHandle.className = 'pr-resize';
    block.appendChild(resizeHandle);

    setupPrResize(resizeHandle, n, i, beatW, noteBlocks);
    setupPrNoteDrag(block, n, i, midi, noteW, beatW, minMidi, maxMidi, noteBlocks);

    block.addEventListener('contextmenu', function(e) {
      e.preventDefault(); MP.pushUndo(); MP.appState.seq.splice(i, 1); MP.resetNextNoteStart(); MP.updateSequence();
    });
    inner.appendChild(block);
  });
}

function buildPrEdgeHandle(inner, gridH, totalW, beatW) {
  var edgeHandle = document.createElement('div');
  edgeHandle.className = 'pr-edge-handle';
  edgeHandle.style.left = (MP.PR_LABEL_W + totalW - 3) + 'px';
  edgeHandle.style.top = MP.PR_TIMELINE_H + 'px';
  edgeHandle.style.height = gridH + 'px';
  inner.appendChild(edgeHandle);

  edgeHandle.addEventListener('mousedown', function(e) {
    e.preventDefault(); e.stopPropagation();
    var startX = e.clientX;
    var origEnd = Math.max(MP.seqEndBeat(), MP.appState.nextNoteStart);
    var minEnd = MP.appState.snapEnabled ? MP.SNAP_BEATS : MP.FINE_SNAP_BEATS;
    var lastEnd = origEnd;
    var onMove = function(e2) {
      var dx = e2.clientX - startX;
      lastEnd = Math.max(minEnd, MP.snapBeats(origEnd + dx / beatW));
      var newW = lastEnd * beatW;
      inner.style.width = (MP.PR_LABEL_W + newW) + 'px';
      edgeHandle.style.left = (MP.PR_LABEL_W + newW - 3) + 'px';
    };
    var onUp = function() {
      if (Math.abs(lastEnd - origEnd) > 0.001) {
        MP.pushUndo();
        var newEnd = lastEnd;
        for (var j = MP.appState.seq.length - 1; j >= 0; j--) {
          var s = MP.appState.seq[j];
          if (s.start >= newEnd) {
            MP.appState.seq.splice(j, 1);
          } else if (s.start + s.dur > newEnd) {
            s.dur = newEnd - s.start;
          }
        }
        MP.appState.nextNoteStart = newEnd;
        MP.updateSequence();
      } else {
        inner.style.width = (MP.PR_LABEL_W + origEnd * beatW) + 'px';
        edgeHandle.style.left = (MP.PR_LABEL_W + origEnd * beatW - 3) + 'px';
      }
    };
    startDrag(onMove, onUp);
  });
}

function buildPrEmptySpace(inner, minMidi, maxMidi, totalW, beatW, noteBlocks) {
  var emptySpacePreview = null, emptySpaceMidi = null, emptySpaceDragged = false;
  var selRect = null;
  inner.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    if (e.target.classList.contains('pr-note') || e.target.classList.contains('pr-resize') || e.target.parentElement?.classList.contains('pr-note')) return;
    var rect = inner.getBoundingClientRect();
    var x = e.clientX - rect.left;
    if (x < MP.PR_LABEL_W || x > MP.PR_LABEL_W + totalW) return;
    var y = e.clientY - rect.top - MP.PR_TIMELINE_H;
    if (y < 0) return;
    var clickedMidi = maxMidi - Math.floor(y / MP.PR_ROW_H);
    if (clickedMidi < minMidi || clickedMidi > maxMidi) return;
    var clickBeat = MP.snapBeats((x - MP.PR_LABEL_W) / beatW);
    if (!MP.modKey(e) && !e.shiftKey) {
      document.querySelectorAll('.pr-note.selected').forEach(function(b) { b.classList.remove('selected'); });
      MP.appState.selectedNoteIdx = null;
      MP.appState.selectedNoteIdxs.clear();
    }
    emptySpaceMidi = clickedMidi; emptySpaceDragged = false;
    var startClientX = e.clientX, startClientY = e.clientY;
    var anchorX = x, anchorY = y + MP.PR_TIMELINE_H;
    emptySpacePreview = MP.playNotePreview(MP.freqFromMidi(clickedMidi));

    var onMove = function(e2) {
      if (!emptySpaceDragged && Math.abs(e2.clientX - startClientX) < 4 && Math.abs(e2.clientY - startClientY) < 4) return;
      if (!emptySpaceDragged) {
        MP.stopNotePreview(emptySpacePreview); emptySpacePreview = null;
        selRect = document.createElement('div');
        selRect.className = 'pr-select-rect';
        inner.appendChild(selRect);
      }
      emptySpaceDragged = true;
      var curX = e2.clientX - rect.left;
      var curY = e2.clientY - rect.top;
      var sx = Math.min(anchorX, curX), sy = Math.min(anchorY, curY);
      var sw = Math.abs(curX - anchorX), sh = Math.abs(curY - anchorY);
      selRect.style.left = sx + 'px'; selRect.style.top = sy + 'px';
      selRect.style.width = sw + 'px'; selRect.style.height = sh + 'px';

      MP.appState.selectedNoteIdxs.clear();
      MP.appState.seq.forEach(function(sn, si) {
        var sMidi = MP.midiFromName(sn.name);
        var noteLeft = MP.PR_LABEL_W + sn.start * beatW;
        var noteRight = noteLeft + sn.dur * beatW;
        var noteTop = MP.PR_TIMELINE_H + (maxMidi - sMidi) * MP.PR_ROW_H;
        var noteBottom = noteTop + MP.PR_ROW_H;
        var hit = noteRight > sx && noteLeft < sx + sw && noteBottom > sy && noteTop < sy + sh;
        var b = noteBlocks[si];
        if (hit) { MP.appState.selectedNoteIdxs.add(si); if (b) b.classList.add('selected'); }
        else { if (b) b.classList.remove('selected'); }
      });
    };
    var onUp = function() {
      if (selRect) { selRect.remove(); selRect = null; }
      if (!emptySpaceDragged) {
        MP.stopNotePreview(emptySpacePreview); emptySpacePreview = null;
        if (emptySpaceMidi !== null) {
          var placeDur = MP.appState.lastNoteDur || (MP.appState.seq.length > 0 ? MP.appState.seq[MP.appState.seq.length - 1].dur : 1);
          MP.pushUndo();
          MP.appState.seq.push({ name: MP.nameFromMidi(emptySpaceMidi), freq: MP.freqFromMidi(emptySpaceMidi), start: clickBeat, dur: placeDur });
          MP.ensureNextNoteStart();
          MP.updateSequence();
        }
      }
      emptySpaceMidi = null;
    };
    startDrag(onMove, onUp);
  });
}

MP.renderPianoRoll = function() {
  var container = document.getElementById('piano-roll');
  var prevScrollTop = container.scrollTop;
  var prevScrollLeft = container.scrollLeft;
  var hadContent = container.querySelector('.piano-roll-inner') !== null;
  container.innerHTML = '';

  var range = calcPrRange(MP.appState.seq, container.clientHeight);
  var minMidi = range.minMidi, maxMidi = range.maxMidi, midiNotes = range.midiNotes;
  var beatW = MP.PR_BEAT_W * MP.appState.prZoom;
  var pitchCount = maxMidi - minMidi + 1;
  var gridH = pitchCount * MP.PR_ROW_H;
  var snapStep = MP.appState.snapEnabled ? MP.SNAP_BEATS : MP.FINE_SNAP_BEATS;
  var rawBeats = Math.max(snapStep, Math.max(MP.seqEndBeat(), MP.appState.nextNoteStart));
  var totalBeats = Math.ceil(rawBeats / snapStep) * snapStep;
  var totalW = totalBeats * beatW;
  var tsBeats = MP.getTimeSigBeats();

  var inner = document.createElement('div');
  inner.className = 'piano-roll-inner';
  inner.style.width = (MP.PR_LABEL_W + totalW) + 'px';
  inner.style.height = (gridH + MP.PR_TIMELINE_H) + 'px';
  inner.style.position = 'relative';
  inner.dataset.maxMidi = maxMidi;

  buildPrTimeline(inner, totalBeats, beatW, tsBeats, gridH);
  buildPrLabels(inner, minMidi, maxMidi, gridH, totalW);
  buildPrGrid(inner, minMidi, maxMidi, gridH, totalBeats, beatW, tsBeats);

  var noteBlocks = {};
  buildPrNoteBlocks(inner, minMidi, maxMidi, beatW, noteBlocks);
  buildPrEdgeHandle(inner, gridH, totalW, beatW);
  buildPrEmptySpace(inner, minMidi, maxMidi, totalW, beatW, noteBlocks);

  container.appendChild(inner);

  if (hadContent) { container.scrollTop = prevScrollTop; container.scrollLeft = prevScrollLeft; }
  else if (midiNotes.length > 0) {
    var avgMidi = midiNotes.reduce(function(a, b) { return a + b; }, 0) / midiNotes.length;
    container.scrollTop = Math.max(0, MP.PR_TIMELINE_H + (maxMidi - avgMidi) * MP.PR_ROW_H - container.clientHeight / 2);
  }
};
