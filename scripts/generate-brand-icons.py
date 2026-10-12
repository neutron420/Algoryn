import os
from PIL import Image

def generate_icons():
    # Source is the official brand logo
    logo_path = 'public/logos/algoryn-logo.png'
    if not os.path.exists(logo_path):
        print(f"Error: {logo_path} not found")
        return

    im = Image.open(logo_path).convert('RGBA')
    # Exact bounding box of rocket icon
    # (6, 6, 47, 54) -> width 41, height 48
    rocket = im.crop((6, 6, 47, 54))

    # Function to create a square canvas with centered rocket and proportional padding
    def make_square_icon(size, padding_ratio=0.15):
        canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        target_h = int(size * (1 - 2 * padding_ratio))
        target_w = int(rocket.width * (target_h / rocket.height))
        
        # High quality resampling
        resample = Image.Resampling.LANCZOS if size > 64 else Image.Resampling.BICUBIC
        resized = rocket.resize((target_w, target_h), resample)
        
        pos_x = (size - target_w) // 2
        pos_y = (size - target_h) // 2
        canvas.paste(resized, (pos_x, pos_y), resized)
        return canvas

    # 1. High-res 512x512 icons
    icon_512 = make_square_icon(512, padding_ratio=0.12)
    icon_180 = make_square_icon(180, padding_ratio=0.12)
    icon_64 = make_square_icon(64, padding_ratio=0.12)
    icon_32 = make_square_icon(32, padding_ratio=0.10)
    icon_16 = make_square_icon(16, padding_ratio=0.08)

    # Save app/icon.png and app/apple-icon.png
    os.makedirs('app', exist_ok=True)
    icon_512.save('app/icon.png', format='PNG')
    print("Saved app/icon.png (512x512)")
    
    icon_180.save('app/apple-icon.png', format='PNG')
    print("Saved app/apple-icon.png (180x180)")

    # Save public/logos/algoryn-icon.png
    icon_512.save('public/logos/algoryn-icon.png', format='PNG')
    print("Saved public/logos/algoryn-icon.png (512x512)")

    # Save public/logos/algorynlog.png for backward compatibility
    icon_512.save('public/logos/algorynlog.png', format='PNG')
    print("Saved public/logos/algorynlog.png (512x512)")

    # Save public/favicon.png
    icon_64.save('public/favicon.png', format='PNG')
    print("Saved public/favicon.png (64x64)")

    # Save multi-size public/favicon.ico
    # PIL supports saving multiple sizes in .ico format
    icon_16.save(
        'public/favicon.ico',
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
        append_images=[icon_32, make_square_icon(48, 0.10), icon_64]
    )
    print("Saved public/favicon.ico (multi-size: 16, 32, 48, 64)")

if __name__ == '__main__':
    generate_icons()
