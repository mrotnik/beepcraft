import os, json, glob, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))

def read(path):
    full = os.path.join(ROOT, path)
    if not os.path.isfile(full):
        print(f'Error: missing file {path}', file=sys.stderr)
        sys.exit(1)
    with open(full, 'r', encoding='utf-8') as f:
        return f.read()

css_files = ['css/base.css', 'css/controls.css', 'css/keyboard.css', 'css/piano-roll.css', 'css/chips.css', 'css/dark.css']
js_files = ['js/state.js', 'js/constants.js', 'js/duration.js', 'js/audio.js', 'js/audio-import.js', 'js/rtttl.js', 'js/codegen.js', 'js/ui.js', 'js/sfx.js', 'js/dancing-cat.js', 'js/playback.js', 'js/keyboard.js', 'js/piano-roll.js', 'js/chips.js', 'js/midi.js', 'js/serial.js', 'js/main.js']

css = '\n'.join(read(f) for f in css_files)
js = '\n'.join(read(f) for f in js_files)

rtttl_files = sorted(glob.glob(os.path.join(ROOT, 'melodies', '*.rtttl')))
melodies = []
for f in rtttl_files:
    with open(f, 'r') as fh:
        melodies.append(fh.read().strip())

melodies_json_path = os.path.join(ROOT, 'melodies', 'melodies.json')
with open(melodies_json_path, 'w', encoding='utf-8') as f:
    json.dump(melodies, f)

js = re.sub(
    r"fetch\('melodies/melodies\.json'\)\s*\.then\(function\(r\)\s*\{\s*return\s+r\.json\(\);\s*\}\)",
    "Promise.resolve(window.__BUNDLED_MELODIES__)",
    js
)

html = read('index.html')
html = re.sub(r'<link\s+rel="stylesheet"\s+href="css/[^"]+"\s*/?>\s*\n?', '', html)
html = re.sub(r'<script\s+src="js/[^"]+"\s*>\s*</script>\s*\n?', '', html)

safe_css = css.replace('</style', '<\\/style').replace('</script', '<\\/script')
safe_js = js.replace('</script', '<\\/script').replace('</style', '<\\/style')
safe_melodies = json.dumps(melodies).replace('</script', '<\\/script').replace('</style', '<\\/style')

html = html.replace('</head>', '<style>\n' + safe_css + '\n</style>\n</head>')
html = html.replace('</body>',
    '<script>\nwindow.__BUNDLED_MELODIES__ = ' + safe_melodies + ';\n</script>\n' +
    '<script>\n' + safe_js + '\n</script>\n</body>')

out = os.path.join(ROOT, 'beepcraft.html')
with open(out, 'w', encoding='utf-8') as f:
    f.write(html)

print(f'Built {out}')
print(f'  {len(css_files)} CSS, {len(js_files)} JS, {len(melodies)} melodies')
