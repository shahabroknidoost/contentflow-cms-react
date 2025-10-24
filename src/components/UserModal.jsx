// components/UserModal.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Eye, EyeOff } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

function UserModal({ user, users, onSave, onClose }) {
  const modalRef = useFocusTrap(true);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'editor'
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role
      });
    }
  }, [user]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  const roleOptions = [
    { value: 'editor', label: 'Editor' },
    { value: 'admin', label: 'Admin' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setErrors({});
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    const existingUser = users.find(u => 
      u.username === formData.username && u.id !== (user ? user.id : null)
    );
    
    if (existingUser) {
      newErrors.username = 'Username already exists';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div 
      className="modal active" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="modal-header">
          <h3 id="user-modal-title">{user ? 'Edit User' : 'Create User'}</h3>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              aria-required="true"
              aria-invalid={errors.username ? 'true' : 'false'}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
            {errors.username && (
              <span className="error-text" id="username-error" role="alert">
                {errors.username}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email-input">Email</label>
            <input
              id="email-input"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              aria-required="true"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span className="error-text" id="email-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password-input">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                aria-required="true"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-text" id="password-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="role-select">Role</label>
            <Select
              inputId="role-select"
              options={roleOptions}
              value={roleOptions.find(opt => opt.value === formData.role)}
              onChange={(selected) => setFormData(prev => ({ ...prev, role: selected.value }))}
              maxMenuHeight={80}
              isSearchable={false}
              menuPosition="fixed"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '42px',
                  borderColor: '#d1d5db',
                  '&:hover': { borderColor: '#d1d5db' }
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '8px',
                  overflow: 'hidden'
                })
              }}
            />
          </div>
          
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              {user ? 'Update' : 'Create'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;