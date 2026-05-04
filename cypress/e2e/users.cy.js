/* eslint-disable */
// cypress/e2e/users.cy.js

describe('User Management', () => {
  
  // Login as admin before each test
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('input[id="username-input"]').type('admin');
    cy.get('input[id="password-input"]').type('admin123');
    cy.contains('button', 'Sign In').click();
    cy.contains('Welcome back, admin!').should('be.visible');
  });

  it('should navigate to Users tab', () => {
    cy.contains('Users').click();
    cy.contains('Users').should('be.visible');
  });

  it('should display existing users in table', () => {
    cy.contains('Users').click();
    cy.get('table').should('be.visible');
    cy.contains('admin').should('be.visible');
    cy.contains('editor').should('be.visible');
  });

  it('should open create user modal', () => {
    cy.contains('Users').click();
    cy.contains('New User').click();
    cy.contains('Create User').should('be.visible');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('should show validation errors for empty user form', () => {
    cy.contains('Users').click();
    cy.contains('New User').click();
    cy.contains('button', 'Create').click();
    
    // Check for validation error messages
    cy.contains('Username is required').should('be.visible');
  });

  it('should show error for duplicate username', () => {
    cy.contains('Users').click();
    cy.contains('New User').click();
    
    cy.get('input[name="username"]').type('admin'); // Already exists!
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.contains('button', 'Create').click();
    
    cy.contains('Username already exists').should('be.visible');
  });

  it('should show error for invalid email format', () => {
    cy.contains('Users').click();
    cy.contains('New User').click();
    
    cy.get('input[name="username"]').type('newuser');
    cy.get('input[name="email"]').type('invalidemail'); // Bad format
    cy.get('input[name="password"]').type('password123');
    cy.contains('button', 'Create').click();
    
    cy.contains('Please enter a valid email').should('be.visible');
  });

  it('should create a new user successfully', () => {
    cy.contains('Users').click();
    cy.contains('New User').click();
    
    const uniqueUsername = `testuser_${Date.now()}`;
    cy.get('input[name="username"]').type(uniqueUsername);
    cy.get('input[name="email"]').type(`${uniqueUsername}@test.com`);
    cy.get('input[name="password"]').type('password123');
    cy.contains('button', 'Create').click();
    
    // Modal should close and user should appear
    cy.contains(uniqueUsername).should('be.visible');
  });

  it('should toggle password visibility', () => {
    cy.contains('Users').click();
    cy.contains('New User').click();
    
    // Type password
    cy.get('input[name="password"]').type('secret123');
    
    // Initially hidden
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    
    // Click eye icon to show
    cy.get('[data-testid="toggle-password"]').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    
    // Click again to hide
    cy.get('[data-testid="toggle-password"]').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });
});

describe('User Management - Editor Role', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('input[id="username-input"]').type('editor');
    cy.get('input[id="password-input"]').type('editor123');
    cy.contains('button', 'Sign In').click();
  });

  it('should NOT show Users tab for editor role', () => {
    cy.contains('Users').should('not.exist');
  });
});