import React, { useEffect } from 'react';
import JoinLeague from './components/JoinLeague';
import NavBar from './components/NavBar';
import { initTelegramWebApp } from './services/telegram';

const App: React.FC = () => {
  useEffect(() => {
    initTelegramWebApp();
  }, []);

  return (
    <div className="app">
      <NavBar />
      <main className="main">
        {/* Add routing logic here in a real app */}
        <JoinLeague />
      </main>
    </div>
  );
};

export default App;
