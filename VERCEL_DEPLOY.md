# RAFFINI — Telegram Web App & Bot Webhook Deploy Qo‘llanmasi 🚀

Ushbu loyiha **RAFFINI** erkaklar kiyimlari do‘koni uchun tayyorlangan premium darajadagi **Telegram Mini App (TMA)** va **Telegram Guruhga Buyurtma Tushuvchi Bot Webhook** tizimidir.

---

## 👥 Telegram Guruhga Buyurtmalarni Ulash:

1. Telegram da buyurtmalar tushishi uchun yangi guruh oching (masalan: **"RAFFINI Buyurtmalar"**).
2. O‘zingizning botingizni ushbu guruhga **Admin** qilib qo‘shing.
3. Bot guruhga qo‘shilishi bilan guruhning **ID raqamini** avtomatik chiqarib beradi (masalan: `-1002345678901`).
   *(Agar chiqmasa, guruhda `/id` deb yozsangiz, bot darhol guruh ID sini yozib beradi).*
4. Vercel da **Environment Variables** ga quyidagini qo‘shasiz:
   `TELEGRAM_GROUP_ID` = `-1002345678901`

### Guruhdagi Imkoniyatlar:
- Har bir buyurtma tushganda tovarlar rasmi, narxi, o‘lchami, rangi, filiali, mijoz ismi va telefoni chiroyli kartochka bo‘lib tushadi.
- Guruh a'zolari bir bosishda:
  - `[📞 Tel: +998...]` — mijozga qo‘ng‘iroq qila oladi.
  - `[👤 Telegram Profil]` — mijozning shaxsiy Telegramiga yoza oladi.
  - `[✅ Qabul qilish]` — bosilganda guruhda *"Qabul qilindi (Menejer: @ism)"* deb yangilanadi va mijozning o‘ziga ham *"Buyurtmangiz qabul qilindi!"* deb xabar boradi.
  - `[🚚 Yo‘lga chiqarish]` — bosilganda mijozga *"Buyurtmangiz yo‘lga chiqdi!"* deb xabar boradi.
  - `[🏁 Yakunlash]` — buyurtma muvaffaqiyatli topshirilganini belgilaydi.

---

## 🌐 1-QADAM: Vercel ga Deploy Qilish

### GitHub orqali (Tavsiya etiladi):
```bash
git add .
git commit -m "feat: telegram group orders integration"
git push origin main
```
1. [Vercel.com](https://vercel.com) ga kiring va GitHub dagi reponi tanlang.
2. **Deploy** tugmasini bosing.
3. Vercel sizga bepul manzil beradi (masalan: `https://raffini.vercel.app`).

---

## ⚙️ 2-QADAM: Vercel Environment Variables (O‘zgaruvchilar)

Vercel sozlamalarida (`Settings -> Environment Variables`) quyidagilarni kiriting:

| O‘zgaruvchi nomi | Qiymati | Izoh |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | `7123456789:AAH...` | @BotFather dan olgan bot tokeningiz |
| `NEXT_PUBLIC_APP_URL` | `https://raffini.vercel.app` | Vercel bergan sayt manzilingiz |
| `TELEGRAM_GROUP_ID` | `-1002345678901` | Buyurtmalar tushadigan Telegram guruh ID raqami |

*(O‘zgaruvchilarni saqlagach, Vercel da **Redeploy** tugmasini bosing)*.

---

## 🤖 3-QADAM: Webhookni 1 Bosishda Ulash

Deploy bo‘lgach, brauzeringizda quyidagi manzilni oching:

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
yozuvi chiqadi. Shu bilan botingiz Vercel serverless da 24/7 rejimda bepul ishlay boshlaydi!

---

## 📱 4-QADAM: BotFather da Web App Tugmasini Sozlash

1. Telegram da [@BotFather](https://t.me/BotFather) ga kiring ➜ `/mybots` ➜ Botingizni tanlang.
2. **Bot Settings** ➜ **Menu Button** ➜ **Configure menu button**.
3. Vercel saytingiz manzilini yuborasiz: `https://sizning-saytingiz.vercel.app`
4. Tugma nomiga yozasiz: `🛍 Do‘konni ochish`

Tayyor! Endi mijozlar botga kirganda to‘liq ekranli luxury Raffini do‘koni ochiladi, berilgan buyurtmalar esa avtomatik ravishda Telegram guruhingizga tushadi!
