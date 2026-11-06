import { NextRequest, NextResponse } from 'next/server';
import { formatUZS } from '@/lib/utils';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();

    if (!order || !order.id || !order.items) {
      return NextResponse.json({ ok: false, error: 'Invalid order data' }, { status: 400 });
    }

    // Format admin notification
    const itemsList = order.items
      .map(
        (it: any, i: number) =>
          `  ${i + 1}. <b>${it.title}</b>\n     • O‘lcham: <code>${it.size}</code> | Rang: ${it.color}\n     • Soni: ${it.quantity} dona x ${formatUZS(it.price)}`
      )
      .join('\n');

    const adminMessage = `
🔥 <b>YANGI BUYURTMA! #${order.id}</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${order.customerName}
📞 <b>Telefon:</b> <code>${order.customerPhone}</code>
${order.telegramUserId ? `🆔 <b>Telegram ID:</b> <code>${order.telegramUserId}</code>` : ''}

📦 <b>Buyurtma tarkibi:</b>
${itemsList}

━━━━━━━━━━━━━━━━━━
💰 <b>Jami summa:</b> <b>${formatUZS(order.totalPrice)}</b>
🚚 <b>Yetkazish turi:</b> ${order.deliveryType === 'pickup' ? `🏢 Filialdan olib ketish (${order.branchName})` : `🚚 Kuryer (${order.address})`}
💳 <b>To‘lov turi:</b> ${order.paymentMethod?.toUpperCase()}
${order.notes ? `📝 <b>Izoh:</b> ${order.notes}` : ''}
⏰ <b>Vaqt:</b> ${new Date(order.date).toLocaleString('uz-UZ')}
    `.trim();

    // 1. Send to Admin if configured
    if (BOT_TOKEN && ADMIN_CHAT_ID) {
      try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: ADMIN_CHAT_ID,
            text: adminMessage,
            parse_mode: 'HTML',
          }),
        });
      } catch (err) {
        console.error('Error sending order to admin:', err);
      }
    }

    // 2. Send confirmation to customer if telegramUserId exists
    if (BOT_TOKEN && order.telegramUserId) {
      const customerMsg = `
✨ <b>Hurmatli ${order.customerName}!</b>

Buyurtmangiz muvaffaqiyatli qabul qilindi.
━━━━━━━━━━━━━━━━━━
Raqami: <code>#${order.id}</code>
Summa: <b>${formatUZS(order.totalPrice)}</b>
Yetkazish: <b>${order.deliveryType === 'pickup' ? order.branchName : order.address}</b>

Tez orada operatorimiz siz bilan bog‘lanadi.
RAFFINI brendini tanlaganingiz uchun tashakkur! 👔
      `.trim();

      try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: order.telegramUserId,
            text: customerMsg,
            parse_mode: 'HTML',
          }),
        });
      } catch (err) {
        console.warn('Could not send to customer chat:', err);
      }
    }

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
