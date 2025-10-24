// components/Dashboard.jsx
import React, { useState } from 'react';
import Header from './Header';
import NavigationTabs from './NavigationTabs';
import PostsTab from './PostsTab';
import UsersTab from './UsersTab';

function Dashboard({ 
  currentUser, 
  posts, 
  users, 
  onLogout, 
  onCreatePost, 
  onUpdatePost, 
  onDeletePost,
  onCreateUser,
  onUpdateUser,
  onDeleteUser
}) {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="dashboard">
      <Header currentUser={currentUser} onLogout={onLogout} />
      
      <NavigationTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        currentUser={currentUser}
      />
      
      <main id="main-content" className="main-content">
        {activeTab === 'posts' ? (
          <PostsTab
            posts={posts}
            onCreatePost={onCreatePost}
            onUpdatePost={onUpdatePost}
            onDeletePost={onDeletePost}
          />
        ) : (
          <UsersTab
            currentUser={currentUser}
            users={users}
            onCreateUser={onCreateUser}
            onUpdateUser={onUpdateUser}
            onDeleteUser={onDeleteUser}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;