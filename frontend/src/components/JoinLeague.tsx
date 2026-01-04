import React from 'react';
import { joinLeague } from '../services/api';
import {
  getTelegramInitData,
  getTelegramUser,
  getTelegramWebApp,
} from '../services/telegram';

/**
 * Component that allows a user to join the padel league.  When rendered inside
 * the Telegram mini app, it can access the Telegram WebApp context to
 * retrieve the authenticated user's information.  On click, it sends the
 * user details to the backend to register them in Airtable.
 */
const JoinLeague: React.FC = () => {
  const handleJoin = async () => {
    // Access Telegram WebApp init data to get user details
    const tg = getTelegramWebApp();
    const initData = getTelegramInitData();
    const user = getTelegramUser();
    if (!initData) {
      alert('Telegram initData is missing. Please open this app from the Telegram WebApp menu.');
      return;
    }
    try {
      tg?.HapticFeedback?.impactOccurred?.('light');
      const payload = { initData } as {
        initData: string;
        telegramId?: number;
        name?: string;
        username?: string;
      };
      if (user) {
        const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        payload.telegramId = user.id;
        payload.name = name || user.username || 'Telegram User';
        payload.username = user.username;
      }
      await joinLeague(payload);
      alert('Ви успішно приєдналися до ліги!');
    } catch (err) {
      console.error(err);
      alert('Не вдалося приєднатися до ліги. Спробуйте ще раз пізніше.');
    }
  };

  return (
    <section className="hero">
      <div className="hero__card">
        <p className="hero__eyebrow">Почнімо сезон</p>
        <h1 className="hero__title">Приєднатися до падель‑ліги</h1>
        <p className="hero__subtitle">
          Зареєструйтесь через Telegram, щоб отримати рейтинг, команду та доступ до
          результатів матчів.
        </p>
        <div className="hero__meta">
          <div>
            <p className="hero__meta-label">Формат</p>
            <p className="hero__meta-value">2v2, підтвердження матчу</p>
          </div>
          <div>
            <p className="hero__meta-label">Статистика</p>
            <p className="hero__meta-value">Рейтинг, перемоги, серії</p>
          </div>
        </div>
        <button onClick={handleJoin} className="hero__button">
          Приєднатися
        </button>
        <p className="hero__footnote">Працює тільки всередині Telegram.</p>
      </div>
      <div className="hero__accent" aria-hidden="true">
        <div className="hero__ball" />
        <div className="hero__grid" />
      </div>
    </section>
  );
};

export default JoinLeague;
