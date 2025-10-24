/* eslint-disable */
// cypress/e2e/login.cy.js

describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should display login form', () => {
    cy.contains('ContentFlow CMS').should('be.visible');
    cy.contains('Sign in to your account').should('be.visible');
    cy.get('input[id="username-input"]').should('be.visible');
    cy.get('input[id="password-input"]').should('be.visible');
  });

  it('should show error for empty fields', () => {
    cy.contains('button', 'Sign In').click();
    
    cy.contains('Username is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[id="username-input"]').type('wronguser');
    cy.get('input[id="password-input"]').type('wrongpass');
    cy.contains('button', 'Sign In').click();
    
    cy.contains('Invalid username or password').should('be.visible');
  });

  it('should login successfully with admin credentials', () => {
    cy.get('input[id="username-input"]').type('admin');
    cy.get('input[id="password-input"]').type('admin123');
    cy.contains('button', 'Sign In').click();
    
    cy.contains('Welcome back, admin!').should('be.visible');
    cy.contains('Blog Posts').should('be.visible');
    cy.contains('New Post').should('be.visible');
  });

  it('should login successfully with editor credentials', () => {
    cy.get('input[id="username-input"]').type('editor');
    cy.get('input[id="password-input"]').type('editor123');
    cy.contains('button', 'Sign In').click();
    
    cy.contains('Welcome back, editor!').should('be.visible');
  });
});