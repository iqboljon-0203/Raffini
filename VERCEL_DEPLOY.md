# RAFFINI — Telegram Web App & Bot Webhook Deploy Qo‘llanmasi 🚀

Ushbu loyiha **RAFFINI** erkaklar kiyimlari do‘koni uchun tayyorlangan premium darajadagi **Telegram Mini App (TMA)** va **Telegram Bot Webhook** tizimidir.

---

## 💎 Loyihada Nimalar Bajarildi:

1. **Haqiqiy Mahsulotlar Bazasi:**
   - [t.me/raffini_uz](https://t.me/raffini_uz) kanalidan 30 dan ortiq real tovarlar (kurtkalar, vitirovkalar, kostyumlar, poyabzallar, sviterlar, ko‘ylaklar, shimlar) yuqori sifatli rasmlari, narxlari va tavsiflari bilan saqlandi.
   - Rasmlar lokal `public/images/products/` papkasiga yuklab olingan, shuning uchun ular hech qachon eskirmaydi yoki o‘chib ketmaydi.

2. **Dizayn Reference (Reference Image bo‘yicha):**
   - Zümrad yashil (Emerald Luxury Dark) va oltin (Gold Champagne) ranglar palitrasi.
   - Splash / Onboarding ekrani.
   - Asosiy sahifa (Hero Banner, Yangi mavsum 2026, VIP promokod banneri, Trend to‘plam, Yangi kelganlar).
   - Katalog sahifasi (Toifalar bo‘yicha filtr, O‘lchamlar (S, M, L, XL, XXL, 3XL, 39-44) va saralash).
   - Mahsulot sahifasi (Fotogalereya, o‘lcham va rang tanlash, filialda mavjudligi, savatga qo‘shish).
   - Savat va Promokod (`RAFFINI` - 10% chegirma).
   - Buyurtmani rasmiylashtirish (11 ta filialdan olib ketish yoki Kuryer orqali yetkazish, Click/Payme/Naqd).
   - Buyurtmalar tarixi va real vaqtda kuzatish (Pending -> Shipping -> Delivered).
   - Toshkent bo‘ylab 11 ta filial xaritasi, manzillari, telefonlari va ish vaqtlari (09:00 - 23:00).
   - Profil (Telegram user avatari, ismi, VIP Premium nishoni).

3. **Telegram Bot Webhook & Serverless:**
   - `/api/bot` — Telegram webhook endpointi (`/start`, `/shop`, `/filiallar`, `/help`).
   - `/api/order` — Yangi buyurtma tushganda do‘kon adminiga to‘liq ma’lumotlarni yuboruvchi va mijozga tasdiq xabarini jo‘natuvchi endpoint.
   - `/api/setup-webhook` — 1 bosqichda brauzer orqali bot webhookini ulovchi yordamchi.

---

## 🌐 1-QADAM: Vercel ga Deploy Qilish

### Variant A: GitHub orqali (Tavsiya etiladi)

1. Loyihani o‘zingizning GitHub hisobingizga yuklang:
   ```bash
   git init
   git add .
   git commit -m "Raffini Telegram Web App & Bot"
   git branch -M main
   git remote add origin https://github.com/USERNAME/raffini.git
   git push -u origin main
   ```

2. [Vercel.com](https://vercel.com) ga kiring va **"Add New Project"** tugmasini bosing.
3. GitHub dagi `raffini` reponi tanlang va **Deploy** tugmasini bosing.
4. Vercel sizga bepul domen beradi, masalan: `https://raffini-shop.vercel.app`

### Variant B: Vercel CLI orqali to‘g‘ridan-to‘g‘ri terminaldan

```bash
npx vercel
```
Savollarga `y` va `Enter` bosib davom eting. Tayyor!

---

## ⚙️ 2-QADAM: Vercel Environment Variables (O‘zgaruvchilar)

Vercel loyihangiz sozlamalariga kiring: **Settings -> Environment Variables** va quyidagilarni kiriting:

| O‘zgaruvchi nomi | Qiymati | Izoh |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | `7123456789:AAH...` | @BotFather dan olgan bot tokeningiz |
| `NEXT_PUBLIC_APP_URL` | `https://sizning-saytingiz.vercel.app` | Verceldagi sayt manzilingiz |
| `TELEGRAM_ADMIN_CHAT_ID` | `123456789` | Yangi buyurtmalar borishi kerak bo‘lgan Telegram ID |

*(O‘zgaruvchilarni kiritgach, Vercel da **Redeploy** tugmasini bosing)*.

---

## 🤖 3-QADAM: Telegram Bot va Webhookni Ulash

Deploy bo‘lganidan so‘ng, brauzeringizda quyidagi manzilni oching:

```
https://sizning-saytingiz.vercel.app/api/setup-webhook?token=BOT_TOKENINGIZ
```

Ekranda:
```json
{
  "success": true,
  "message": "Webhook muvaffaqiyatli ulandi! Endi botingiz to‘liq ishlaydi."
}
```
yozuvi chiqadi. Shu bilan Telegram botingiz webhook rejimida Vercel da 24/7 rejimda bepul ishlay boshlaydi!

---

## 📱 4-QADAM: BotFather da Web App Tugmasini Sozlash

Mijozlar botga kirishi bilanoq pastda **"🛍 Do‘kon"** tugmasi turishi uchun:

1. Telegram da [@BotFather](https://t.me/BotFather) ga kiring.
2. `/mybots` buyrug‘ini yuboring va botingizni tanlang.
3. **Bot Settings** -> **Menu Button** -> **Configure menu button** ni tanlang.
4. URL so‘raganda Vercel linkingizni yuboring:
   `https://sizning-saytingiz.vercel.app`
5. Tugma nomiga yozing:
   `🛍 Do‘konni ochish`

Tayyor! Endi istalgan foydalanuvchi botga kirganda to‘liq ekranli ultra-premium Raffini do‘koni ochiladi!
