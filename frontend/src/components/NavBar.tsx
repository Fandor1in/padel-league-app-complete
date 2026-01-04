import React from 'react';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__dot" aria-hidden="true" />
        <div>
          <p className="navbar__eyebrow">Telegram Mini App</p>
          <h2 className="navbar__title">Padel League</h2>
        </div>
      </div>
      <div className="navbar__chip">Season 2026</div>
    </nav>
  );
};

export default NavBar;
