import { NextRequest, NextResponse } from 'next/server';
import { RAFFINI_BRANCHES, RAFFINI_INFO } from '@/data/branches';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://raffini.vercel.app';

async function sendTelegramMessage(chatId: number | string, text: string, replyMarkup?: any) {
  if (!BOT_TOKEN) {
    console.warn('TELEGRAM_BOT_TOKEN is not set');
    return null;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // 1. Message handling
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = msg.text || '';
      const firstName = msg.from?.first_name || 'Hurmatli mijoz';

      // /start command
      if (text.startsWith('/start')) {
        const welcomeText = `
👔 <b>Assalomu alaykum, ${firstName}!</b>

<b>RAFFINI</b> — Premium erkaklar kiyimlari do‘konining rasmiy Telegram ilovasiga xush kelibsiz!

✨ <i>Yangi Kuz / Qish 2026 kolleksiyasi sotuvda:</i>
• Zamonaviy kurtkalar va vitirovkalar
• Elegant kostyum-shimlar va paltolar
• Klassik va casual poyabzallar
• Sviterlar, kardiganlar va futbolkalar

🏢 <b>Toshkent bo‘ylab 11 ta filial</b>
⏰ <b>Ish vaqti:</b> 09:00 dan 23:00 gacha
📞 <b>Aloqa:</b> +998 (95) 052-73-52

Do‘konni ochish uchun quyidagi <b>"🛍 Do‘konni ochish"</b> tugmasini bosing:
        `.trim();

        const keyboard = {
          inline_keyboard: [
            [
              {
                text: "🛍 Do‘konni ochish (Web App)",
                web_app: { url: WEBAPP_URL },
              },
            ],
            [
              {
                text: "🏢 11 ta Filiallar",
                callback_data: "branches_list",
              },
              {
                text: "📞 Bog‘lanish",
                callback_data: "contact_info",
              },
            ],
            [
              {
                text: "📢 Rasmiy kanal (@raffini_uz)",
                url: RAFFINI_INFO.channelUrl,
              },
            ],
          ],
        };

        await sendTelegramMessage(chatId, welcomeText, keyboard);
        return NextResponse.json({ ok: true });
      }

      // /shop command
      if (text.startsWith('/shop') || text.startsWith('/dokon')) {
        await sendTelegramMessage(chatId, "🛍 <b>Raffini do‘konini ochish:</b>", {
          inline_keyboard: [
            [{ text: "🛍 Do‘konni ochish (Web App)", web_app: { url: WEBAPP_URL } }],
          ],
        });
        return NextResponse.json({ ok: true });
      }

      // /filiallar command
      if (text.startsWith('/filiallar') || text.startsWith('/branches')) {
        let branchMsg = `🏢 <b>RAFFINI DO‘KONLARI (11 TA FILIAL):</b>\n\n`;
        RAFFINI_BRANCHES.forEach((b, i) => {
          branchMsg += `<b>${i + 1}. ${b.name}</b>\n📍 ${b.landmark}\n📞 ${b.phone}\n⏰ ${b.workHours}\n\n`;
        });
        branchMsg += `<i>Barcha filiallarimizda eng so‘nggi kolleksiyalar mavjud!</i>`;

        await sendTelegramMessage(chatId, branchMsg, {
          inline_keyboard: [
            [{ text: "🛍 Xaridni boshlash", web_app: { url: WEBAPP_URL } }],
          ],
        });
        return NextResponse.json({ ok: true });
      }

      // /help command
      if (text.startsWith('/help')) {
        const helpText = `
<b>RAFFINI Bot buyruqlari:</b>

/start — Botni ishga tushirish va menyu
/shop — Do‘konni ochish (Mini App)
/filiallar — 11 ta filial manzillari va telefonlar
/help — Yordam ma’lumotlari

👨‍💻 <b>Admin:</b> @raffini_uzbekistan
📞 <b>Call-Center:</b> +998 (95) 052-73-52
        `.trim();
        await sendTelegramMessage(chatId, helpText);
        return NextResponse.json({ ok: true });
      }

      // Web App data received
      if (msg.web_app_data) {
        try {
          const data = JSON.parse(msg.web_app_data.data);
          await sendTelegramMessage(
            chatId,
            `✅ <b>Rahmat! Buyurtmangiz qabul qilindi.</b>\nBuyurtma raqami: <code>#${data.id || 'RF'}</code>\nOperatorlarimiz tez orada bog‘lanishadi.`
          );
        } catch (e) {
          // ignore
        }
        return NextResponse.json({ ok: true });
      }

      // Default reply
      await sendTelegramMessage(
        chatId,
        `Katalogdagi mahsulotlarni ko‘rish va buyurtma berish uchun quyidagi tugmani bosing:`,
        {
          inline_keyboard: [
            [{ text: "🛍 Do‘konni ochish (Web App)", web_app: { url: WEBAPP_URL } }],
          ],
        }
      );
    }

    // 2. Callback query handling
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const data = cb.data;

      if (data === 'branches_list') {
        let branchMsg = `🏢 <b>RAFFINI DO‘KONLARI (11 TA FILIAL):</b>\n\n`;
        RAFFINI_BRANCHES.slice(0, 6).forEach((b, i) => {
          branchMsg += `<b>${i + 1}. ${b.name}</b>\n📍 ${b.landmark}\n📞 ${b.phone}\n\n`;
        });
        branchMsg += `<i>(Qolgan barcha filiallarni Web App ichida xarita bilan ko‘rishingiz mumkin)</i>`;

        await sendTelegramMessage(chatId, branchMsg, {
          inline_keyboard: [
            [{ text: "🛍 Barcha filiallarni ko‘rish", web_app: { url: WEBAPP_URL } }],
          ],
        });
      } else if (data === 'contact_info') {
        const contactMsg = `
📞 <b>RAFFINI BOG‘LANISH:</b>

🏢 <b>Toshkent bo‘ylab 11 ta filial</b>
⏰ <b>Ish vaqti:</b> 09:00 - 23:00 (har kuni)

📞 +998 (95) 052 73 52
☎️ +998 (88) 007 14 24

👨‍💻 <b>Telegram Admin:</b> @raffini_uzbekistan
📢 <b>Kanal:</b> @raffini_uz
        `.trim();

        await sendTelegramMessage(chatId, contactMsg, {
          inline_keyboard: [
            [{ text: "🛍 Do‘konni ochish", web_app: { url: WEBAPP_URL } }],
          ],
        });
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Raffini Telegram Bot Webhook Endpoint',
    botConfigured: Boolean(BOT_TOKEN),
  });
}
