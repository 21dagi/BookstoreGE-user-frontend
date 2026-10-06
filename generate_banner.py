import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Paths
INPUT_LOGO = r"C:\Users\dagma\.gemini\antigravity-ide\brain\df54d7bc-fd55-4ccb-87b5-df74b3de4a14\.user_uploaded\media_1791278928542.jpg"
PUBLIC_DIR = r"c:\Users\dagma\OneDrive\Documents\Start-up Projects\Book-store-Gedame_Eyesus\customer-frontend\public"
os.makedirs(PUBLIC_DIR, exist_ok=True)

# 1. Save pristine logo copy in public/
logo_img = Image.open(INPUT_LOGO).convert("RGBA")
logo_img.save(os.path.join(PUBLIC_DIR, "app-logo.png"))
logo_img.convert("RGB").save(os.path.join(PUBLIC_DIR, "app-logo.jpg"), quality=95)

# Dimensions for Telegram Mini App banner: 640x360
WIDTH, HEIGHT = 640, 360

# Load Ethiopic font
font_path = "C:/Windows/Fonts/nyala.ttf"
title_font = ImageFont.truetype(font_path, 32)
subtitle_font = ImageFont.truetype(font_path, 20)
badge_font = ImageFont.truetype(font_path, 15)

def create_horizontal_banner():
    # Background: Deep liturgical crimson with subtle warm glow
    img = Image.new("RGBA", (WIDTH, HEIGHT), (45, 6, 12, 255))
    draw = ImageDraw.Draw(img)

    # Gradient background
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(55 + (85 - 55) * (1 - ratio))
        g = int(8 + (18 - 8) * (1 - ratio))
        b = int(18 + (30 - 18) * (1 - ratio))
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b, 255))

    # Decorative inner gold border
    gold = (212, 175, 55, 230)
    gold_dim = (180, 140, 45, 120)
    draw.rounded_rectangle([12, 12, WIDTH - 12, HEIGHT - 12], radius=16, outline=gold_dim, width=1)
    draw.rounded_rectangle([16, 16, WIDTH - 16, HEIGHT - 16], radius=14, outline=gold, width=2)

    # Left: Process logo as crisp circular medallion
    logo_size = 230
    resized_logo = logo_img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

    # Circular mask
    mask = Image.new("L", (logo_size, logo_size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, logo_size, logo_size), fill=255)

    # Medallion position
    logo_x = 42
    logo_y = (HEIGHT - logo_size) // 2

    # Outer gold halo behind logo
    halo_size = logo_size + 14
    halo_x = logo_x - 7
    halo_y = logo_y - 7
    draw.ellipse([halo_x, halo_y, halo_x + halo_size, halo_y + halo_size], outline=(235, 195, 75, 255), width=3)

    # White circular base for logo transparency clarity
    white_base = Image.new("RGBA", (logo_size, logo_size), (255, 255, 255, 255))
    img.paste(white_base, (logo_x, logo_y), mask)
    img.paste(resized_logo, (logo_x, logo_y), mask)

    # Right side: Text block
    text_x = 295
    
    # Title: ኮከበ ሃይማኖት ንዋየ ቅዱሳት
    title_text = "ኮከበ ሃይማኖት ንዋየ ቅዱሳት"
    # Subtitle: የገዳመ ኢየሱስ ቤተክርስቲያን
    sub_text = "የገዳመ ኢየሱስ ቤተክርስቲያን መደብር"
    # Secondary: Ethiopian Orthodox Tewahedo Church
    tewahedo_text = "በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ"
    
    draw.text((text_x, 70), tewahedo_text, font=badge_font, fill=(225, 190, 110, 240))
    draw.text((text_x, 100), title_text, font=title_font, fill=(255, 248, 235, 255))
    draw.text((text_x, 155), sub_text, font=subtitle_font, fill=(235, 215, 190, 240))

    # Decorative divider
    draw.line([(text_x, 195), (WIDTH - 45, 195)], fill=(195, 155, 60, 160), width=1)

    # Features pill / tags
    tags = "መጻሕፍት  ·  ንዋያተ ቅድሳት  ·  መጽሐፍ እቁብ"
    # Draw pill box
    pill_box = [text_x, 218, WIDTH - 45, 258]
    draw.rounded_rectangle(pill_box, radius=8, fill=(35, 4, 10, 200), outline=gold_dim, width=1)
    draw.text((text_x + 16, 226), tags, font=badge_font, fill=(245, 225, 175, 255))

    # Bot / Mini app tag
    draw.text((text_x, 280), "Gedame Eyesus Bookstore Official Mini App", font=ImageFont.truetype(font_path, 13), fill=(185, 160, 140, 200))

    out_png = os.path.join(PUBLIC_DIR, "telegram-banner-640x360.png")
    out_jpg = os.path.join(PUBLIC_DIR, "telegram-banner-640x360.jpg")
    img.save(out_png)
    img.convert("RGB").save(out_jpg, quality=98)
    print("Horizontal banner saved to", out_png)

def create_centered_banner():
    # Centered design (clean logo focus)
    img = Image.new("RGBA", (WIDTH, HEIGHT), (251, 248, 244, 255)) # Warm parchment paper
    draw = ImageDraw.Draw(img)

    # Border
    crimson = (122, 35, 48, 255)
    gold = (185, 135, 40, 220)
    draw.rounded_rectangle([10, 10, WIDTH - 10, HEIGHT - 10], radius=16, outline=crimson, width=2)
    draw.rounded_rectangle([14, 14, WIDTH - 14, HEIGHT - 14], radius=13, outline=gold, width=1)

    # Center Logo
    logo_size = 210
    resized_logo = logo_img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    logo_x = (WIDTH - logo_size) // 2
    logo_y = 30
    
    # Circular mask
    mask = Image.new("L", (logo_size, logo_size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, logo_size, logo_size), fill=255)
    img.paste(resized_logo, (logo_x, logo_y), mask)

    # Title underneath
    title_text = "ኮከበ ሃይማኖት ንዋየ ቅዱሳት"
    bbox = draw.textbbox((0, 0), title_text, font=title_font)
    tw = bbox[2] - bbox[0]
    draw.text(((WIDTH - tw) // 2, 250), title_text, font=title_font, fill=crimson)

    sub_text = "የመንፈሳዊ መጻሕፍትና የንዋያተ ቅድሳት መደብር"
    s_bbox = draw.textbbox((0, 0), sub_text, font=subtitle_font)
    sw = s_bbox[2] - s_bbox[0]
    draw.text(((WIDTH - sw) // 2, 298), sub_text, font=subtitle_font, fill=(99, 88, 91, 255))

    out_png = os.path.join(PUBLIC_DIR, "telegram-banner-centered-640x360.png")
    out_jpg = os.path.join(PUBLIC_DIR, "telegram-banner-centered-640x360.jpg")
    img.save(out_png)
    img.convert("RGB").save(out_jpg, quality=98)
    print("Centered banner saved to", out_png)

create_horizontal_banner()
create_centered_banner()
print("All banners generated successfully!")
