import React from 'react';
import { joinLeague } from '../services/api';
import {
    getTelegramInitData,
    getTelegramUser,
    getTelegramWebApp,
} from '../services/telegram';

/**
 * Component that allows a user to join the padel league. When rendered inside
 * the Telegram mini app, it can access the Telegram WebApp context to
 * retrieve the authenticated user's information. On click, it sends the
 * user details to the backend to register them in Airtable.
 */
const JoinLeague: React.FC = () => {
    const handleJoin = async () => {
        // Access Telegram WebApp init data to get user details
        const tg = getTelegramWebApp();
        const initData = getTelegramInitData();
        const user = getTelegramUser();

        // =========================
        // COMPREHENSIVE DEBUGGING
        // =========================
        console.log('==================== JOIN LEAGUE DEBUG ====================');
        console.log('1. Telegram WebApp Object:', tg);
        console.log('2. InitData String:', initData);
        console.log('3. User Object:', user);
        console.log('4. window.Telegram:', (window as any).Telegram);
        console.log('5. window.Telegram.WebApp:', (window as any).Telegram?.WebApp);
        console.log('6. initDataUnsafe:', (window as any).Telegram?.WebApp?.initDataUnsafe);
        console.log('7. initDataUnsafe.user:', (window as any).Telegram?.WebApp?.initDataUnsafe?.user);
        console.log('===========================================================');

        // Better error checking
        if (!tg) {
            console.error('❌ Error: Telegram WebApp is not available');
            alert('Telegram WebApp is not available. Please open this app from Telegram.');
            return;
        }

        if (!initData) {
            console.error('❌ Error: Telegram initData is missing');
            console.log('Telegram WebApp object:', tg);
            alert('Telegram initData is missing. Please ensure you opened this app correctly from Telegram.');
            return;
        }

        if (!user) {
            console.error('❌ Error: Telegram user information is not available');
            console.log('InitData:', initData);
            console.log('Trying to parse initData manually:');
            try {
                const params = new URLSearchParams(initData);
                const userParam = params.get('user');
                console.log('User parameter from initData:', userParam);
                if (userParam) {
                    console.log('Parsed user:', JSON.parse(userParam));
                }
            } catch (e) {
                console.error('Failed to parse initData:', e);
            }
            alert('Telegram user information is not available. Please open this app from Telegram.');
            return;
        }

        try {
            console.log('✅ All checks passed! Sending request to backend...');
            tg?.HapticFeedback?.impactOccurred?.('light');

            const payload = {
                initData,
                telegramId: user.id,
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Telegram User',
                username: user.username
            };

            console.log('Payload to send:', payload);
            const response = await joinLeague(payload);
            console.log('✅ Success! Response:', response);
            alert('Ви успішно приєдналися до ліги!');
        } catch (err) {
            console.error('❌ Error joining league:', err);
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
