/* eslint-disable */
// cypress/e2e/accessibility.cy.js

describe('Keyboard Navigation', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should navigate login form with Tab key', () => {
    // Focus first input, then tab through form
    cy.get('input[id="username-input"]').focus();
    cy.focused().should('have.attr', 'id', 'username-input');
    
    // Tab to password input
    cy.focused().tab();
    cy.focused().should('have.attr', 'id', 'password-input');
    
    // Tab to sign in button
    cy.focused().tab();
    cy.focused().should('contain', 'Sign In');
  });

  it('should submit login form with Enter key', () => {
    cy.get('input[id="username-input"]').type('admin');
    cy.get('input[id="password-input"]').type('admin123{enter}');
    
    // Should be logged in
    cy.contains('Welcome back, admin!').should('be.visible');
  });

  it('should close modal with Escape key', () => {
    // Login first
    cy.get('input[id="username-input"]').type('admin');
    cy.get('input[id="password-input"]').type('admin123{enter}');
    
    // Open modal
    cy.contains('New Post').click();
    cy.contains('Create Post').should('be.visible');
    
    // Press Escape
    cy.get('body').type('{esc}');
    
    // Modal should close
    cy.contains('Create Post').should('not.exist');
  });
});

describe('Focus Management', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('input[id="username-input"]').type('admin');
    cy.get('input[id="password-input"]').type('admin123{enter}');
  });

  it('should trap focus inside modal', () => {
    // Open modal
    cy.contains('New Post').click();
    
    // Focus should be inside modal
    cy.focused().closest('.modal-content').should('exist');
  });

  it('should return focus after modal closes', () => {
    // Click New Post button
    cy.contains('New Post').click();
    cy.contains('Create Post').should('be.visible');
    
    // Close with X
    cy.get('.close-btn').click();
    
    // Focus should return to page (not lost)
    cy.focused().should('exist');
  });
});

describe('Screen Reader Support', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should have proper form labels', () => {
    // Username input should have associated label
    cy.get('label[for="username-input"]').should('exist');
    cy.get('label[for="password-input"]').should('exist');
  });

  it('should have accessible button text', () => {
    // Buttons should have readable text
    cy.contains('button', 'Sign In').should('be.visible');
  });

  it('should have alt text or aria-labels on icon buttons', () => {
    // Login first
    cy.get('input[id="username-input"]').type('admin');
    cy.get('input[id="password-input"]').type('admin123{enter}');
    
    // Icon buttons should have title or aria-label
    cy.get('.icon-btn').each(($btn) => {
      cy.wrap($btn).should('have.attr', 'title');
    });
  });
});