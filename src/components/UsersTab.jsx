// components/UsersTab.jsx
import React, { useState } from 'react';
import UserModal from './UserModal';
import EditIcon from '../svg/edit.svg?react';
import TrashIcon from '../svg/trash.svg?react';
import PlusIcon from '../svg/plus.svg?react';

function UsersTab({ users, currentUser, onCreateUser, onUpdateUser, onDeleteUser }) {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      onUpdateUser(editingUser.id, userData);
    } else {
      onCreateUser(userData);
    }
    handleCloseModal();
  };

  return (
    <>
      <div className="content-header">
        <h2>Users</h2>
        {currentUser.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <PlusIcon className="icon" />
            New User
          </button>
        )}
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.id}>
                <td><strong>{user.username}</strong></td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge badge-${user.role}`}>{user.role}</span>
                </td>
                <td>{new Date(user.joinedDate || Date.now()).toLocaleDateString('en-GB')}</td>
                <td>
                  <div className="user-actions">
                    <button 
                      className="icon-btn edit" 
                      onClick={() => handleOpenModal(user)} 
                      title="Edit"
                      aria-label={`Edit user: ${user.username}`}
                    >
                      <EditIcon className="icon" />
                    </button>
                    {user.id !== currentUser.id && (
                      <button 
                        className="icon-btn delete" 
                        onClick={() => handleDeleteClick(user.id)} 
                        title="Delete"
                        aria-label={`Delete user: ${user.username}`}
                      >
                        <TrashIcon className="icon" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* User Edit/Create Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          users={users}
          onSave={handleSaveUser}
          onClose={handleCloseModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="modal active" onClick={cancelDelete}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete User</h3>
              <button className="close-btn" onClick={cancelDelete}>&times;</button>
            </div>
            
            <div className="modal-body">
              <p style={{ marginBottom: '24px', color: '#6b7280', fontSize: '15px' }}>
                Are you sure you want to delete this user? This action cannot be undone.
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

export default UsersTab;