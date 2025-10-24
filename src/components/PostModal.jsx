// components/PostModal.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFocusTrap } from '../hooks/useFocusTrap';

function PostModal({ post, onSave, onClose }) {
  const modalRef = useFocusTrap(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    status: 'draft'
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        status: post.status
      });
    }
  }, [post]);

  // Escape key support
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const categoryOptions = [
    { value: 'General', label: 'General' },
    { value: 'Tutorial', label: 'Tutorial' },
    { value: 'News', label: 'News' },
    { value: 'Announcement', label: 'Announcement' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div 
      className="modal active" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-modal-title"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="modal-header">
          <h3 id="post-modal-title">{post ? 'Edit Post' : 'Create Post'}</h3>
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
            <label htmlFor="post-title-input">Title</label>
            <input
              id="post-title-input"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
              aria-required="true"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="post-content-input">Content</label>
            <textarea
              id="post-content-input"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content..."
              rows="8"
              required
              aria-required="true"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="post-category-select">Category</label>
              <Select
                inputId="post-category-select"
                options={categoryOptions}
                value={categoryOptions.find(opt => opt.value === formData.category)}
                onChange={(selected) => setFormData(prev => ({ ...prev, category: selected.value }))}
                isSearchable={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '42px',
                    borderColor: '#d1d5db',
                    '&:hover': { borderColor: '#d1d5db' }
                  })
                }}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="post-status-select">Status</label>
              <Select
                inputId="post-status-select"
                options={statusOptions}
                value={statusOptions.find(opt => opt.value === formData.status)}
                onChange={(selected) => setFormData(prev => ({ ...prev, status: selected.value }))}
                isSearchable={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '42px',
                    borderColor: '#d1d5db',
                    '&:hover': { borderColor: '#d1d5db' }
                  })
                }}
              />
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              {post ? 'Update' : 'Create'}
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

export default PostModal;