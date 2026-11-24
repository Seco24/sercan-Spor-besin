"""Uygulama ikonlarını üretir (yalnızca bir kez çalıştırmak yeterli)."""
import sys
from PIL import Image, ImageDraw

for boyut in (192, 512):
    img = Image.new("RGB", (boyut, boyut), "#1f7a5a")
    d = ImageDraw.Draw(img)
    s = boyut / 512
    # Basit bir tabak + çatal-bıçak simgesi (maskable güvenli alan içinde)
    d.ellipse([136 * s, 136 * s, 376 * s, 376 * s], outline="white", width=int(24 * s))
    d.ellipse([196 * s, 196 * s, 316 * s, 316 * s], fill="white")
    d.rounded_rectangle([96 * s, 150 * s, 112 * s, 362 * s], radius=8 * s, fill="white")
    d.rounded_rectangle([400 * s, 150 * s, 416 * s, 362 * s], radius=8 * s, fill="white")
    img.save(f"{sys.argv[1]}/ikon-{boyut}.png")
