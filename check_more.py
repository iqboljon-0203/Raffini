import json

posts = json.load(open('scraped_more.json', encoding='utf-8'))
for i, p in enumerate(posts):
    if p['text']:
        print(f"[{p['id']}] {repr(p['text'][:90])} | imgs: {len(p['images'])}")
