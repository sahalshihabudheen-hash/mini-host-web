"""Build a contact sheet of candidate mobile crops so the offsets can be judged by eye.

For every hero image, the mobile viewport shows a narrow portrait band. This renders
three band candidates per image (left / centre / right) plus a desktop reference, so
the crop can be chosen from the sheet instead of guessed.
"""
import os
from PIL import Image, ImageDraw, ImageFont

SRC = "public/images"
OUT = "_scratch/mobile-crops.png"
NAMES = [
    "minecart-tunnel", "petting-wolves", "riding-the-dragon", "the-night",
    "friends-night", "fight", "getting-ready", "friend-with-cow", "ambush", "night-desk",
]

# Phone hero is roughly 390x800 CSS px -> the band of a 1080-tall source that fills it.
BAND_W = 527
BAND_H = 1080
TILE_H = 240
TILE_W = int(TILE_H * BAND_W / BAND_H)

tiles = []
for name in NAMES:
    im = Image.open(os.path.join(SRC, name + ".jpg")).convert("RGB")
    w, h = im.size
    scale = h / BAND_H
    band_src = int(BAND_W * scale)
    max_x = w - band_src
    offsets = [0, max_x // 2, max_x]
    row = []
    for frac in (0.0, 0.5, 1.0):
        x = int(max_x * frac)
        box = (x, 0, x + band_src, h)
        row.append(im.crop(box).resize((TILE_W, TILE_H), Image.LANCZOS))
    tiles.append((name, row, (w, h), band_src))

cols = 3
pad, label_h = 6, 18
sheet_w = cols * (TILE_W + pad) + pad
sheet_h = len(tiles) * (TILE_H + label_h + pad) + pad
sheet = Image.new("RGB", (sheet_w, sheet_h), (18, 20, 18))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("arial.ttf", 13)
except Exception:
    font = ImageFont.load_default()

for r, (name, row, size, band_src) in enumerate(tiles):
    y = pad + r * (TILE_H + label_h + pad)
    d.text((pad, y), f"{name}  {size[0]}x{size[1]}  band={band_src}px", fill=(240, 240, 240), font=font)
    for c, tile in enumerate(row):
        sheet.paste(tile, (pad + c * (TILE_W + pad), y + label_h))

os.makedirs("_scratch", exist_ok=True)
sheet.save(OUT)
print(OUT, sheet.size)
print("columns per row: left-most / centre / right-most band")
