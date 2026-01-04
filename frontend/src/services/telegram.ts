type TelegramWebApp = {
    initData?: string;
    initDataUnsafe?: { user?: TelegramUser };
    themeParams?: Record<string, string>;
    ready: () => void;
    expand: () => void;
    onEvent?: (event: string, handler: () => void) => void;
    offEvent?: (event: string, handler: () => void) => void;
    HapticFeedback?: {
        impactOccurred?: (style: 'light' | 'medium' | 'heavy') => void;
        notificationOccurred?: (type: 'error' | 'success' | 'warning') => void;
        selectionChanged?: () => void;
    };
    sendData?: (data: string) => void;
};

export type TelegramUser = {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
};

export const getTelegramWebApp = (): TelegramWebApp | undefined =>
    (window as any).Telegram?.WebApp;

export const getTelegramInitData = (): string =>
    getTelegramWebApp()?.initData || '';

export const getTelegramUser = (): TelegramUser | undefined => {
  const webApp = getTelegramWebApp();
  
  // Try to get user from initDataUnsafe first (contains parsed data)
  if (webApp?.initDataUnsafe?.user) {
    return webApp.initDataUnsafe.user;
  }
  
  // Fallback: Parse from initData string
  if (webApp?.initData) {
    const params = new URLSearchParams(webApp.initData);
    const userString = params.get('user');
    if (userString) {
      try {
        return JSON.parse(userString) as TelegramUser;
      } catch (e) {
        console.error('Failed to parse user from initData:', e);
      }
    }
  }
  
  return undefined;
};

const applyTelegramTheme = (webApp?: TelegramWebApp) => {
    const tg = webApp || getTelegramWebApp();
    if (!tg?.themeParams) {
        return;
    }
    const root = document.documentElement;
    const theme = tg.themeParams;
    root.style.setProperty('--bg', theme.bg_color || '#f6f1e8');
    root.style.setProperty('--ink-strong', theme.text_color || '#14118f');
    root.style.setProperty('--ink', theme.text_color || '#292522');
    root.style.setProperty('--ink-soft', theme.hint_color || '#6b635e');
    root.style.setProperty('--accent-cool', theme.link_color || '#1f7a8c');
};

export const initTelegramWebApp = () => {
    const tg = getTelegramWebApp();
    if (!tg) {
        return;
    }
    // Call ready/expand early to remove the loading spinner and fit the viewport.
    tg.ready();
    tg.expand();
    applyTelegramTheme(tg);
    if (tg.onEvent) {
        tg.onEvent('themeChanged', () => applyTelegramTheme(tg));
    }
};

export const sendTelegramData = (data: unknown) => {
    const tg = getTelegramWebApp();
    if (tg?.sendData) {
        tg.sendData(JSON.stringify(data));
    }
};
