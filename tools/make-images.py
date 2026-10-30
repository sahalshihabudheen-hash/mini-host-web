"""Generate the responsive image variants the site actually serves.

The originals are 1920x1080 phone-camera renders of Minecraft builds. They were used
for everything: the desktop hero, the phone hero, the 74px carousel thumbnails and the
gallery grid, so a phone downloaded ~4.4 MB of banner art and `cover` cropped an
arbitrary 27% vertical slice out of the middle of each frame.

Outputs (all under public/images, originals kept for the lightbox):
  hero/    1600x900  desktop banner
  hero-m/  920x1080  phone banner (see the aspect-ratio note below)
  card/    640x360   gallery grid tile
  thumb/   224x126   carousel rail thumbnail

FOCUS picks the horizontal band for the phone crop per image: 0.0 is flush left,
1.0 flush right, 0.5 centred. Judged from _scratch/mobile-crops.png, because edge
density alone keeps picking busy foliage instead of the subject.
"""
import os
from PIL import Image

SRC = "public/images"
NAMES = [
    "minecart-tunnel", "petting-wolves", "riding-the-dragon", "the-night",
    "friends-night", "fight", "getting-ready", "friend-with-cow", "ambush", "night-desk",
]

FOCUS = {
    "the-night": 0.30,        # player with the torch sits left of centre
    "getting-ready": 0.25,    # archer is the subject; the robot is off to the right
    "petting-wolves": 0.45,   # keep the wolf's head in frame with the player
    "fight": 0.45,
}

MOBILE = (920, 1080)
# The phone hero box is sized to this exact aspect ratio in styles.css, so `cover`
# stops cropping and the whole 920x1080 scene region is shown at ~1:1 device pixels.
# Any taller full-bleed box would re-introduce the slice: under `cover` the visible
# source width is (box_w / box_h) * 1080, so a 344x866 box always shows 429px (22%)
# of a 1920-wide frame no matter which file is served. Only the box aspect can change it.
DESKTOP = (1600, 900)
CARD = (640, 360)
THUMB = (224, 126)
QUALITY = {"hero": 74, "hero-m": 70, "card": 68, "thumb": 62}


def ensure(d):
    os.makedirs(os.path.join(SRC, d), exist_ok=True)


for d in QUALITY:
    ensure(d)

print(f"{'image':20s} {'focus':>6} {'desktop':>10} {'mobile':>10} {'card':>8} {'thumb':>7}")
totals = {k: 0 for k in QUALITY}

for name in NAMES:
    im = Image.open(os.path.join(SRC, name + ".jpg")).convert("RGB")
    w, h = im.size
    sizes = {}

    # Phone: take a native-resolution band, so no resampling happens at all.
    mw, mh = MOBILE
    band = int(round(mw * h / mh))
    band = min(band, w)
    max_x = w - band
    x = int(round(max_x * FOCUS.get(name, 0.5)))
    mobile = im.crop((x, 0, x + band, h)).resize((mw, mh), Image.LANCZOS) if band != mw else im.crop((x, 0, x + band, h))

    for kind, img in (
        ("hero", im.resize(DESKTOP, Image.LANCZOS)),
        ("hero-m", mobile),
        ("card", im.resize(CARD, Image.LANCZOS)),
        ("thumb", im.resize(THUMB, Image.LANCZOS)),
    ):
        out = os.path.join(SRC, kind, name + ".jpg")
        img.save(out, quality=QUALITY[kind], optimize=True, progressive=True)
        kb = os.path.getsize(out) / 1024
        sizes[kind] = kb
        totals[kind] += kb

    print(f"{name:20s} {FOCUS.get(name, 0.5):6.2f} {sizes['hero']:9.0f}K {sizes['hero-m']:9.0f}K {sizes['card']:7.0f}K {sizes['thumb']:6.0f}K")

print(f"\n{'TOTALS':20s} {'':6} {totals['hero']:9.0f}K {totals['hero-m']:9.0f}K {totals['card']:7.0f}K {totals['thumb']:6.0f}K")
print(f"originals on disk: {sum(os.path.getsize(os.path.join(SRC, n + '.jpg')) for n in NAMES)/1024/1024:.1f} MB")
