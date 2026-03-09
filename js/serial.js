MP._serialPort = null;
MP._serialWriter = null;

MP.initSerial = async function() {
  if (!navigator.serial) {
    MP.showToast('Web Serial not supported (requires Chromium browser)', true);
    return;
  }
  try {
    var port = await navigator.serial.requestPort();
    var baud = parseInt(document.getElementById('baud-select').value) || 115200;

    if (port.readable || port.writable) {
      try { await port.close(); } catch (e) {}
    }

    await port.open({ baudRate: baud });
    MP._serialPort = port;
    MP._serialWriter = port.writable.getWriter();
    var btn = document.getElementById('btn-serial');
    btn.classList.add('active');
    btn.textContent = 'Disconnect';
    localStorage.setItem(MP.LS_SERIAL_BAUD, baud);
    MP.showToast('Serial connected at ' + baud + ' baud');
  } catch (err) {
    if (err.name === 'NotFoundError') return;
    MP.showToast('Serial failed — check if another app (Arduino IDE, PuTTY) is using this port', true);
  }
};

MP.disconnectSerial = async function() {
  if (!MP._serialPort) return;
  try {
    if (MP._serialWriter) {
      MP._serialWriter.releaseLock();
      MP._serialWriter = null;
    }
    await MP._serialPort.close();
  } catch (e) {}
  MP._serialPort = null;
  var btn = document.getElementById('btn-serial');
  btn.classList.remove('active');
  btn.textContent = 'Connect';
  MP.showToast('Serial disconnected');
};

MP.getSerialSketch = function() {
  var pin = (document.getElementById('buzzer-pin').value || '5').replace(/\D/g, '') || '5';
  var baud = document.getElementById('baud-select').value || '115200';
  return '#define BUZZER_PIN ' + pin + '\n\n' +
    'void setup() {\n' +
    '  Serial.begin(' + baud + ');\n' +
    '  pinMode(BUZZER_PIN, OUTPUT);\n' +
    '}\n\n' +
    'void loop() {\n' +
    '  if (Serial.available()) {\n' +
    '    String line = Serial.readStringUntil(\'\\n\');\n' +
    '    if (line.startsWith("T,")) {\n' +
    '      int c1 = line.indexOf(\',\');\n' +
    '      int c2 = line.indexOf(\',\', c1 + 1);\n' +
    '      int freq = line.substring(c1 + 1, c2).toInt();\n' +
    '      int dur = line.substring(c2 + 1).toInt();\n' +
    '      if (freq > 0) {\n' +
    '        tone(BUZZER_PIN, freq, dur * ' + MP.TONE_DUTY + ');\n' +
    '      } else {\n' +
    '        noTone(BUZZER_PIN);\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '}\n';
};

MP.sendSerialNote = function(freq, durationMs) {
  if (!MP._serialWriter) return;
  var cmd = 'T,' + freq + ',' + Math.round(durationMs) + '\n';
  var encoder = new TextEncoder();
  MP._serialWriter.write(encoder.encode(cmd)).catch(() => {});
};
