import crypto from 'crypto';

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface TelegramInitData {
  authDate?: number;
  user?: TelegramUser;
}

export const parseTelegramInitData = (initData: string): TelegramInitData => {
  const params = new URLSearchParams(initData);
  const authDateRaw = params.get('auth_date');
  const userRaw = params.get('user');
  let user: TelegramUser | undefined;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as TelegramUser;
    } catch {
      user = undefined;
    }
  }

  const authDate = authDateRaw ? Number(authDateRaw) : undefined;
  return { authDate, user };
};

export const verifyTelegramInitData = (
  initData: string,
  botToken: string,
): boolean => {
  if (!initData || !botToken) {
    return false;
  }

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) {
    return false;
  }

  params.delete('hash');
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secret = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  const hashBuffer = Buffer.from(hash, 'hex');
  const hmacBuffer = Buffer.from(hmac, 'hex');
  if (hashBuffer.length !== hmacBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashBuffer, hmacBuffer);
};
