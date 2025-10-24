// src/components/__tests__/LoginScreen.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginScreen from '../LoginScreen';

describe('LoginScreen Component', () => {
  it('renders login form', () => {
    const mockLogin = vi.fn();
    render(<LoginScreen onLogin={mockLogin} />);
    
    // Check if elements exist
    expect(screen.getByText('ContentFlow CMS')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('shows error when fields are empty', () => {
    const mockLogin = vi.fn();
    render(<LoginScreen onLogin={mockLogin} />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);
    
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('calls onLogin when form is submitted with valid data', () => {
    const mockLogin = vi.fn().mockReturnValue(true);
    render(<LoginScreen onLogin={mockLogin} />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(signInButton);
    
    expect(mockLogin).toHaveBeenCalledWith('admin', 'admin123');
  });

  it('shows error message when login fails', () => {
    const mockLogin = vi.fn().mockReturnValue(false);
    render(<LoginScreen onLogin={mockLogin} />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(usernameInput, { target: { value: 'wrong' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(signInButton);
    
    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
  });
});