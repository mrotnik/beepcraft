# BuzzCraft

A browser-based melody composer for Arduino buzzers. Create melodies with a piano keyboard and piano roll editor, then export as Arduino C++ code or RTTTL notation.

Open **[buzzcraft.html](buzzcraft.html)** — single file, no install, works offline.

## Features

- **Piano keyboard** — click or use computer keys (`A S D F G H J K L ; '` for white, `W E T Y U I O [` for black)
- **Piano roll editor** — drag, resize, clone (Shift+drag), multi-select, snap-to-grid
- **Chip view** — simplified horizontal note display
- **Arduino C++ export** — generates `tone()`/`noTone()` code for any Arduino-compatible board (ESP32, STM32, RP2040, ATmega, etc.)
- **RTTTL export** — standard ringtone format, paste/drop `.rtttl` files to import
- **MIDI export** — download as Standard MIDI file
- **MIDI input** — connect a MIDI keyboard
- **Serial upload** — send notes directly to Arduino over serial (Chromium-based browsers)
- **Playback** with loop, metronome, tap tempo, time signatures (4/4, 3/4, 6/8, etc.)
- **58 preset melodies** — search and load classic tunes
- **Recording mode** — auto-detect note duration from key hold time
- **Undo/redo**, copy/paste, octave transpose
- **Works from `file://`** — no server needed

## Quick Start

1. Download or clone this repo
2. Open `buzzcraft.html` in your browser
3. Play notes on the keyboard or piano roll
4. Copy the generated Arduino code and upload to your board

### Arduino Wiring

Connect a passive buzzer between any GPIO pin (default: pin 5) and GND, with VCC to 3.3V or 5V. The generated code uses the standard `tone()` API.

## Screenshots

![Piano roll editor](screenshots/01.png)

![Piano roll and Arduino C++ output](screenshots/02.png)

![RTTTL output](screenshots/03.png)

![Keyboard shortcuts](screenshots/04.png)

![Serial Setup](screenshots/05.png)

## Development

The project is plain HTML/JS/CSS with no dependencies. Source files are modular:

```
js/          16 modules (state, constants, audio, rtttl, codegen, ui, ...)
css/         6 stylesheets (base, controls, keyboard, piano-roll, chips, dark)
melodies/    58 RTTTL preset files
index.html   main HTML
bundle.py    build script
```

### Build

```bash
python bundle.py
```

This concatenates all JS/CSS, inlines melody presets, and produces `buzzcraft.html` — a single self-contained file.

### Architecture

All JS modules attach to the `window.MP` namespace (no ES modules, no bundler toolchain). Files are concatenated in dependency order by `bundle.py`.

Notes are stored as timeline objects `{ name, freq, start, dur }` where `start` and `dur` are in beats (quarter note = 1 beat).

Edit files in `js/`, `css/`, and `index.html` — never edit `buzzcraft.html` directly.

## Credits

- Preset melodies from [rtttl.js](https://github.com/1j01/rtttl.js) by Isaiah Odhner (MIT License)

## License

[GNU GPLv3](LICENSE)
