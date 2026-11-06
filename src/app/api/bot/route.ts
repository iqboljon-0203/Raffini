import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
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

async function sendTelegramPhoto(
  chatId: number | string,
  photoPathOrUrl: string,
  caption?: string,
  replyMarkup?: any
) {
  if (!BOT_TOKEN) return null;

  // 1. Try uploading local file directly via multipart FormData (Works offline / localhost / production)
  try {
    const localRelPath = photoPathOrUrl.startsWith('/') ? photoPathOrUrl.slice(1) : photoPathOrUrl;
    const fullLocalPath = path.join(process.cwd(), localRelPath);
    if (fs.existsSync(fullLocalPath)) {
      const fileBuffer = fs.readFileSync(fullLocalPath);
      const blob = new Blob([fileBuffer]);
      const formData = new FormData();
      formData.append('chat_id', String(chatId));
      formData.append('photo', blob, 'welcome.jpg');
      if (caption) {
        formData.append('caption', caption);
        formData.append('parse_mode', 'HTML');
      }
      if (replyMarkup) {
        formData.append('reply_markup', JSON.stringify(replyMarkup));
      }

      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.ok) return data;
      console.warn('sendPhoto multipart response not ok:', data);
    }
  } catch (err) {
    console.warn('Local photo upload failed, attempting URL method:', err);
  }

  // 2. Fallback: Send public URL
  try {
    const photoUrl = photoPathOrUrl.startsWith('http')
      ? photoPathOrUrl
      : `${WEBAPP_URL}${photoPathOrUrl.startsWith('/') ? '' : '/'}${photoPathOrUrl}`;

    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoUrl,
        caption,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      }),
    });
    const data = await res.json();
    if (data.ok) return data;
  } catch (err) {
    console.warn('URL sendPhoto failed:', err);
  }

  // 3. Fallback: If Telegram photo methods fail, send message with caption
  if (caption) {
    return await sendTelegramMessage(chatId, caption, replyMarkup);
  }
  return null;
}

async function editTelegramMessage(chatId: number | string, messageId: number, text: string, replyMarkup?: any) {
  if (!BOT_TOKEN) return null;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error('Error editing TG message:', err);
    return null;
  }
}

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  if (!BOT_TOKEN) return null;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: false,
      }),
    });
  } catch (err) {}
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // 1. Message handling
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const chatType = msg.chat.type; // 'private', 'group', 'supergroup', 'channel'
      const text = msg.text || '';
      const firstName = msg.from?.first_name || 'Hurmatli mijoz';

      // Bot added to group
      if (msg.new_chat_members) {
        const welcomeGroupMsg = `
🎉 <b>RAFFINI do‘koni boti guruhga muvaffaqiyatli qo‘shildi!</b>

Ushbu guruhning ID raqami:
<code>${chatId}</code>

<i>Barcha yangi buyurtmalar ushbu guruhga tushishi uchun:</i>
Vercel da <b>TELEGRAM_GROUP_ID</b> o‘zgaruvchisiga aynan shu <code>${chatId}</code> raqamini kiriting.
        `.trim();
        await sendTelegramMessage(chatId, welcomeGroupMsg);
        return NextResponse.json({ ok: true });
      }

      // /id command (Works in both private chats and groups)
      if (text.startsWith('/id')) {
        const idMsg = `
📍 <b>Ushbu chat / guruh ID raqami:</b>
<code>${chatId}</code>

${chatType !== 'private' ? 'Buyurtmalar shu guruhga kelib tushishi uchun Vercel da <b>TELEGRAM_GROUP_ID</b> ga ushbu raqamni kiriting.' : ''}
        `.trim();
        await sendTelegramMessage(chatId, idMsg);
        return NextResponse.json({ ok: true });
      }

      // Private chat commands
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

        await sendTelegramPhoto(chatId, 'public/images/bot_welcome.jpg', welcomeText, keyboard);
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
/id — Ushbu chat yoki guruhning ID raqamini aniqlash
/help — Yordam ma’lumotlari

