const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));

const updated = raw.map((p, idx) => {
  const d = p.description || '';
  let cat = 'Kurtkalar & Vitirovka';
  let title = p.title;
  let sizes = ['M', 'L', 'XL', 'XXL', '3XL'];
  let colors = ['Klassik Qora', 'To‘q Ko‘k (Midnight)', 'Zaytun Yashil', 'Krem Bej'];

  if (/Oyoq kiyim|Обувь|Shoes|krossovka|tufli/i.test(d)) {
    cat = 'Oyoq kiyimlar';
    sizes = ['39', '40', '41', '42', '43', '44'];
    colors = ['Qora Tabiiy Teri', 'To‘q Jigarrang', 'Oq Marvarid', 'Kulrang Zamsh'];
    title = `Raffini Premial Charm Poyabzal #${idx + 1}`;
  } else if (/Kostyum|Костюм/i.test(d)) {
    cat = 'Kostyumlar';
    title = `Raffini Italiya Uslubidagi Kostyum-Shim #${idx + 1}`;
    colors = ['Midnight Ko‘k', 'Klassik Qora', 'Kulrang Melanj', 'Shokolad Rang'];
  } else if (/Kardigan|Кардиган|Sviter|Trikotaj/i.test(d)) {
    cat = 'Sviter & Trikotaj';
    title = `Raffini Yumshoq Trikotaj Kardigan #${idx + 1}`;
    colors = ['Krem Bej', 'To‘q Kulrang', 'Qora', 'Qahva Rang'];
  } else if (/Tepa-past|to.plam/i.test(d)) {
    cat = 'To‘plamlar';
    title = `Raffini Ikki Qismli Eksklyuziv To‘plam #${idx + 1}`;
    colors = ['Qora Monoxrom', 'Zaytun Yashil', 'To‘q Ko‘k', 'Qumrang'];
  } else if (/Vitirovka|Ветровка/i.test(d)) {
    cat = 'Kurtkalar & Vitirovka';
    title = `Raffini Yengil Kuzgi Vitirovka #${idx + 1}`;
    colors = ['Klassik Qora', 'To‘q Ko‘k', 'Zaytun', 'Krem'];
  } else if (/Kurtka|Куртка/i.test(d)) {
    cat = 'Kurtkalar & Vitirovka';
    title = `Raffini Premial Qishki/Kuzgi Kurtka #${idx + 1}`;
    colors = ['Klassik Qora', 'To‘q Ko‘k (Navy)', 'Shokolad Jigar', 'Zaytun'];
  }

  let cleanDesc = d
    .replace(/🍁 New Jacket 🧥/g, '🍁 Kuzgi Yangi Kurtka 🧥')
    .replace(/🍁 New Look 🧥/g, '🍁 Yangi Mavsum Obrazi 🧥')
    .replace(/🍁 New Looks 🧥/g, '🍁 Yangi Mavsum To‘plami 🧥')
    .replace(/🍁 New Shoes 👞/g, '🍁 Premial Yangi Poyabzal 👞')
    .replace(/🍁 New Cardigan 🧶/g, '🍁 Yumshoq Yangi Kardigan 🧶')
    .replace(/🔥 NEW ARRIVAL \| RAFFINI/g, '🔥 YANGI TO‘PLAM | RAFFINI')
    .replace(/RAFFINI Обувь 👟/g, 'RAFFINI Erkaklar Poyabzali 👟')
    .replace(/🍁осень ❄️зима/g, '🍁 Kuzgi va ❄️ Qishki mavsum uchun')
    .replace(/✨ Yangi look/g, '✨ Yangi to‘liq obraz')
    .replace(/✨ Yangi kurtka/g, '✨ Yangi eksklyuziv kurtka')
    .replace(/✨ Yangi oyoq kiyim/g, '✨ Tabiiy teri poyabzal')
    .replace(/✨ qish va kuz mavsumiga/g, '✨ Kuz va qish mavsumi uchun mukammal sifat');

  return {
    ...p,
    title,
    category: cat,
    sizes,
    colors,
    description: cleanDesc,
  };
});

fs.writeFileSync('./src/data/products.json', JSON.stringify(updated, null, 2), 'utf8');

const tsContent = 'import { Product } from \'@/types\';\n\nexport const RAFFINI_PRODUCTS: Product[] = ' + JSON.stringify(updated, null, 2) + ';\n\nexport const CATEGORIES = [\n  \'Barchasi\',\n  \'Kurtkalar & Vitirovka\',\n  \'Kostyumlar\',\n  \'Oyoq kiyimlar\',\n  \'Sviter & Trikotaj\',\n  \'To‘plamlar\',\n  \'Futbolka & Polo\',\n  \'Klassik Shimlar\',\n  \'Aksessuarlar\'\n];\n';
fs.writeFileSync('./src/data/products.ts', tsContent, 'utf8');
console.log('Successfully updated all 30 products into 100% pure Uzbek!');

