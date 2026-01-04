import React from 'react';
import { joinLeague } from '../services/api';

/**
 * Component that allows a user to join the padel league.  When rendered inside
 * the Telegram mini app, it can access the Telegram WebApp context to
 * retrieve the authenticated user's information.  On click, it sends the
 * user details to the backend to register them in Airtable.
 */
const JoinLeague: React.FC = () => {
  const handleJoin = async () => {
    // Access Telegram WebApp init data to get user details
    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    if (!user) {
      alert('Telegram user information is not available. Please open this app from Telegram.');
      return;
    }
    try {
      const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
      await joinLeague({ telegramId: String(user.id), name, username: user.username });
      alert('Ви успішно приєдналися до ліги!');
    } catch (err) {
      console.error(err);
      alert('Не вдалося приєднатися до ліги. Спробуйте ще раз пізніше.');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Приєднатися до падель‑ліги</h1>
      <p>Натисніть кнопку нижче, щоб зареєструватися через Telegram.</p>
      <button
        onClick={handleJoin}
        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Приєднатися
      </button>
    </div>
  );
};

export default JoinLeague;