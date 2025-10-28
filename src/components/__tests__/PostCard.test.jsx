import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from '../PostCard';

describe('PostCard Component', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test content',
    author: 'admin',
    date: '2024-10-16T10:00:00Z',
    status: 'published',
    category: 'Tutorial'
  };

  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onPreview: vi.fn()
  };

  it('renders post title', () => {
    render(<PostCard post={mockPost} {...mockHandlers} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  it('renders post content', () => {
    render(<PostCard post={mockPost} {...mockHandlers} />);
    expect(screen.getByText(/Test content/)).toBeInTheDocument();
  });

  it('renders author name', () => {
    render(<PostCard post={mockPost} {...mockHandlers} />);
    expect(screen.getByText(/By admin/i)).toBeInTheDocument();
  });

  it('calls onPreview when preview button clicked', () => {
    render(<PostCard post={mockPost} {...mockHandlers} />);
    
    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);
    
    expect(mockHandlers.onPreview).toHaveBeenCalledWith(mockPost);
  });

  it('calls onEdit when edit button clicked', () => {
    render(<PostCard post={mockPost} {...mockHandlers} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockPost);
  });

  it('has delete button', () => {
    render(<PostCard post={mockPost} {...mockHandlers} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
    
  });
});