import os
from PIL import Image

SOURCE = os.path.join("branding", "primary-emblem.png")
OUTPUT_DIR = os.path.join("Frontend", "public", "branding")

os.makedirs(OUTPUT_DIR, exist_ok=True)

if not os.path.exists(SOURCE):
    raise FileNotFoundError(f"Source image not found: {SOURCE}")

img = Image.open(SOURCE).convert("RGBA")

width, height = img.size

crop_ratio = 0.72
crop_size = int(min(width, height) * crop_ratio)

left = (width - crop_size) // 2
top = (height - crop_size) // 2

img = img.crop((
    left,
    top,
    left + crop_size,
    top + crop_size
))

def create_favicon(size, filename):
    canvas = Image.new("RGBA", (size, size), "#070D18")

    icon_size = int(size * 0.84)
    icon = img.resize(
        (icon_size, icon_size),
        Image.Resampling.LANCZOS
    )

    position = (
        (size - icon_size) // 2,
        (size - icon_size) // 2
    )

    canvas.alpha_composite(icon, position)

    canvas.save(os.path.join(OUTPUT_DIR, filename))

create_favicon(16, "favicon-16.png")
create_favicon(32, "favicon-32.png")

print("FraudShield favicons generated successfully!")
