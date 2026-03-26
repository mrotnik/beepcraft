<div align="center">

# 🎵 BeepCraft

**Browser-based melody composer for Arduino buzzers**

Create melodies with a piano keyboard and piano roll editor, then export as Arduino C++ code or RTTTL notation.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Try_It_Now-blue?style=for-the-badge)](https://mrotnik.github.io/beepcraft/)

*Single file · No install · Works offline*

</div>

---

![Piano roll editor](screenshots/01.png)

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎵 Compose
- 🎹 **Piano keyboard** — mouse, touch, or computer keys
- 🎼 **Piano roll editor** — drag, resize, clone, multi-select
- 🧩 **Chip view** — simplified horizontal display
- ⏺️ **Recording mode** — auto-detect duration from key hold
- 🎶 **57 preset melodies** — search and load classic tunes

</td>
<td width="50%">

### 📤 Export
- 📟 **Arduino C++** — `tone()`/`noTone()` for any board (ESP32, STM32, RP2040, ATmega, etc.)
- 🐍 **MicroPython** — PWM-based codegen for ESP32/RP2040
- 📱 **RTTTL** — standard ringtone format, paste/drop to import
- 🎵 **MIDI export** — download as Standard MIDI file
- 🔌 **Serial upload** — send directly to Arduino (Chromium)

</td>
</tr>
<tr>
<td>

### 🎛️ Input
- 🎛️ **MIDI keyboard** — plug and play
- 🎹 **MIDI file import** — drop .mid files to load melodies
- 📂 **Audio import** — extract melody from WAV/MP3/OGG
- 🎙️ **Mic recording** — real-time pitch detection

</td>
<td>

### ⚡ Playback & UX
- ▶️ **Playback** — loop, pause/resume, metronome, tap tempo, time signatures
- ↩️ **Undo/redo** — copy/paste, octave transpose, duplicate (Ctrl+D), merge (Ctrl+M)
- 🌗 **Dark/light theme**
- 📁 **Zero dependencies** — no server needed

</td>
</tr>
</table>

## 🚀 Quick Start

**[Use online](https://mrotnik.github.io/beepcraft/)** — nothing to install

**Run offline** — [download beepcraft.html](https://raw.githubusercontent.com/mrotnik/beepcraft/public/beepcraft.html) (right-click → Save As) and open in your browser. It's a single self-contained file — easy to share with friends.

**How it works:** Play notes on the keyboard or piano roll → copy the generated Arduino code → upload to your board

### 🔌 Arduino Wiring

Connect a **passive** buzzer to your board. For 3-pin modules: VCC to 3.3V/5V, GND to GND, signal to any GPIO pin (default: pin 5). For bare 2-pin buzzers: one pin to GPIO, the other to GND. Active buzzers have a fixed pitch and won't play melodies. The generated code uses the standard `tone()` API.

## 📸 Screenshots

<details>
<summary>Click to expand</summary>

![Piano roll and Arduino C++ output](screenshots/02.png)

![RTTTL output](screenshots/03.png)

![SFX Generator](screenshots/06.png)

![Serial Setup](screenshots/05.png)

![Keyboard shortcuts](screenshots/04.png)

</details>

## 🔊 SFX Generator

Built-in sound effects engine for passive buzzers. 56 presets across game, animal, machine, nature, sci-fi, and musical categories. 11 frequency curves (linear, exponential, pingpong, stairs, wobble, bounce, logarithmic, s-curve, sawtooth, noise, random). Drag graph dots to fine-tune frequency and timing, double-click to add/remove grains. Export as WAV, copy as standalone Arduino/MicroPython function, or insert directly into your melody.

## 🛠️ Development

Plain HTML/JS/CSS with zero dependencies. Source files are modular:

```
js/          17 modules (state, constants, audio, audio-import, rtttl, codegen, sfx, ui, ...)
css/         6 stylesheets (base, controls, keyboard, piano-roll, chips, dark)
melodies/    57 RTTTL preset files
index.html   main HTML
bundle.py    build script
```

### Build

```bash
python bundle.py
```

Concatenates all JS/CSS, inlines melody presets, and produces `beepcraft.html` — a single self-contained file.

### Architecture

All JS modules attach to the `window.MP` namespace (no ES modules, no bundler toolchain). Files are concatenated in dependency order by `bundle.py`.

Notes are stored as timeline objects `{ name, freq, start, dur }` where `start` and `dur` are in beats (quarter note = 1 beat).

> **Note:** Edit files in `js/`, `css/`, and `index.html` — never edit `beepcraft.html` directly.

---

If BeepCraft helped you make some noise, consider leaving a ⭐ to support the project!

## 🙏 Credits

- Preset melodies from [rtttl.js](https://github.com/1j01/rtttl.js) by Isaiah Odhner (MIT License)

## 📄 License

[GNU GPLv3](LICENSE)
