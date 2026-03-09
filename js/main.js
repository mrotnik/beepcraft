function setupDurationControls() {
  document.getElementById('auto-mode').addEventListener('change', function(e) {
    var manual = !e.target.checked;
    document.querySelectorAll('.dur-btn').forEach(function(b) { b.disabled = !manual; });
    document.getElementById('hold-hint').style.display = manual ? 'none' : '';
  });
  document.querySelectorAll('.dur-btn').forEach(function(b) { b.disabled = true; });
  document.querySelectorAll('.dur-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.dur-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      MP.appState.selectedDur = parseInt(btn.dataset.dur);
    });
  });
  document.querySelectorAll('.pause-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      MP.pushUndo();
      MP.ensureNextNoteStart();
      MP.appState.nextNoteStart += MP.beatsFromDur(parseInt(btn.dataset.dur));
      MP.updateSequence();
    });
  });
}

function setupPlaybackControls() {
  document.getElementById('btn-play').addEventListener('click', function() {
    if (MP.appState.playState) MP.stopPlayback(); else MP.playSequence();
  });
  document.getElementById('btn-clear').addEventListener('click', function() {
    MP.pushUndo(); MP.appState.seq = []; MP.appState.nextNoteStart = 0;
    MP.appState.melodyName = null;
    MP.stopPlayback(); MP.updateSequence();
  });
  document.getElementById('btn-loop').addEventListener('click', function() {
    MP.appState.loopEnabled = !MP.appState.loopEnabled;
    document.getElementById('btn-loop').classList.toggle('active', MP.appState.loopEnabled);
  });
  document.getElementById('btn-record').addEventListener('click', MP.toggleRecording);
  document.getElementById('btn-metronome').addEventListener('click', function() {
    if (MP.appState.metronomeOn) MP.stopMetronome(); else MP.startMetronome();
  });
  document.getElementById('btn-undo').addEventListener('click', MP.undo);
  document.getElementById('btn-redo').addEventListener('click', MP.redo);
  document.getElementById('btn-pitch-up').addEventListener('click', function() { MP.transposeSemitones(1); });
  document.getElementById('btn-pitch-down').addEventListener('click', function() { MP.transposeSemitones(-1); });

  var melodyNameEl = document.getElementById('melody-name');
  melodyNameEl.addEventListener('click', function() {
    if (!melodyNameEl.textContent) return;
    melodyNameEl.contentEditable = 'true';
    melodyNameEl.classList.add('editing');
    melodyNameEl.focus();
    var range = document.createRange();
    range.selectNodeContents(melodyNameEl);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });
  function finishMelodyRename() {
    if (melodyNameEl.contentEditable !== 'true') return;
    melodyNameEl.contentEditable = 'false';
    melodyNameEl.classList.remove('editing');
    window.getSelection().removeAllRanges();
    var newName = melodyNameEl.textContent.trim();
    if (newName && newName !== MP.appState.melodyName) {
      MP.appState.melodyName = newName;
      melodyNameEl.textContent = newName;
      MP.generateCode();
    }
  }
  melodyNameEl.addEventListener('blur', finishMelodyRename);
  melodyNameEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); melodyNameEl.blur(); }
    if (e.key === 'Escape') {
      melodyNameEl.textContent = MP.appState.melodyName || '';
      melodyNameEl.blur();
    }
  });
  document.querySelectorAll('.view-tab[data-view]').forEach(function(tab) {
    tab.addEventListener('click', function() { MP.switchView(tab.dataset.view); });
  });
}

