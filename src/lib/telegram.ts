// Telegram WebApp SDK helper for Next.js

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export function getTelegramWebApp() {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    return (window as any).Telegram.WebApp;
  }
  return null;
}

export function initTelegramApp() {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      // Set header color to match our luxury dark emerald theme
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#0A1612');
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor('#0A1612');
      }
    } catch (e) {
      console.warn('Telegram WebApp init error:', e);
    }
  }
}

export function getTelegramUser(): TelegramUser | null {
  const tg = getTelegramWebApp();
  if (tg?.initDataUnsafe?.user) {
    return tg.initDataUnsafe.user;
  }
  return null;
}

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error' = 'light') {
  const tg = getTelegramWebApp();
  if (!tg?.HapticFeedback) return;

  try {
    if (type === 'selection') {
      tg.HapticFeedback.selectionChanged();
    } else if (['light', 'medium', 'heavy'].includes(type)) {
      tg.HapticFeedback.impactOccurred(type);
    } else {
      tg.HapticFeedback.notificationOccurred(type);
    }
  } catch (e) {
    // ignore
  }
}

export function closeTelegramWebApp() {
  const tg = getTelegramWebApp();
  tg?.close();
}

export function sendTelegramData(data: any) {
  const tg = getTelegramWebApp();
  if (tg?.sendData) {
    tg.sendData(typeof data === 'string' ? data : JSON.stringify(data));
  }
}

