import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const configuredGroupId = process.env.TELEGRAM_GROUP_ID;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  const searchParams = req.nextUrl.searchParams;
  const queryChatId = searchParams.get('chat_id') || searchParams.get('id');

  const targetId = queryChatId || configuredGroupId || adminChatId;

  if (!token) {
    return NextResponse.json({
      ok: false,
      error: 'TELEGRAM_BOT_TOKEN Vercel Environment Variables da mavjud emas.',
    }, { status: 400 });
  }

  if (!targetId) {
    return NextResponse.json({
      ok: false,
      configuredInVercel: {
        TELEGRAM_GROUP_ID: configuredGroupId || null,
        TELEGRAM_ADMIN_CHAT_ID: adminChatId || null,
      },
      error: 'Guruh ID raqami topilmadi. Vercel da TELEGRAM_GROUP_ID ni qo‘shing yoki ushbu sahifaga ?chat_id=-100XXXXXXXXXX ko‘rinishida parametr bering.',
      yordam: [
        '1. Telegramda yangi guruh oching va @raffiniuzbot ni guruhga a\'zo qiling.',
        '2. Guruhga kirib /id deb yozing, bot sizga guruhning haqiqiy ID raqamini aytadi.',
        '3. Ushbu ID raqamni Vercel Settings -> Environment Variables -> TELEGRAM_GROUP_ID ga qo‘ying.',
      ],
    }, { status: 400 });
  }

  const testMessage = `
🔔 <b>RAFFINI DO‘KONI — TEST XABARI</b>
━━━━━━━━━━━━━━━━━━━━
✅ Telegram bot guruhga muvaffaqiyatli ulandi!
📦 Saytdan berilgan barcha yangi buyurtmalar ushbu guruhga tushadi.

⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}
━━━━━━━━━━━━━━━━━━━━
<i>Agar ushbu xabarni ko‘rayotgan bo‘lsangiz, buyurtmalar tizimi 100% tayyor!</i>
  `.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetId,
        text: testMessage,
        parse_mode: 'HTML',
      }),
    });

    const tgData = await res.json();

    return NextResponse.json({
      success: tgData.ok,
      configuredInVercel: {
        TELEGRAM_GROUP_ID: configuredGroupId || null,
        TELEGRAM_ADMIN_CHAT_ID: adminChatId || null,
      },
      testedChatId: targetId,
      telegramResponse: tgData,
      xulosa: tgData.ok
        ? 'Ajoyib! Test xabari guruhga yuborildi. Guruhni tekshiring.'
        : 'Telegram xatolik berdi. Iltimos, bot guruhga a\'zo qilinganligini va to‘g‘ri ID kiritilganligini tekshiring.',
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err.message,
    }, { status: 500 });
  }
}