function setupPianoRollControls() {
  var zoomInput = document.getElementById('pr-zoom-input');
  MP.updateZoom = function(delta) {
    MP.appState.prZoom = Math.min(MP.ZOOM_MAX, Math.max(MP.ZOOM_MIN, MP.appState.prZoom + delta));
    zoomInput.value = Math.round(MP.appState.prZoom * 100) + '%';
    MP.renderPianoRoll();
    if (MP.appState.playState) MP.startPlayhead();
  };
  MP.setZoom = function(val) {
    MP.appState.prZoom = Math.min(MP.ZOOM_MAX, Math.max(MP.ZOOM_MIN, val));
    zoomInput.value = Math.round(MP.appState.prZoom * 100) + '%';
    MP.renderPianoRoll();
    if (MP.appState.playState) MP.startPlayhead();
  };
  document.getElementById('btn-zoom-in').addEventListener('click', function() { MP.updateZoom(MP.ZOOM_STEP); });
  document.getElementById('btn-zoom-out').addEventListener('click', function() { MP.updateZoom(-MP.ZOOM_STEP); });
  document.querySelector('.pr-zoom-controls').addEventListener('wheel', function(e) { e.preventDefault(); MP.updateZoom(e.deltaY < 0 ? MP.ZOOM_WHEEL_STEP : -MP.ZOOM_WHEEL_STEP); });
  zoomInput.addEventListener('change', function() {
    var num = parseInt(zoomInput.value);
    if (!isNaN(num) && num >= MP.ZOOM_MIN * 100 && num <= MP.ZOOM_MAX * 100) MP.setZoom(num / 100);
    else zoomInput.value = Math.round(MP.appState.prZoom * 100) + '%';
  });
  zoomInput.addEventListener('wheel', function(e) {
    e.preventDefault();
    MP.updateZoom(e.deltaY < 0 ? MP.ZOOM_WHEEL_STEP : -MP.ZOOM_WHEEL_STEP);
  });

  MP.togglePrFullscreen = function() {
    var wrapper = document.querySelector('.piano-roll-wrapper');
    var btn = document.getElementById('btn-pr-fullscreen');
    var isFs = wrapper.classList.toggle('fullscreen');
    if (isFs) {
      var topBar = document.getElementById('top-bar');
      wrapper.style.top = topBar.offsetHeight + 'px';
    } else {
      wrapper.style.top = '';
    }
    btn.textContent = isFs ? '\u2716' : '\u26F6';
    btn.dataset.tip = isFs ? 'Exit fullscreen (Esc)' : 'Toggle fullscreen piano roll (' + MP.MOD_KEY + '+Enter)';
    btn.classList.toggle('btn-clear', !isFs);
    btn.classList.toggle('btn-danger', isFs);
    if (MP.appState.currentView === 'roll') {
      MP.renderPianoRoll();
      if (MP.appState.playState) MP.startPlayhead();
    }
  };
  document.getElementById('time-sig').addEventListener('change', function(e) {
    var parts = e.target.value.split('/');
    MP.appState.timeSig = { beats: parseInt(parts[0]), value: parseInt(parts[1]) };
    if (MP.appState.currentView === 'roll') {
      MP.renderPianoRoll();
      if (MP.appState.playState) MP.startPlayhead();
    }
  });
  document.getElementById('btn-snap').addEventListener('click', function() {
    MP.appState.snapEnabled = !MP.appState.snapEnabled;
    document.getElementById('btn-snap').classList.toggle('active', MP.appState.snapEnabled);
  });
  document.getElementById('btn-pr-fullscreen').addEventListener('click', MP.togglePrFullscreen);
}

