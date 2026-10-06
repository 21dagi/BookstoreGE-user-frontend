import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

INPUT_LOGO = r"C:\Users\dagma\.gemini\antigravity-ide\brain\df54d7bc-fd55-4ccb-87b5-df74b3de4a14\.user_uploaded\media_1791278928542.jpg"
PUBLIC_DIR = r"c:\Users\dagma\OneDrive\Documents\Start-up Projects\Book-store-Gedame_Eyesus\customer-frontend\public"

# 1200 x 630 (Universal Open Graph / Telegram Link Preview)
W, H = 1200, 630
img = Image.new("RGBA", (W, H), (23, 19, 20, 255))
draw = ImageDraw.Draw(img)

# Deep liturgical vignette / gradient
for y in range(H):
    factor = y / H
    r = int(35 + (65 - 35) * (1 - factor))
    g = int(6 + (14 - 6) * (1 - factor))
    b = int(12 + (24 - 12) * (1 - factor))
    draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

# Subtle radial warm glow near center
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
glow_draw.ellipse([200, 50, 1000, 580], fill=(122, 35, 48, 55))
glow = glow.filter(ImageFilter.GaussianBlur(60))
img = Image.alpha_composite(img, glow)
draw = ImageDraw.Draw(img)

# Ornate gold border
gold = (212, 175, 55, 230)
gold_subtle = (180, 140, 50, 90)
draw.rounded_rectangle([25, 25, W - 25, H - 25], radius=24, outline=gold_subtle, width=2)
draw.rounded_rectangle([32, 32, W - 32, H - 32], radius=20, outline=gold, width=3)

# Fonts
font_path = "C:/Windows/Fonts/nyala.ttf"
f_hero = ImageFont.truetype(font_path, 54)
f_sub = ImageFont.truetype(font_path, 32)
f_church = ImageFont.truetype(font_path, 26)
f_pill = ImageFont.truetype(font_path, 22)
f_eng = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 20)

# Left Side: Circular Medallion Emblem
logo_img = Image.open(INPUT_LOGO).convert("RGBA")
L_SIZE = 420
logo_resized = logo_img.resize((L_SIZE, L_SIZE), Image.Resampling.LANCZOS)

mask = Image.new("L", (L_SIZE, L_SIZE), 0)
m_draw = ImageDraw.Draw(mask)
m_draw.ellipse((0, 0, L_SIZE, L_SIZE), fill=255)

lx = 90
ly = (H - L_SIZE) // 2

# Outer golden halo
draw.ellipse([lx - 12, ly - 12, lx + L_SIZE + 12, ly + L_SIZE + 12], outline=(235, 195, 75, 255), width=5)
draw.ellipse([lx - 6, ly - 6, lx + L_SIZE + 6, ly + L_SIZE + 6], outline=(122, 35, 48, 255), width=3)

# White base + logo paste
w_base = Image.new("RGBA", (L_SIZE, L_SIZE), (255, 255, 255, 255))
img.paste(w_base, (lx, ly), mask)
img.paste(logo_resized, (lx, ly), mask)

# Right Side Content
rx = 570

# Church Header
church_title = "በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ የገዳመ ኢየሱስ ቤተክርስቲያን"
draw.text((rx, 115), church_title, font=f_church, fill=(225, 190, 110, 240))

# Main Title
title = "ኮከበ ሃይማኖት ንዋየ ቅዱሳት"
draw.text((rx, 160), title, font=f_hero, fill=(255, 248, 235, 255))

# Subtitle
sub = "የመንፈሳዊ መጻሕፍትና የንዋያተ ቅድሳት መደብር"
draw.text((rx, 245), sub, font=f_sub, fill=(235, 210, 185, 240))

# Gold divider
draw.line([(rx, 310), (W - 80, 310)], fill=(200, 160, 60, 180), width=2)

# Features Badge
badge_text = "ቅዱሳት መጻሕፍት  ·  ንዋያተ ቅድሳት  ·  መጽሐፍ እቁብ"
draw.rounded_rectangle([rx, 345, W - 80, 415], radius=14, fill=(50, 10, 18, 220), outline=gold, width=2)
draw.text((rx + 30, 362), badge_text, font=f_pill, fill=(255, 235, 185, 255))

# Footer: Official Telegram Mini App
eng_sub = "Official Telegram Mini App & Digital Bookstore"
draw.text((rx, 455), eng_sub, font=f_eng, fill=(200, 175, 155, 220))

out_png = os.path.join(PUBLIC_DIR, "og-bookstore-preview.png")
out_jpg = os.path.join(PUBLIC_DIR, "og-bookstore-preview.jpg")
img.save(out_png)
img.convert("RGB").save(out_jpg, quality=96)
print("1200x630 OG preview saved to", out_png)
