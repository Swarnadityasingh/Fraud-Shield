import os
from PIL import Image

SOURCE = "branding/fraudshield-primary.png"
OUTPUT = "Frontend/public/branding"

os.makedirs(OUTPUT, exist_ok=True)

if not os.path.exists(SOURCE):
    raise FileNotFoundError(f"Image not found: {SOURCE}")

img = Image.open(SOURCE).convert("RGB")

sizes = {
    "favicon-16.png": (16, 16),
    "favicon-32.png": (32, 32),
    "app-icon.png": (512, 512),
}

for filename, size in sizes.items():
    resized = img.resize(size, Image.Resampling.LANCZOS)
    resized.save(os.path.join(OUTPUT, filename), optimize=True)

print("FraudShield branding assets exported successfully!")