function setupBpmControls() {
  var bpmInput = document.getElementById('bpm');
  var ledDisplay = document.getElementById('led-display');
  function updateLed() { ledDisplay.textContent = bpmInput.value; }
  bpmInput.addEventListener('change', function() { updateLed(); MP.generateCode(); if (MP.appState.playState) MP.refreshPlayback(); });
  bpmInput.addEventListener('input', updateLed);
  function stepBpm(delta) {
    var cur = parseInt(bpmInput.value) || 120;
    bpmInput.value = Math.min(MP.BPM_MAX, Math.max(MP.BPM_MIN, cur + delta));
    bpmInput.dispatchEvent(new Event('change'));
  }
  document.getElementById('bpm-up').addEventListener('click', function() { stepBpm(1); });
  document.getElementById('bpm-down').addEventListener('click', function() { stepBpm(-1); });
  ledDisplay.addEventListener('click', function() {
    ledDisplay.style.display = 'none';
    bpmInput.classList.add('editing');
    bpmInput.focus();
    bpmInput.select();
  });
  bpmInput.addEventListener('blur', function() {
    bpmInput.classList.remove('editing');
    ledDisplay.style.display = '';
    updateLed();
  });
  bpmInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') bpmInput.blur();
  });
  ledDisplay.addEventListener('wheel', function(e) {
    e.preventDefault();
    stepBpm((e.shiftKey ? 10 : 1) * (e.deltaY < 0 ? 1 : -1));
  });
  bpmInput.addEventListener('wheel', function(e) {
    e.preventDefault();
    stepBpm((e.shiftKey ? 10 : 1) * (e.deltaY < 0 ? 1 : -1));
  });

  var tapBtn = document.getElementById('btn-tap-tempo');
  var tapTimes = [];
  tapBtn.addEventListener('click', function() {
    var now = performance.now();
    tapTimes = tapTimes.filter(function(t) { return now - t < 3000; });
    tapTimes.push(now);
    if (tapTimes.length >= 2) {
      var intervals = [];
      for (var i = 1; i < tapTimes.length; i++) intervals.push(tapTimes[i] - tapTimes[i - 1]);
      var avgMs = intervals.reduce(function(a, b) { return a + b; }) / intervals.length;
      var bpm = Math.round(60000 / avgMs);
      bpmInput.value = Math.min(MP.BPM_MAX, Math.max(MP.BPM_MIN, bpm));
      bpmInput.dispatchEvent(new Event('change'));
    }
    tapBtn.classList.add('tap-flash');
    setTimeout(function() { tapBtn.classList.remove('tap-flash'); }, 100);
  });
}

function setupOutputControls() {
  var hotkeyModal = document.getElementById('hotkey-modal');
  document.getElementById('btn-help').addEventListener('click', function() { hotkeyModal.style.display = hotkeyModal.style.display === 'none' ? '' : 'none'; });
  document.getElementById('hotkey-modal-close').addEventListener('click', function() { hotkeyModal.style.display = 'none'; });
  hotkeyModal.addEventListener('click', function(e) { if (e.target === hotkeyModal) hotkeyModal.style.display = 'none'; });

  document.getElementById('copy-btn').addEventListener('click', function() {
    MP.copyToClipboard('output', this, '&#128203; Copy to clipboard');
  });
  document.getElementById('rtttl-copy-btn').addEventListener('click', function() {
    MP.copyToClipboard('rtttl-output', this, '&#128203; Copy');
  });
  document.getElementById('rtttl-save-btn').addEventListener('click', function() {
    var rtttl = document.getElementById('rtttl-output').value.trim();
    if (!rtttl) { MP.showToast('Nothing to save', true); return; }
    var name = MP.sanitizeFilename(MP.appState.melodyName);
    var blob = new Blob([rtttl], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.rtttl';
    a.click();
    URL.revokeObjectURL(a.href);
    MP.showToast('Saved ' + name + '.rtttl');
  });
  document.getElementById('midi-save-btn').addEventListener('click', function() {
    var data = MP.generateMIDI();
    if (!data) { MP.showToast('Nothing to save', true); return; }
    var name = MP.sanitizeFilename(MP.appState.melodyName);
    var blob = new Blob([data], { type: 'audio/midi' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.mid';
    a.click();
    URL.revokeObjectURL(a.href);
    MP.showToast('Saved ' + name + '.mid');
  });
  function parseRtttlInput() {
    var raw = document.getElementById('rtttl-output').value.trim();
    if (!raw) return;
    var result = MP.loadRTTTL(raw);
    if (!result) { MP.showMidiInfo('Invalid RTTTL format. Expected: Name:d=4,o=5,b=120:4c,8d,e,2p', true); return; }
    MP.showMidiInfo('Parsed "' + result.name + '" (' + MP.appState.seq.length + ' notes, ' + result.bpm + ' BPM)');
  }
  var rtttlAutoParseTimer = null;
  document.getElementById('rtttl-output').addEventListener('input', function() {
    clearTimeout(rtttlAutoParseTimer);
    rtttlAutoParseTimer = setTimeout(function() {
      var raw = document.getElementById('rtttl-output').value.trim();
      if (!raw) return;
      var result = MP.parseRTTTL(raw);
      if (result) parseRtttlInput();
    }, 800);
  });

  document.querySelectorAll('.view-tab[data-output]').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.view-tab[data-output]').forEach(function(t) { t.classList.toggle('active', t === tab); });
      document.getElementById('output-rtttl').style.display = tab.dataset.output === 'rtttl' ? '' : 'none';
      document.getElementById('output-arduino').style.display = tab.dataset.output === 'arduino' ? '' : 'none';
    });
  });
}

