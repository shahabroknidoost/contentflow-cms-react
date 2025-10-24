// components/PostsTab.jsx
import React, { useState } from 'react';
import PostCard from './PostCard';
import PostModal from './PostModal';
import PreviewModal from './PreviewModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PlusIcon from '../svg/plus.svg?react';

function PostsTab({ posts, onCreatePost, onUpdatePost, onDeletePost }) {
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handleOpenModal = (post = null) => {
    setEditingPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPost(null);
  };

  const handleSavePost = (postData) => {
    if (editingPost) {
      onUpdatePost(editingPost.id, postData);
    } else {
      onCreatePost(postData);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      onDeletePost(postToDelete);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setPostToDelete(null);
  };

  return (
    <>
      <div className="content-header">
        <h2>Blog Posts</h2>
        <button className="btn btn-primary" 
        onClick={() => handleOpenModal()}
        aria-label="Create a new blog post"
        >
          <PlusIcon className="icon" />
          New Post
        </button>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
            No posts yet. Create your first post!
          </p>
        ) : (
          <>
            {currentPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleOpenModal}
                onDelete={handleDeleteClick}
                onPreview={setPreviewPost}
              />
            ))}

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="btn btn-secondary pagination-arrow"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  title="Previous page"
                  aria-label="Go to previous page"
                  aria-disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} />
                </button>
                
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button 
                  className="btn btn-secondary pagination-arrow"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  title="Next page"
                  aria-label="Go to next page"
                  aria-disabled={currentPage === totalPages}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <PostModal
          post={editingPost}
          onSave={handleSavePost}
          onClose={handleCloseModal}
        />
      )}

      {previewPost && (
        <PreviewModal
          post={previewPost}
          onClose={() => setPreviewPost(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
      <div 
       className="modal active" 
     onClick={cancelDelete}
     role="alertdialog"
     aria-modal="true"
     aria-labelledby="delete-post-modal-title"
     aria-describedby="delete-post-modal-description"
     >
     <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3 id="delete-post-modal-title">Delete Post</h3>
        <button 
          className="close-btn" 
          onClick={cancelDelete}
          aria-label="Cancel delete"
        >
          &times;
        </button>
      </div>
      
      <div className="modal-body">
        <p 
          id="delete-post-modal-description"
          style={{ marginBottom: '24px', color: '#6b7280', fontSize: '15px' }}
        >
          Are you sure you want to delete this post? This action cannot be undone.
        </p>
        
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={confirmDelete}>
            Delete
          </button>
          <button className="btn btn-secondary" onClick={cancelDelete}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}

export default PostsTab;