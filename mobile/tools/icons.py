# The Android launcher icons and splash, drawn from the game's own pixel art (the pack's yellow gem, the project's star):
# a shard over a dark night disc, scaled by whole pixels so the art stays crisp. Run: python mobile/tools/icons.py
import os
from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
ASSETS = os.path.join(ROOT, 'games', 'openworld', 'public', 'assets')
RES = os.path.join(ROOT, 'mobile', 'android', 'app', 'src', 'main', 'res')

gem = Image.open(os.path.join(ASSETS, 'na', 'Items', 'Resource', 'GemYellow.png')).convert('RGBA')
star = Image.open(os.path.join(ASSETS, 'lsw', 'Ui', 'Star.png')).convert('RGBA')
NIGHT = (14, 18, 38, 255)
GLOW = (255, 196, 92, 255)

def emblem(size: int, background: bool) -> Image.Image:
    """The shard centred on a night disc (or on nothing, for the adaptive icon's foreground)."""
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if background:
        d.ellipse([0, 0, size - 1, size - 1], fill=NIGHT)
    # the shard at a whole-pixel scale filling about half the icon (the adaptive icon's safe zone)
    k = max(1, int(size * 0.5) // gem.width)
    g = gem.resize((gem.width * k, gem.height * k), Image.NEAREST)
    halo = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    hd = ImageDraw.Draw(halo)
    r = int(g.width * 0.75)
    c = size // 2
    hd.ellipse([c - r, c - r, c + r, c + r], fill=(GLOW[0], GLOW[1], GLOW[2], 70))
    im.alpha_composite(halo)
    im.alpha_composite(g, ((size - g.width) // 2, (size - g.height) // 2))
    ks = max(1, k // 2)
    s = star.resize((star.width * ks, star.height * ks), Image.NEAREST)
    im.alpha_composite(s, (c + g.width // 2 - s.width // 2, c - g.height // 2 - s.height // 2))
    return im

SIZES = {'mdpi': 48, 'hdpi': 72, 'xhdpi': 96, 'xxhdpi': 144, 'xxxhdpi': 192}
FG = {'mdpi': 108, 'hdpi': 162, 'xhdpi': 216, 'xxhdpi': 324, 'xxxhdpi': 432}
for dpi, n in SIZES.items():
    folder = os.path.join(RES, f'mipmap-{dpi}')
    emblem(n, True).save(os.path.join(folder, 'ic_launcher.png'))
    emblem(n, True).save(os.path.join(folder, 'ic_launcher_round.png'))
    emblem(FG[dpi], False).save(os.path.join(folder, 'ic_launcher_foreground.png'))

# the adaptive icon's background: the night
with open(os.path.join(RES, 'values', 'ic_launcher_background.xml'), 'w', encoding='utf-8') as f:
    f.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0E1226</color>\n</resources>\n')

# every splash the template made: the night with the shard in its middle
for root, _, files in os.walk(RES):
    for name in files:
        if name == 'splash.png':
            p = os.path.join(root, name)
            w, h = Image.open(p).size
            sp = Image.new('RGBA', (w, h), NIGHT)
            e = emblem(min(w, h) // 2, False)
            sp.alpha_composite(e, ((w - e.width) // 2, (h - e.height) // 2))
            sp.convert('RGB').save(p)
print('icons and splashes written')
