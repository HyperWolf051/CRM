import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Modal from '../Modal';

describe('Modal', () => {
  beforeEach(() => {
    // Mock body style
    document.body.style = {};
  });

  afterEach(() => {
    // Clean up body style
    document.body.style.overflow = 'unset';
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const title = screen.getByText('Test Modal');
    const dialog = screen.getByRole('dialog');
    
    expect(title).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(title).toHaveAttribute('id', 'modal-title');
  });

  it('renders without title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument(); // No close button without title
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    );
    
    // Click on backdrop (the div with bg-black bg-opacity-50)
    const backdrop = document.querySelector('.bg-black.bg-opacity-50');
    fireEvent.click(backdrop);
    
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when ESC key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose when ESC is pressed and modal is closed', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={false} onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('renders footer when provided', () => {
    const footer = (
      <div>
        <button>Cancel</button>
        <button>Save</button>
      </div>
    );
    
    render(
      <Modal isOpen={true} onClose={() => {}} footer={footer}>
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} className="custom-modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('custom-modal');
  });

  it('sets aria-modal and role attributes correctly', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('role', 'dialog');
  });

  it('prevents body scroll when open', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    // Close modal
    rerender(
      <Modal isOpen={false} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('unset');
  });

  it('focuses first focusable element when opened', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <input data-testid="first-input" />
        <button>Second button</button>
      </Modal>
    );
    
    // The close button in the header should be focused first
    const closeButton = screen.getByLabelText('Close modal');
    expect(closeButton).toHaveFocus();
  });

  it('traps focus within modal', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <input data-testid="first-input" />
        <button data-testid="last-button">Last button</button>
      </Modal>
    );
    
    const closeButton = screen.getByLabelText('Close modal');
    const firstInput = screen.getByTestId('first-input');
    const lastButton = screen.getByTestId('last-button');
    
    // Verify focusable elements exist
    expect(closeButton).toBeInTheDocument();
    expect(firstInput).toBeInTheDocument();
    expect(lastButton).toBeInTheDocument();
    
    // Verify close button gets initial focus
    expect(closeButton).toHaveFocus();
  });

  it('ignores non-Tab keys in focus trap', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <input data-testid="input" />
      </Modal>
    );
    
    // Press other keys - should not affect focus trap
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Space' });
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    
    // Only ESC should trigger onClose
    expect(handleClose).not.toHaveBeenCalled();
  });
});