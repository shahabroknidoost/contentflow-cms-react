/* eslint-disable */
// cypress/e2e/posts.cy.js

describe('Post Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('http://localhost:5173');
    cy.get('input[id="username-input"]').type('admin');
    cy.get('input[id="password-input"]').type('admin123');
    cy.contains('button', 'Sign In').click();
    cy.contains('Welcome back, admin!').should('be.visible');
  });

  it('should display existing posts', () => {
    cy.contains('Blog Posts').should('be.visible');
    cy.get('.post-card').should('have.length.greaterThan', 0);
  });

  it('should create a new post', () => {
    cy.contains('button', 'New Post').click();
    
    // Wait for modal
    cy.contains('Create Post').should('be.visible');
    
    // Fill form - FIXED: Use label text instead of IDs
    cy.contains('label', 'Title').parent().find('input').type('Cypress E2E Test Post');
    cy.contains('label', 'Content').parent().find('textarea').type('This post was created automatically by Cypress!');
    
    // Click Create
    cy.contains('button', 'Create').click();
    
    // Verify post appears
    cy.contains('Cypress E2E Test Post').should('be.visible');
  });

  it('should open preview modal', () => {
    // Click first preview button
    cy.get('[aria-label*="Preview post"]').first().click();
    
    // Modal appears
    cy.get('.modal').should('be.visible');
    
    // Close modal (press Escape or click close button)
    cy.get('body').type('{esc}');
  });

  it('should edit a post', () => {
    // Click first edit button
    cy.get('[aria-label*="Edit post"]').first().click();
    
    // Modal appears
    cy.contains('Edit Post').should('be.visible');
    
    // Change title - FIXED: Use label
    cy.contains('label', 'Title').parent().find('input').clear().type('Updated by Cypress');
    
    // Save
    cy.contains('button', 'Update').click();
    
    // Verify
    cy.contains('Updated by Cypress').should('be.visible');
  });

  it('should navigate to Users tab', () => {
    cy.contains('button', 'Users').click();
    
    // FIXED: Check for what's actually on the page
    cy.get('.users-table').should('be.visible');
  });
});