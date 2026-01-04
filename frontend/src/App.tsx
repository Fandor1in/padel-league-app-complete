import React from 'react';
import JoinLeague from './components/JoinLeague';
import NavBar from './components/NavBar';

const App: React.FC = () => {
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
