import json
import re

raw_products = json.load(open('src/data/products.json', encoding='utf-8'))

# Realistic titles, categories and prices based on the text
def refine_product(p, index):
    text = p['description']
    imgs = p['images']
    
    # default
    category = "Kurtkalar"
    title = "Raffini Premium Bomber Kurtka"
    price = 850000
    sizes = ["M", "L", "XL", "XXL"]
    
    t_lower = text.lower()
    
    # Check for specific products
    if "palto" in t_lower:
        category = "Kurtkalar & Palto"
        title = "Raffini Elegant Erkaklar Paltosi"
        price = 2200000
        sizes = ["M", "L", "XL", "XXL", "3XL"]
    elif "kostyum" in t_lower or "kostyum shim" in t_lower:
        category = "Kostyumlar"
        title = "Raffini Klassik Kostyum-Shim To'plami"
        price = 1230000
        sizes = ["48", "50", "52", "54", "56"]
    elif "obuv" in t_lower or "oyoq kiyim" in t_lower or "shoes" in t_lower:
        category = "Oyoq kiyimlar"
        title = "Raffini Zamonaviy Qishki/Kuzgi Poyabzal"
        price = 650000
        sizes = ["39", "40", "41", "42", "43", "44"]
    elif "tepa-past" in t_lower:
        category = "To'plamlar"
        title = "Raffini Tepa-Past Elegant To'plam"
        price = 1280000
        sizes = ["M", "L", "XL", "XXL"]
    elif "vitirovka" in t_lower:
        category = "Kurtkalar & Vitirovka"
        title = "Raffini Shamolga Chidamli Vitirovka"
        price = 1100000
        sizes = ["S", "M", "L", "XL", "XXL"]
    elif "kardigan" in t_lower:
        category = "Sviter & Kardigan"
        title = "Raffini Yangi Kolleksiya Kardigan"
        price = 530000
        sizes = ["M", "L", "XL", "XXL"]
    elif "sviter" in t_lower:
        category = "Sviter & Kardigan"
        title = "Raffini Premium Yumshoq Sviter"
        price = 460000
        sizes = ["M", "L", "XL", "XXL"]
    elif "amerikanka" in t_lower:
        category = "Ko'ylak & Futbolkalar"
        title = "Raffini Amerikanka Polo Futbolka"
        price = 400000
        sizes = ["S", "M", "L", "XL", "XXL"]
    elif "ko‘ylak" in t_lower or "koylak" in t_lower:
        category = "Ko'ylak & Futbolkalar"
        title = "Raffini Oq Klassik Ko'ylak"
        price = 440000
        sizes = ["S", "M", "L", "XL", "XXL"]
    elif "futbolka" in t_lower:
        category = "Ko'ylak & Futbolkalar"
        title = "Raffini Slim-Fit Premium Futbolka"
        price = 295000
        sizes = ["S", "M", "L", "XL", "XXL"]
    elif "shim" in t_lower:
        category = "Shimlar"
        title = "Raffini Klassik Slim-Fit Shim"
        price = 500000
        sizes = ["30", "31", "32", "33", "34", "36"]
    elif "kurtka" in t_lower:
        category = "Kurtkalar & Vitirovka"
        title = f"Raffini New Season Kurtka #{index+1}"
        price = 950000
        sizes = ["M", "L", "XL", "XXL"]

    # Accurate price extraction: e.g. 1.200.000 so'm, 850.000 so'm, 650.000 so'm
    # Find all prices mentioned
    price_matches = re.findall(r'(\d{1,3}(?:[\.\s]\d{3})+)\s*so[\'\`‘]m', text)
    if price_matches:
        # Take the price that matches the item category
        for pm in price_matches:
            clean_num = int(pm.replace('.', '').replace(' ', ''))
            if 100000 <= clean_num <= 5000000:
                price = clean_num
                break

    old_price = int(price * 1.25 // 10000 * 10000)
    discount = int(round((1 - price / old_price) * 100))

    colors = (
        ["Qora (Black)", "To'q jigarrang (Dark Brown)", "Oq (White)"]
        if category == "Oyoq kiyimlar"
        else ["Qora (Black)", "To'q ko'k (Navy)", "Zaytun (Olive)", "Bej (Beige)"]
    )

    return {
        "id": f"raffini_{index+1}",
        "title": title,
        "category": category,
        "price": price,
        "oldPrice": old_price,
        "discountPercent": discount,
        "images": imgs,
        "description": text.strip() if len(text.strip()) > 15 else f"RAFFINI brendining yangi kolleksiyasidan premium model. Mukammal bichim va yuqori sifatli material.",
        "sizes": sizes,
        "colors": colors,
        "rating": round(4.7 + (index % 4) * 0.1, 1),
        "reviewsCount": 18 + index * 5,
        "branch": p.get("branch", "Novza filiali (va 11 ta filial)"),
        "isTrending": index in [0, 1, 3, 5, 8, 11, 14, 18],
        "isNew": True
    }

refined = [refine_product(p, i) for i, p in enumerate(raw_products)]

ts_content = f"""import {{ Product }} from '@/types';

export const RAFFINI_PRODUCTS: Product[] = {json.dumps(refined, ensure_ascii=False, indent=2)};

export const CATEGORIES = [
  'Barchasi',
  'Kurtkalar & Vitirovka',
  'Kostyumlar',
  'Oyoq kiyimlar',
  'To\\'plamlar',
  'Sviter & Kardigan',
  'Ko\\'ylak & Futbolkalar',
  'Shimlar'
];
"""

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Generated src/data/products.ts with {len(refined)} products!")
