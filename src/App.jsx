// App.jsx - Main Application Component
import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import './styles/App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const demoUsers = [
      { id: 1, username: 'admin', password: 'admin123', role: 'admin', email: 'admin@ContentFlow.com',joinedDate: '2024-01-15'},
      { id: 2, username: 'editor', password: 'editor123', role: 'editor', email: 'editor@ContentFlow.com',joinedDate: '2024-03-20' }
    ];

    const demoPosts = [
  {
    id: 1,
    title: 'Welcome to ContentFlow CMS - React Version',
    content: 'This is a fully functional content management system built with React! You can create, edit, and delete posts, as well as manage users.',
    author: 'admin',
    date: '2025-10-16T10:00:00Z',  // Today
    status: 'published',
    category: 'Announcement'
  },
  {
    id: 2,
    title: 'Getting Started with React',
    content: 'Learn how to use this React-based CMS effectively. This guide will walk you through all the features available.',
    author: 'editor',
    date: '2025-10-15T14:30:00Z',  // 1 day ago
    status: 'draft',
    category: 'Tutorial'
  },
  {
    id: 3,
    title: 'New Features Released in Version 2.0',
    content: 'We are excited to announce the release of ContentFlow CMS 2.0! This update includes improved user interface, better performance, and new customization options for your content management needs.',
    author: 'admin',
    date: '2025-10-14T09:20:00Z',  // 2 days ago
    status: 'published',
    category: 'News'
  },
  {
    id: 4,
    title: 'Top 10 Content Management Tips',
    content: 'Discover the best practices for managing your blog content effectively. From organizing categories to scheduling posts, these tips will help you streamline your content workflow and engage your audience better.',
    author: 'editor',
    date: '2025-10-13T16:45:00Z',  // 3 days ago
    status: 'published',
    category: 'General'
  },
  {
    id: 5,
    title: 'Security Updates and Best Practices',
    content: 'Stay informed about the latest security updates for ContentFlow CMS. Learn about user authentication, data protection, and how to keep your content management system secure from potential threats.',
    author: 'admin',
    date: '2025-10-12T11:10:00Z',  // 4 days ago
    status: 'draft',
    category: 'News'
  },
  {
    id: 6,
    title: 'Advanced React Patterns',
    content: 'Explore advanced React patterns like render props, HOCs, and compound components to build more flexible and reusable components.',
    author: 'admin',
    date: '2025-10-11T13:00:00Z',  // 5 days ago
    status: 'published',
    category: 'Tutorial'
  },
  {
    id: 7,
    title: 'State Management with Context API',
    content: 'Learn how to manage global state in React applications using the Context API, avoiding prop drilling and improving code maintainability.',
    author: 'editor',
    date: '2025-10-10T08:30:00Z',  // 6 days ago
    status: 'draft',
    category: 'Tutorial'
  },
  {
    id: 8,
    title: 'Responsive Design Best Practices',
    content: 'Discover the key principles of responsive web design and how to create websites that look great on all devices using CSS media queries and flexible layouts.',
    author: 'admin',
    date: '2025-10-09T15:20:00Z',  // 7 days ago
    status: 'published',
    category: 'General'
  }
];

    setUsers(demoUsers);
    setPosts(demoPosts);
  }, []);

  const handleLogin = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleCreatePost = (postData) => {
    const newPost = { ...postData, id: Date.now(), author: currentUser.username, date: new Date().toISOString() };
    setPosts([newPost, ...posts]);
  };

  const handleUpdatePost = (id, postData) => {
    setPosts(posts.map(p => p.id === id ? { ...p, ...postData } : p));
  };

   const handleDeletePost = (id) => {
  setPosts(posts.filter(p => p.id !== id));
  };

  const handleCreateUser = (userData) => {
    const newUser = { ...userData, id: Date.now() };
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (id, userData) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...userData } : u));
  };

  const handleDeleteUser = (id) => {
  setUsers(users.filter(u => u.id !== id));
};

  return (
    <div className="app">
     
      {currentUser && (
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
      )}

      {!currentUser ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <Dashboard
          currentUser={currentUser}
          posts={posts}
          users={users}
          onLogout={handleLogout}
          onCreatePost={handleCreatePost}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
          onCreateUser={handleCreateUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </div>
  );
}

export default App;