import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get('token') || process.env.TELEGRAM_BOT_TOKEN;
  
  // Use explicit URL or detect from request host
  let appUrl = searchParams.get('url') || process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('host') || 'localhost:3000';
    appUrl = `${proto}://${host}`;
  }

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Bot token ko‘rsatilmadi. Query parametri sifatida ?token=YOUR_BOT_TOKEN bering yoki Vercel Environment Variables ga TELEGRAM_BOT_TOKEN ni qo‘shing.',
        instructions: {
          step1: 'BotFather dan olgan tokeningizni kiriting',
          step2: `Ushbu manzilga kiring: ${appUrl}/api/setup-webhook?token=BOT_TOKENINGIZ`,
        },
      },
      { status: 400 }
    );
  }

  const webhookUrl = `${appUrl}/api/bot`;

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`
    );
    const data = await tgRes.json();

    const getMeRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const botInfo = await getMeRes.json();

    return NextResponse.json({
      success: data.ok,
      message: data.ok
        ? 'Webhook muvaffaqiyatli ulandi! Endi botingiz to‘liq ishlaydi.'
        : 'Telegram xatolik qaytardi.',
      webhookUrl,
      bot: botInfo.result,
      telegramResponse: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || 'Webhook o‘rnatishda xatolik' },
      { status: 500 }
    );
  }
}

