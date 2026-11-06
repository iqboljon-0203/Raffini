import { NextRequest, NextResponse } from 'next/server';
import { formatUZS } from '@/lib/utils';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// Supports TELEGRAM_GROUP_ID, TELEGRAM_ADMIN_CHAT_ID or comma-separated list
const GROUP_OR_ADMIN_IDS = (
  process.env.TELEGRAM_GROUP_ID ||
  process.env.TELEGRAM_ADMIN_CHAT_ID ||
  ''
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

async function sendTg(chatId: string | number, text: string, replyMarkup?: any) {
  if (!BOT_TOKEN) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
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
  } catch (err) {
    console.error('Error sending TG:', err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();

    if (!order || !order.id || !order.items) {
      return NextResponse.json({ ok: false, error: 'Invalid order data' }, { status: 400 });
    }

    // Format item list
    const itemsList = order.items
      .map(
        (it: any, i: number) =>
          `  ${i + 1}. <b>${it.title}</b>\n     • O‘lcham: <code>${it.size}</code> | Rang: ${it.color}\n     • Soni: <b>${it.quantity} dona</b> x ${formatUZS(it.price)}`
      )
      .join('\n');

    // Group order card message
    const groupMessage = `
🛍 <b>YANGI BUYURTMA! #${order.id}</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${order.customerName}
📞 <b>Telefon:</b> <code>${order.customerPhone}</code>
${order.telegramUserId ? `🆔 <b>Telegram ID:</b> <code>${order.telegramUserId}</code>` : ''}

📦 <b>Buyurtma tarkibi:</b>
${itemsList}

━━━━━━━━━━━━━━━━━━━━
💰 <b>Jami to‘lov:</b> <b>${formatUZS(order.totalPrice)}</b>
🚚 <b>Yetkazish turi:</b> ${
      order.deliveryType === 'pickup'
        ? `🏢 Filialdan olib ketish (<b>${order.branchName || 'Novza'}</b>)`
        : `🚚 Kuryer orqali (<b>${order.address}</b>)`
    }
💳 <b>To‘lov usuli:</b> <b>${order.paymentMethod?.toUpperCase()}</b>
${order.notes ? `📝 <b>Izoh:</b> <i>${order.notes}</i>\n` : ''}⏰ <b>Vaqt:</b> ${new Date(order.date).toLocaleString('uz-UZ')}
━━━━━━━━━━━━━━━━━━━━
⏳ <b>Holati:</b> 🟡 <i>Kutilmoqda</i>
    `.trim();

    // Inline buttons for group management
    const rawPhone = order.customerPhone.replace(/[\s\(\)-]/g, '');
    const tgUserId = order.telegramUserId || '';

    const groupKeyboard = {
      inline_keyboard: [
        [
          {
            text: `📞 Tel: ${order.customerPhone}`,
            url: `tel:${rawPhone}`,
          },
          ...(tgUserId
            ? [
                {
                  text: '👤 Telegram Profil',
                  url: `tg://user?id=${tgUserId}`,
                },
              ]
            : []),
        ],
        [
          {
            text: '✅ Qabul qilish',
            callback_data: `ord_accept_${order.id}_${tgUserId}`,
          },
          {
            text: '🚚 Yo‘lga chiqarish',
            callback_data: `ord_ship_${order.id}_${tgUserId}`,
          },
          {
            text: '🏁 Yakunlash',
            callback_data: `ord_done_${order.id}_${tgUserId}`,
          },
        ],
      ],
    };

    // 1. Send to all configured groups / channels / admins
    if (BOT_TOKEN && GROUP_OR_ADMIN_IDS.length > 0) {
      for (const targetChatId of GROUP_OR_ADMIN_IDS) {
        await sendTg(targetChatId, groupMessage, groupKeyboard);
      }
    } else {
      console.warn('TELEGRAM_GROUP_ID or TELEGRAM_ADMIN_CHAT_ID is not set in environment variables');
    }

    // 2. Send confirmation to the customer's personal Telegram chat
    if (BOT_TOKEN && order.telegramUserId) {
      const customerMsg = `
✨ <b>Hurmatli ${order.customerName}!</b>

Sizning buyurtmangiz muvaffaqiyatli qabul qilindi.
━━━━━━━━━━━━━━━━━━━━
📋 Buyurtma raqami: <code>#${order.id}</code>
💰 Jami to‘lov: <b>${formatUZS(order.totalPrice)}</b>
🚚 Yetkazish: <b>${order.deliveryType === 'pickup' ? order.branchName : order.address}</b>
💳 To‘lov usuli: <b>${order.paymentMethod?.toUpperCase()}</b>

Operatorlarimiz buyurtmani tasdiqlash uchun tez orada bog‘lanishadi.
RAFFINI brendini tanlaganingiz uchun tashakkur! 👔
      `.trim();

      await sendTg(order.telegramUserId, customerMsg);
    }

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