function setupMelodyPresets() {
  var allPresets = [];
  var searchInput = document.getElementById('melody-search');
  var dropdown = document.getElementById('preset-dropdown');
  var activeIdx = -1;
  var loadedPresetName = null;

  function loadPreset(preset) {
    var result = MP.loadRTTTL(preset.rtttl);
    if (!result) return;
    MP.showMidiInfo('Loaded "' + result.name + '" (' + MP.appState.seq.length + ' notes, ' + result.bpm + ' BPM)');
    searchInput.value = '';
    searchInput.placeholder = result.name;
    searchInput.parentElement.dataset.tip = result.name;
    loadedPresetName = result.name;
    dropdown.classList.remove('open');
  }

  function highlightMatch(text, query) {
    if (!query) return MP.escHtml(text);
    var idx = text.toLowerCase().indexOf(query);
    if (idx < 0) return MP.escHtml(text);
    return MP.escHtml(text.slice(0, idx)) + '<span class="preset-match">' + MP.escHtml(text.slice(idx, idx + query.length)) + '</span>' + MP.escHtml(text.slice(idx + query.length));
  }

  function showDropdown(query) {
    var q = query.toLowerCase().trim();
    var matches = allPresets.filter(function(p) {
      return !q || p.name.toLowerCase().includes(q);
    });
    activeIdx = -1;
    dropdown.innerHTML = '';
    if (matches.length === 0) {
      dropdown.innerHTML = '<div class="preset-count">No matches</div>';
      dropdown.classList.add('open');
      return;
    }
    var total = allPresets.filter(function(p) { return !q || p.name.toLowerCase().includes(q); }).length;
    var countEl = document.createElement('div');
    countEl.className = 'preset-count';
    countEl.textContent = q ? (total + ' match' + (total !== 1 ? 'es' : '')) : (total + ' presets — type to filter');
    dropdown.appendChild(countEl);
    matches.forEach(function(p, i) {
      var item = document.createElement('div');
      item.className = 'preset-item';
      if (p.name === loadedPresetName) item.classList.add('loaded');
      item.innerHTML = highlightMatch(p.name, q);
      item.addEventListener('mousedown', function(e) {
        e.preventDefault();
        loadPreset(p);
      });
      item.addEventListener('mouseenter', function() {
        activeIdx = i;
        dropdown.querySelectorAll('.preset-item').forEach(function(el, j) { el.classList.toggle('active', j === i); });
      });
      dropdown.appendChild(item);
    });
    dropdown.classList.add('open');
  }

  searchInput.addEventListener('focus', function() {
    if (allPresets.length > 0) showDropdown(searchInput.value);
  });
  searchInput.addEventListener('click', function() {
    if (!dropdown.classList.contains('open') && allPresets.length > 0) showDropdown(searchInput.value);
  });
  searchInput.addEventListener('input', function() {
    showDropdown(searchInput.value);
  });
  searchInput.addEventListener('blur', function() {
    setTimeout(function() { dropdown.classList.remove('open'); }, 150);
  });
  searchInput.addEventListener('keydown', function(e) {
    var items = dropdown.querySelectorAll('.preset-item');
    if (items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, items.length - 1);
      items.forEach(function(el, i) { el.classList.toggle('active', i === activeIdx); });
      if (items[activeIdx]) items[activeIdx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      items.forEach(function(el, i) { el.classList.toggle('active', i === activeIdx); });
      if (items[activeIdx]) items[activeIdx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && activeIdx < items.length) items[activeIdx].dispatchEvent(new MouseEvent('mousedown'));
      else if (items.length > 0) items[0].dispatchEvent(new MouseEvent('mousedown'));
    } else if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      searchInput.blur();
    }
  });

  fetch('melodies/melodies.json')
    .then(function(r) { return r.json(); })
    .then(function(melodies) {
      MP._builtinMelodies = melodies;
      melodies.forEach(function(m) {
        allPresets.push({ name: m.split(':')[0].trim(), rtttl: m });
      });
      if (MP.appState.melodyName) {
        searchInput.placeholder = MP.appState.melodyName;
        searchInput.parentElement.dataset.tip = MP.appState.melodyName;
      } else {
        searchInput.placeholder = 'Search ' + allPresets.length + ' presets...';
      }
    });

  MP._addCustomPresets = function(rtttlStrings) {
    allPresets = allPresets.filter(function(p) { return !p.custom; });
    rtttlStrings.forEach(function(s) {
      allPresets.push({ name: s.split(':')[0].trim(), rtttl: s, custom: true });
    });
    searchInput.value = '';
    searchInput.placeholder = allPresets.length + ' presets — click to browse';
    showDropdown('');
    searchInput.focus();
  };
}

