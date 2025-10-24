// components/Header.jsx
import React from 'react';
import LogoutIcon from '../svg/logout.svg?react';

function Header({ currentUser, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1>ContentFlow CMS</h1>
          <p className="welcome-text">Welcome back, {currentUser.username}!</p>
        </div>
        <button className="btn btn-secondary" 
        onClick={onLogout}
        aria-label="Log out of your account"
        >
          <LogoutIcon className="icon" />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;