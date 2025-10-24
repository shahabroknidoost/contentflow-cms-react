// components/NavigationTabs.jsx
import React from 'react';
import NoteIcon from '../svg/stickynote.svg?react';
import UsersIcon from '../svg/users.svg?react';

function NavigationTabs({ activeTab, onTabChange, currentUser }) {
  return (
    <nav className="nav-tabs">
      <button
        className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
        onClick={() => onTabChange('posts')}
        aria-label="View blog posts"
        aria-current={activeTab === 'posts' ? 'page' : undefined}
      >
      <NoteIcon className="icon"/>
        
        Posts
      </button>
      
      {currentUser.role === 'admin' && (
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => onTabChange('users')}
          aria-label="Manage users"
          aria-current={activeTab === 'users' ? 'page' : undefined}
        >
        <UsersIcon className="icon"/>
          Users
        </button>
      )}
    </nav>
  );
}

export default NavigationTabs;