function setupThemeAndSettings() {
  var themeBtn = document.getElementById('theme-toggle');
  function setTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeBtn.innerHTML = dark ? '\u2600' : '<span class="moon-icon"></span>';
    localStorage.setItem(MP.LS_THEME, dark ? 'dark' : 'light');
  }
  themeBtn.addEventListener('click', function() { setTheme(document.documentElement.getAttribute('data-theme') !== 'dark'); });
  var saved = localStorage.getItem(MP.LS_THEME);
  if (saved) setTheme(saved === 'dark');
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme(true);

  var toggleBtn = document.getElementById('input-settings-toggle');
  var toggleContent = document.getElementById('input-settings-content');
  var savedCollapsed = localStorage.getItem(MP.LS_INPUT_COLLAPSED);
  if (savedCollapsed === 'true') {
    toggleContent.style.display = 'none';
    toggleBtn.classList.remove('open');
  }
  toggleBtn.addEventListener('click', function() {
    var isOpen = toggleContent.style.display !== 'none';
    toggleContent.style.display = isOpen ? 'none' : '';
    toggleBtn.classList.toggle('open', !isOpen);
    localStorage.setItem(MP.LS_INPUT_COLLAPSED, isOpen ? 'true' : 'false');
  });

  document.getElementById('btn-import-audio').addEventListener('click', function() {
    document.getElementById('audio-file-input').click();
  });
  document.getElementById('audio-file-input').addEventListener('change', function() {
    if (this.files.length > 0) MP.importAudioFile(this.files[0]);
    this.value = '';
  });
  document.getElementById('btn-mic-record').addEventListener('click', function() {
    if (MP.appState.micRecording) MP.stopMicRecording();
    else MP.startMicRecording();
  });
  document.getElementById('import-modal').addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
  });
  document.getElementById('btn-midi').addEventListener('click', function() { MP.initMIDI(); });
  var savedBaud = localStorage.getItem(MP.LS_SERIAL_BAUD);
  if (savedBaud) document.getElementById('baud-select').value = savedBaud;
  var savedPin = localStorage.getItem(MP.LS_BUZZER_PIN);
  if (savedPin) document.getElementById('buzzer-pin').value = savedPin;
  document.getElementById('baud-select').addEventListener('change', function(e) {
    localStorage.setItem(MP.LS_SERIAL_BAUD, e.target.value);
  });
  document.getElementById('buzzer-pin').addEventListener('change', function(e) {
    localStorage.setItem(MP.LS_BUZZER_PIN, e.target.value);
  });
  var serialSetupModal = document.getElementById('serial-setup-modal');
  document.getElementById('btn-serial-setup').addEventListener('click', function() {
    document.getElementById('serial-sketch').value = MP.getSerialSketch();
    serialSetupModal.style.display = '';
  });
  document.getElementById('serial-setup-close').addEventListener('click', function() {
    serialSetupModal.style.display = 'none';
  });
  serialSetupModal.addEventListener('click', function(e) {
    if (e.target === serialSetupModal) serialSetupModal.style.display = 'none';
  });
  document.getElementById('serial-sketch-copy').addEventListener('click', function() {
    MP.copyToClipboard('serial-sketch', this, '&#128203; Copy sketch');
  });
  document.getElementById('btn-serial').addEventListener('click', function() {
    if (MP._serialPort) MP.disconnectSerial();
    else MP.initSerial();
  });
  document.getElementById('btn-octave-down').addEventListener('click', function() {
    MP.transposeSequence(-1);
    if (MP.appState.kbOctave > 0) { MP.appState.kbOctave--; MP.updateKeyBindingLabels(); MP.scrollKbToOctave(); }
  });
  document.getElementById('btn-octave-up').addEventListener('click', function() {
    MP.transposeSequence(1);
    if (MP.appState.kbOctave < 8) { MP.appState.kbOctave++; MP.updateKeyBindingLabels(); MP.scrollKbToOctave(); }
  });
}