👨‍💻 <b>Admin:</b> @raffini_uzbekistan
📞 <b>Call-Center:</b> +998 (95) 052-73-52
        `.trim();
        await sendTelegramMessage(chatId, helpText);
        return NextResponse.json({ ok: true });
      }

      // Only reply default in private chat
      if (chatType === 'private') {
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
    }

    // 2. Callback query handling
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const messageId = cb.message.message_id;
      const currentText = cb.message.text || '';
      const data = cb.data || '';
      const operatorName = cb.from?.username
        ? `@${cb.from.username}`
        : `${cb.from?.first_name || 'Menejer'}`;

      // Order status updates in the group
      if (data.startsWith('ord_')) {
        const parts = data.split('_'); // ['ord', action, orderId, userId]
        const action = parts[1];
        const orderId = parts[2];
        const customerTgId = parts[3];

        if (action === 'accept') {
          await answerCallbackQuery(cb.id, `Buyurtma #${orderId} qabul qilindi!`);

          // Update message text in the group
          const updatedText = currentText.replace(
            /⏳ Holati:.*$/m,
            `⏳ Holati: ✅ <b>QABUL QILINDI</b> (Menejer: ${operatorName})`
          );

          await editTelegramMessage(chatId, messageId, updatedText, {
            inline_keyboard: [
              cb.message.reply_markup?.inline_keyboard[0] || [],
              [
                { text: '🚚 Yo‘lga chiqarish', callback_data: `ord_ship_${orderId}_${customerTgId}` },
                { text: '🏁 Yakunlash', callback_data: `ord_done_${orderId}_${customerTgId}` },
              ],
            ],
          });

          // Notify customer in private chat
          if (customerTgId) {
            await sendTelegramMessage(
              customerTgId,
              `✅ <b>Buyurtmangiz (#${orderId}) qabul qilindi!</b>\nMenejerimiz buyurtmani filialdan tayyorlashni boshladi.`
            );
          }
        } else if (action === 'ship') {
          await answerCallbackQuery(cb.id, `Buyurtma #${orderId} yo'lga chiqdi!`);

          const updatedText = currentText.replace(
            /⏳ Holati:.*$/m,
            `⏳ Holati: 🚚 <b>YO‘LGA CHIQARILDI</b> (Menejer: ${operatorName})`
          );

          await editTelegramMessage(chatId, messageId, updatedText, {
            inline_keyboard: [
              cb.message.reply_markup?.inline_keyboard[0] || [],
              [
                { text: '🏁 Yakunlash', callback_data: `ord_done_${orderId}_${customerTgId}` },
              ],
            ],
          });

          if (customerTgId) {
            await sendTelegramMessage(
              customerTgId,
              `🚚 <b>Buyurtmangiz (#${orderId}) yo‘lga chiqdi!</b>\nKuryerimiz tez orada siz bilan bog‘lanadi.`
            );
          }
        } else if (action === 'done') {
          await answerCallbackQuery(cb.id, `Buyurtma #${orderId} muvaffaqiyatli yakunlandi!`);

          const updatedText = currentText.replace(
            /⏳ Holati:.*$/m,
            `⏳ Holati: 🏁 <b>YAKUNLANDI (Muvaffaqiyatli topshirildi)</b>`
          );

          await editTelegramMessage(chatId, messageId, updatedText, {
            inline_keyboard: [
              cb.message.reply_markup?.inline_keyboard[0] || [],
            ],
          });

          if (customerTgId) {
            await sendTelegramMessage(
              customerTgId,
              `🎉 <b>Buyurtmangiz topshirildi!</b>\nRAFFINI liboslarini tanlaganingiz uchun tashakkur! 👔`
            );
          }
        }

        return NextResponse.json({ ok: true });
      }

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

      await answerCallbackQuery(cb.id);
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
