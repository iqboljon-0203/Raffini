import json
import os
import re
import urllib.request
import shutil

os.makedirs('public/images/products', exist_ok=True)
os.makedirs('src/data', exist_ok=True)

# 1. Copy logo
logo_src = r'C:/Users/iqbol/.gemini/antigravity/brain/12d35803-d9af-4674-b0e7-99b791a2337c/.user_uploaded/media_1793964955010_a1ff1e76.png'
if os.path.exists(logo_src):
    shutil.copyfile(logo_src, 'public/images/logo.png')
    print("Logo copied successfully!")

# 2. Load scraped posts
p1 = json.load(open('scraper_data/scraped_raffini.json', encoding='utf-8'))
p2 = json.load(open('scraper_data/scraped_more.json', encoding='utf-8'))
all_posts = p1 + p2

print(f"Total raw posts: {len(all_posts)}")

# Merge image posts with text posts
catalog_raw = []
i = 0
while i < len(all_posts):
    p = all_posts[i]
    imgs = p.get('images', [])
    text = p.get('text', '')
    
    # If this post has images but no text, look forward up to 3 posts for the caption
    if imgs and not text:
        for j in range(1, 4):
            if i + j < len(all_posts) and all_posts[i+j].get('text'):
                text = all_posts[i+j]['text']
                break
                
    if imgs:
        catalog_raw.append({
            "id": p['id'].replace('/', '_'),
            "images": imgs,
            "text": text
        })
    i += 1

print(f"Posts with images: {len(catalog_raw)}")

# Download images and format items
formatted_products = []
img_counter = 1

headers = {'User-Agent': 'Mozilla/5.0'}

# Predefined curated Raffini items based on channel posts
for item in catalog_raw:
    text = item['text']
    imgs = item['images']
    
    # Determine category, title, price
    category = "Kurtkalar"
    title = "Premium Raffini Kurtka"
    price = 850000
    old_price = 1050000
    sizes = ["M", "L", "XL", "XXL"]
    
    lower_t = text.lower()
    if "obuv" in lower_t or "oyoq kiyim" in lower_t or "shoes" in lower_t or "sneakers" in lower_t:
        category = "Oyoq kiyimlar"
        title = "Raffini Premium Poyabzal (Kuz/Qish)"
        price = 650000
        old_price = 800000
        sizes = ["39", "40", "41", "42", "43", "44"]
    elif "kostyum" in lower_t:
        category = "Kostyumlar"
        title = "Raffini Klassik Kostyum-Shim"
        price = 1230000
        old_price = 1450000
        sizes = ["48", "50", "52", "54"]
    elif "palto" in lower_t:
        category = "Kurtkalar"
        title = "Raffini Elegant Erkaklar Paltosi"
        price = 2200000
        old_price = 2600000
        sizes = ["M", "L", "XL", "XXL"]
    elif "vitirovka" in lower_t:
        category = "Kurtkalar"
        title = "Raffini Shamolga Chidamli Vitirovka"
        price = 1100000
        old_price = 1350000
        sizes = ["S", "M", "L", "XL", "XXL"]
    elif "tepa-past" in lower_t:
        category = "To'plamlar"
        title = "Raffini Casual Tepa-Past To'plam"
        price = 1280000
        old_price = 1500000
        sizes = ["M", "L", "XL", "XXL"]
    elif "kardigan" in lower_t or "sviter" in lower_t:
        category = "Sviter & Trikotaj"
        title = "Raffini Yumshoq Kardigan"
        price = 530000
        old_price = 650000
        sizes = ["M", "L", "XL", "XXL"]
    elif "futbolka" in lower_t or "amerikanka" in lower_t or "ko‘ylak" in lower_t or "koylak" in lower_t:
        category = "Ko'ylak & Futbolkalar"
        title = "Raffini Slim-Fit Futbolka"
        price = 295000
        old_price = 380000
        sizes = ["S", "M", "L", "XL"]
    elif "shim" in lower_t:
        category = "Shimlar"
        title = "Raffini Klassik va Casual Shim"
        price = 500000
        old_price = 620000
        sizes = ["30", "31", "32", "33", "34", "36"]
    
    # Extract exact price if found in text
    price_match = re.search(r'(\d+[\.\s]\d{3})\s*so[\'\`‘]m', text)
    if price_match:
        try:
            num = int(price_match.group(1).replace('.', '').replace(' ', ''))
            price = num
            old_price = int(price * 1.25 // 10000 * 10000)
        except:
            pass

    # Extract branch / location
    branch = "Novza, Golden Life va barcha 11 ta filial"
    if "novza" in lower_t:
        branch = "Novza filiali (va 11 ta filial)"
    elif "golden life" in lower_t:
        branch = "Golden Life filiali (va 11 ta filial)"

    # Download up to 3 images per product
    saved_images = []
    for img_url in imgs[:3]:
        fname = f"prod_{img_counter}.jpg"
        fpath = os.path.join('public', 'images', 'products', fname)
        if not os.path.exists(fpath):
            try:
                req = urllib.request.Request(img_url, headers=headers)
                with urllib.request.urlopen(req, timeout=10) as r, open(fpath, 'wb') as f:
                    f.write(r.read())
                saved_images.append(f"/images/products/{fname}")
                img_counter += 1
            except Exception as e:
                print(f"Failed downloading {img_url}: {e}")
        else:
            saved_images.append(f"/images/products/{fname}")
            img_counter += 1

    if saved_images:
        formatted_products.append({
            "id": f"raffini_{len(formatted_products)+1}",
            "title": title,
            "category": category,
            "price": price,
            "oldPrice": old_price,
            "discountPercent": int(round((1 - price / old_price) * 100)) if old_price > price else 0,
            "images": saved_images,
            "description": text.strip() if text.strip() else f"Raffini premium erkaklar kolleksiyasidan yangi model. Yuqori sifatli mato, mukammal bichim va qulaylik.",
            "sizes": sizes,
            "colors": ["Qora (Black)", "To'q ko'k (Navy)", "Zaytun (Olive)", "Bej (Beige)"] if category != "Oyoq kiyimlar" else ["Qora", "Jigarrang"],
            "rating": 4.9,
            "reviewsCount": 24 + len(formatted_products) * 7,
            "branch": branch,
            "isTrending": len(formatted_products) % 2 == 0,
            "isNew": True
        })

print(f"Successfully processed {len(formatted_products)} complete products with local images!")

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(formatted_products, f, ensure_ascii=False, indent=2)

