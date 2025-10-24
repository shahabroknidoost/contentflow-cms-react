// components/PostCard.jsx
import React from 'react';

import EditIcon from '../svg/edit.svg?react';
import TrashIcon from '../svg/trash.svg?react';
import ViewIcon from '../svg/view.svg?react';

function PostCard({ post, onEdit, onDelete, onPreview }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-info">
          <div className="post-title-row">
            <h3 className="post-title">{post.title}</h3>
            <span className={`badge badge-${post.status}`}>{post.status}</span>
          </div>
          <p className="post-content">{post.content.substring(0, 150)}...</p>
          <div className="post-meta">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{formatDate(post.date)}</span>
            <span>•</span>
            <span>{post.category}</span>
          </div>
        </div>
        <div className="post-actions">
          <button className="icon-btn preview" 
          onClick={() => onPreview(post)} 
          title="Preview"
            aria-label={`Preview post: ${post.title}`}
         >
            <ViewIcon className="icon" />
          </button>

          <button className="icon-btn edit" 
          onClick={() => onEdit(post)} 
          title="Edit"
          aria-label={`Edit post: ${post.title}`}
          >
            <EditIcon className="icon" />
          </button>

          <button className="icon-btn delete"
          onClick={() => onDelete(post.id)} 
          title="Delete"
          aria-label={`Delete post: ${post.title}`}
  >
            <TrashIcon className="icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;