function setupFileHandling() {
  var RTTTL_RE = /^[^:]+:\s*[dob]=\d+.*:.+$/;
  function loadRtttlFiles(input) {
    var files = [...input.files].filter(function(f) { return f.name.endsWith('.rtttl') || f.name.endsWith('.txt'); });
    if (files.length === 0) { MP.showToast('No .rtttl or .txt files found', true); return; }
    var loaded = 0, skipped = 0, dupes = 0;
    var seen = new Set();
    var customs = [];
    Promise.all(files.map(function(f) { return f.text(); })).then(function(contents) {
      contents.forEach(function(text) {
        var line = text.split('\n')[0].trim();
        if (!RTTTL_RE.test(line)) { skipped++; return; }
        if (seen.has(line)) { dupes++; return; }
        seen.add(line);
        customs.push(line);
        loaded++;
      });
      if (loaded > 0) {
        MP._addCustomPresets(customs);
        var msg = 'Loaded ' + loaded + ' melody' + (loaded !== 1 ? 's' : '');
        if (dupes > 0) msg += ', ' + dupes + ' duplicate' + (dupes !== 1 ? 's' : '');
        if (skipped > 0) msg += ', ' + skipped + ' invalid';
        MP.showToast(msg);
      } else {
        MP.showToast('No valid RTTTL files found', true);
      }
    });
    input.value = '';
  }
  var rtttlDirInput = document.getElementById('rtttl-dir-input');
  var rtttlFileInput = document.getElementById('rtttl-file-input');
  document.getElementById('btn-load-rtttls').addEventListener('click', function(e) {
    if (e.shiftKey) rtttlDirInput.click();
    else rtttlFileInput.click();
  });
  rtttlDirInput.addEventListener('change', function() { loadRtttlFiles(rtttlDirInput); });
  rtttlFileInput.addEventListener('change', function() { loadRtttlFiles(rtttlFileInput); });

  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });

  document.body.addEventListener('dragover', function(e) {
    e.preventDefault();
    document.body.classList.add('drag-overlay');
  });
  document.body.addEventListener('dragleave', function(e) {
    if (e.relatedTarget === null || !document.body.contains(e.relatedTarget)) {
      document.body.classList.remove('drag-overlay');
    }
  });
  document.body.addEventListener('drop', function(e) {
    e.preventDefault();
    document.body.classList.remove('drag-overlay');
    var audioExts = ['.wav', '.mp3', '.ogg', '.m4a', '.flac', '.aac'];
    var droppedAudio = [...e.dataTransfer.files].filter(function(f) {
      return audioExts.some(function(ext) { return f.name.toLowerCase().endsWith(ext); });
    });
    if (droppedAudio.length > 0) {
      MP.importAudioFile(droppedAudio[0]);
      return;
    }
    var files = [...e.dataTransfer.files].filter(function(f) { return f.name.endsWith('.rtttl') || f.name.endsWith('.txt'); });
    if (files.length === 0) return;
    if (files.length === 1) {
      files[0].text().then(function(text) {
        var line = text.split('\n')[0].trim();
        if (!RTTTL_RE.test(line)) { MP.showToast('Invalid RTTTL file', true); return; }
        var result = MP.loadRTTTL(line);
        if (!result) { MP.showToast('Failed to parse RTTTL', true); return; }
        MP.showToast('Loaded "' + result.name + '" (' + MP.appState.seq.length + ' notes)');
      });
    } else {
      var loaded = 0, skipped = 0;
      var seen = new Set();
      var customs = [];
      Promise.all(files.map(function(f) { return f.text(); })).then(function(contents) {
        contents.forEach(function(text) {
          var line = text.split('\n')[0].trim();
          if (!RTTTL_RE.test(line)) { skipped++; return; }
          if (seen.has(line)) return;
          seen.add(line);
          customs.push(line);
          loaded++;
        });
        if (loaded > 0) {
          MP._addCustomPresets(customs);
          MP.showToast('Dropped ' + loaded + ' melody' + (loaded !== 1 ? 's' : ''));
        } else {
          MP.showToast('No valid RTTTL files found', true);
        }
      });
    }
  });
}

