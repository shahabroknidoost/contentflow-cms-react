// components/PreviewModal.jsx
import React, { useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap'; 

function PreviewModal({ post, onClose }) {
  const modalRef = useFocusTrap(true);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="modal active" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div 
        className="modal-content modal-large" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="modal-header">
          <h3 id="preview-modal-title">Preview</h3>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close preview modal"
          >
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          <article>
            <h1 className="preview-title">{post.title}</h1>
            <div className="preview-meta">
              <span>By {post.author}</span>
              <span aria-hidden="true">•</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">•</span>
              <span className={`badge badge-${post.status}`}>
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
              <span aria-hidden="true">•</span>
              <span>{post.category}</span>
            </div>
            <div className="preview-content">{post.content}</div>
          </article>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;