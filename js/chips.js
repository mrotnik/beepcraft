MP.renderChips = function() {
  const el = document.getElementById('sequence');
  const count = document.getElementById('note-count');
  el.innerHTML = '';
  const flat = MP.seqToFlat();
  if (flat.length === 0) {
    el.innerHTML = '<span class="empty-msg">No notes yet \u2014 click piano keys above</span>';
    count.textContent = '0 notes';
    return;
  }
  const sorted = [...MP.appState.seq].sort((a, b) => a.start - b.start);
  let noteIdx = 0;

  function buildChipContent(chip, name, durLabel) {
    var span1 = document.createElement('span'); span1.textContent = name;
    var span2 = document.createElement('span'); span2.className = 'dur-label'; span2.textContent = durLabel;
    var span3 = document.createElement('span'); span3.className = 'remove'; span3.textContent = 'x';
    chip.append(span1, span2, span3);
  }
  flat.forEach((n, flatIdx) => {
    const chip = document.createElement('div');
    chip.className = 'note-chip' + (n.freq === 0 ? ' rest' : '');
    chip.draggable = true;
    chip.dataset.flatIdx = flatIdx;
    const durLabel = (MP.DUR_NAMES[n.dur] || ('1/' + n.dur)) + (n.dotted ? '.' : '');
    if (n.freq > 0 && noteIdx < sorted.length) {
      const seqEntry = sorted[noteIdx];
      const origIdx = MP.appState.seq.indexOf(seqEntry);
      noteIdx++;
      buildChipContent(chip, n.name, durLabel);
      chip.querySelector('.remove').addEventListener('click', () => {
        MP.pushUndo(); MP.appState.seq.splice(origIdx, 1);
        MP.ensureNextNoteStart();
        MP.updateSequence();
      });
    } else {
      buildChipContent(chip, n.name, durLabel);
      const restFlatIdx = flatIdx;
      chip.querySelector('.remove').addEventListener('click', () => {
        MP.pushUndo();
        const currentFlat = MP.seqToFlat();
        currentFlat.splice(restFlatIdx, 1);
        MP.appState.seq = MP.rebuildSeqFromFlat(currentFlat);
        MP.ensureNextNoteStart();
        MP.updateSequence();
      });
    }

    chip.addEventListener('dragstart', (e) => {
      chip.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', flatIdx);
    });
    chip.addEventListener('dragend', () => {
      chip.classList.remove('dragging');
      el.querySelectorAll('.note-chip').forEach(c => c.classList.remove('drag-over-left', 'drag-over-right'));
    });
    chip.addEventListener('dragover', (e) => {
      e.preventDefault(); e.dataTransfer.dropEffect = 'move';
      const mid = chip.getBoundingClientRect().left + chip.getBoundingClientRect().width / 2;
      el.querySelectorAll('.note-chip').forEach(c => c.classList.remove('drag-over-left', 'drag-over-right'));
      chip.classList.add(e.clientX < mid ? 'drag-over-left' : 'drag-over-right');
    });
    chip.addEventListener('dragleave', () => chip.classList.remove('drag-over-left', 'drag-over-right'));
    chip.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
      const mid = chip.getBoundingClientRect().left + chip.getBoundingClientRect().width / 2;
      let toIdx = e.clientX < mid ? flatIdx : flatIdx + 1;
      if (fromIdx === toIdx || fromIdx + 1 === toIdx) return;
      MP.pushUndo();
      const item = flat.splice(fromIdx, 1)[0];
      if (toIdx > fromIdx) toIdx--;
      flat.splice(toIdx, 0, item);
      MP.appState.seq = MP.rebuildSeqFromFlat(flat);
      MP.ensureNextNoteStart();
      MP.updateSequence();
    });
    el.appendChild(chip);
  });

  const notes = MP.appState.seq.length;
  const rests = flat.filter(n => n.freq === 0).length;
  count.textContent = notes + ' note' + (notes !== 1 ? 's' : '') +
    (rests > 0 ? ', ' + rests + ' rest' + (rests !== 1 ? 's' : '') : '');
  const nameEl = document.getElementById('melody-name');
  nameEl.textContent = MP.appState.melodyName || '';
  nameEl.style.display = MP.appState.melodyName ? '' : 'none';
};
