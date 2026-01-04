import { NextFunction, Request, Response } from 'express';
import {
  ALLOW_UNVERIFIED_TELEGRAM,
  TELEGRAM_BOT_TOKEN,
} from '../config';
import {
  parseTelegramInitData,
  TelegramUser,
  verifyTelegramInitData,
} from '../utils/telegramAuth';

export type TelegramRequest = Request & {
  telegramInitData?: string;
  telegramUser?: TelegramUser;
};

const extractInitData = (req: Request): string => {
  const header = req.headers['x-telegram-init-data'];
  if (typeof header === 'string') {
    return header;
  }
  if (Array.isArray(header)) {
    return header[0] || '';
  }
  if (typeof (req.body as any)?.initData === 'string') {
    return (req.body as any).initData;
  }
  return '';
};

export const requireTelegramAuth = (
  req: TelegramRequest,
  res: Response,
  next: NextFunction,
) => {
  const initData = extractInitData(req);
  if (!initData) {
    if (ALLOW_UNVERIFIED_TELEGRAM) {
      return next();
    }
    return res.status(401).json({ message: 'Telegram initData is required' });
  }

  if (!TELEGRAM_BOT_TOKEN) {
    return res.status(500).json({ message: 'Telegram bot token is missing' });
  }

  if (!verifyTelegramInitData(initData, TELEGRAM_BOT_TOKEN)) {
    return res.status(401).json({ message: 'Telegram initData is invalid' });
  }

  const { user } = parseTelegramInitData(initData);
  if (!user?.id) {
    return res.status(400).json({ message: 'Telegram user information is missing' });
  }

  req.telegramInitData = initData;
  req.telegramUser = user;
  return next();
};
