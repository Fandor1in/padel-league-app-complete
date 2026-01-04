import React from 'react';
import JoinLeague from './components/JoinLeague';
import NavBar from './components/NavBar';

const App: React.FC = () => {
  return (
    <div>
      <NavBar />
      <main className="p-4">
        {/* Add routing logic here in a real app */}
        <JoinLeague />
      </main>
    </div>
  );
};

export default App;