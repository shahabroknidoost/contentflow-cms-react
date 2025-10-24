// components/LoginScreen.jsx
import React, { useState } from 'react';

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});  

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setValidationErrors({});
    
    // Validate fields
    const newErrors = {};  
    
    if (!username.trim()) {  
      newErrors.username = 'Username is required';
    }
    
    if (!password.trim()) {  
      newErrors.password = 'Password is required';
    }
    
    // If validation errors, show them and stop
    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }
    
    // Try to login
    const success = onLogin(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>ContentFlow CMS</h1>
          <p>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message" role="alert" aria-live="assertive">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                
                
                // Clear error when user starts typing
                if (validationErrors.username) {
                  setValidationErrors(prev => ({ ...prev, username: '' }));
                }
              }}
              placeholder="Enter your username"
              aria-required="true"
              aria-invalid={validationErrors.username ? 'true' : 'false'}
              aria-describedby={validationErrors.username ? 'username-error' : undefined}
              className={validationErrors.username ? 'error' : ''}
            />
            {validationErrors.username && (
              <span className="error-text" id="username-error" role="alert">
                {validationErrors.username}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                
                
                // Clear error when user starts typing
                if (validationErrors.password) {
                  setValidationErrors(prev => ({ ...prev, password: '' }));
                }
              }}
              placeholder="Enter your password"
              aria-required="true"
              aria-invalid={validationErrors.password ? 'true' : 'false'}
              aria-describedby={validationErrors.password ? 'password-error' : undefined}
              className={validationErrors.password ? 'error' : ''}
            />
            {validationErrors.password && (
              <span className="error-text" id="password-error" role="alert">
                {validationErrors.password}
              </span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            aria-label="Sign in to ContentFlow CMS"
          >
            Sign In
          </button>
        </form>
        
        <div className="demo-credentials">
          <p><strong>Demo Accounts:</strong></p>
          <p>Admin: admin / admin123</p>
          <p>Editor: editor / editor123</p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;