function setupAutoRestore() {
  if (MP.autoLoad()) {
    MP.setBpm(document.getElementById('bpm').value);
    document.getElementById('pr-zoom-input').value = Math.round(MP.appState.prZoom * 100) + '%';
    MP.updateKeyBindingLabels(true);
    var durBtn = document.querySelector('.dur-btn[data-dur="' + MP.appState.selectedDur + '"]');
    if (durBtn) {
      document.querySelectorAll('.dur-btn').forEach(function(b) { b.classList.remove('active'); });
      durBtn.classList.add('active');
    }
    if (MP.appState.melodyName) {
      document.getElementById('melody-name').textContent = MP.appState.melodyName;
      var si = document.getElementById('melody-search');
      si.placeholder = MP.appState.melodyName;
      si.parentElement.dataset.tip = MP.appState.melodyName;
    }
    document.getElementById('btn-snap').classList.toggle('active', MP.appState.snapEnabled);
    if (MP.appState.timeSig) {
      document.getElementById('time-sig').value = MP.appState.timeSig.beats + '/' + MP.appState.timeSig.value;
    }
    MP.updateSequence();
  }

  if (MP.appState.currentView === 'roll') {
    MP.renderPianoRoll();
    if (MP.appState.playState) MP.startPlayhead();
  }

  var prLastH = 0, prResizePending = false;
  var prContainer = document.getElementById('piano-roll');
  new ResizeObserver(function(entries) {
    var h = entries[0].contentRect.height;
    if (Math.abs(h - prLastH) < MP.PR_ROW_H) return;
    prResizePending = true;
  }).observe(prContainer);
  document.addEventListener('mouseup', function() {
    if (!prResizePending) return;
    prResizePending = false;
    prLastH = prContainer.clientHeight;
    if (MP.appState.currentView === 'roll') {
      MP.renderPianoRoll();
      if (MP.appState.playState) MP.startPlayhead();
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-tip]').forEach(function(el) {
    el.dataset.tip = el.dataset.tip.replace(/Mod\+/g, MP.MOD_KEY + '+');
  });
  document.querySelectorAll('kbd').forEach(function(el) {
    el.textContent = el.textContent.replace(/Mod\+/g, MP.MOD_KEY + '+');
  });
  document.getElementById('app-version').textContent = 'BuzzCraft ' + MP.VERSION;
  MP.initKeyboard();
  MP.dancingCat.init();
  setupDurationControls();
  setupPlaybackControls();
  setupPianoRollControls();
  setupBpmControls();
  setupOutputControls();
  setupMelodyPresets();
  setupThemeAndSettings();
  setupFileHandling();
  setupAutoRestore();
});
