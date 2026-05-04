/* eslint-disable */
// cypress/e2e/navigation.cy.js

describe('Navigation & UI', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('input[id="username-input"]').type('admin');
    cy.get('input[id="password-input"]').type('admin123');
    cy.contains('button', 'Sign In').click();
    cy.contains('Welcome back, admin!').should('be.visible');
  });

  it('should switch between Posts and Users tabs', () => {
    // Start on Posts
    cy.contains('Blog Posts').should('be.visible');
    
    // Go to Users
    cy.contains('Users').click();
    cy.get('table').should('be.visible');
    
    // Back to Posts
    cy.contains('Posts').click();
    cy.contains('Blog Posts').should('be.visible');
  });

  it('should paginate through posts', () => {
    // Check pagination exists
    cy.get('.pagination').should('be.visible');
    
    // Click next page (if more than 5 posts)
    cy.get('.pagination button').last().click();
    
    // Should still see posts
    cy.get('.post-card').should('exist');
  });

  it('should close modal when clicking outside', () => {
    // Open post modal
    cy.contains('New Post').click();
    cy.contains('Create Post').should('be.visible');
    
    // Click outside (on overlay)
    cy.get('.modal').click('topLeft');
    
    // Modal should close
    cy.contains('Create Post').should('not.exist');
  });

  it('should close modal with X button', () => {
    cy.contains('New Post').click();
    cy.contains('Create Post').should('be.visible');
    
    // Click X button
    cy.get('.close-btn').click();
    
    // Modal should close
    cy.contains('Create Post').should('not.exist');
  });

  it('should logout successfully', () => {
    // Click logout
    cy.contains('Logout').click();
    
    // Should be back on login page
    cy.contains('Sign in to your account').should('be.visible');
    cy.get('input[id="username-input"]').should('be.visible');
  });
});

describe('Delete Confirmation Modal', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('input[id="username-input"]').type('admin');
    cy.get('input[id="password-input"]').type('admin123');
    cy.contains('button', 'Sign In').click();
  });

  it('should show delete confirmation when deleting post', () => {
    // Click delete on first post
    cy.get('.icon-btn.delete').first().click();
    
    // Confirmation modal should appear
    cy.contains('Delete').should('be.visible');
    cy.contains('Are you sure').should('be.visible');
  });

  it('should cancel delete when clicking Cancel', () => {
    // Get initial post count
    cy.get('.post-card').its('length').then((initialCount) => {
      
      // Click delete
      cy.get('.icon-btn.delete').first().click();
      
      // Click Cancel
      cy.contains('button', 'Cancel').click();
      
      // Post count should be same
      cy.get('.post-card').should('have.length', initialCount);
    });
  });

  it('should delete post when confirming', () => {
    // Get the title of first post before deleting
    cy.get('.post-card').first().find('.post-title').invoke('text').then((postTitle) => {
      
      // Click delete on first post
      cy.get('.icon-btn.delete').first().click();
      
      // Confirm delete
      cy.get('.btn-danger').click();
      
      // That specific post title should no longer exist on this page
      cy.contains('.post-title', postTitle.trim()).should('not.exist');
    });
  });
});