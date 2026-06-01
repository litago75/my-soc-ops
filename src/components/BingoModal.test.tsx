import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BingoModal } from './BingoModal';
import { CELEBRATION_VARIANTS } from '../utils/celebrationVariants';

describe('BingoModal', () => {
  it('renders with the default (first) variant when no variant prop is provided', () => {
    const onDismiss = vi.fn();
    render(<BingoModal onDismiss={onDismiss} />);

    expect(screen.getByRole('heading', { name: /BINGO!/i })).toBeInTheDocument();
    expect(screen.getByText(CELEBRATION_VARIANTS[0].message)).toBeInTheDocument();
  });

  it('renders the provided variant heading and message', () => {
    const variant = CELEBRATION_VARIANTS[2]; // fire variant
    render(<BingoModal onDismiss={vi.fn()} variant={variant} />);

    expect(screen.getByRole('heading', { name: variant.heading })).toBeInTheDocument();
    expect(screen.getByText(variant.message)).toBeInTheDocument();
  });

  it('renders Keep Playing button', () => {
    render(<BingoModal onDismiss={vi.fn()} />);
    expect(screen.getByRole('button', { name: /keep playing/i })).toBeInTheDocument();
  });

  it('calls onDismiss when Keep Playing button is clicked', () => {
    const onDismiss = vi.fn();
    render(<BingoModal onDismiss={onDismiss} />);

    fireEvent.click(screen.getByRole('button', { name: /keep playing/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders as an accessible dialog', () => {
    render(<BingoModal onDismiss={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('applies an animation class to the modal panel', () => {
    const variant = CELEBRATION_VARIANTS[1]; // stellar variant
    const { container } = render(<BingoModal onDismiss={vi.fn()} variant={variant} />);
    const panels = container.querySelectorAll('[class*="animate-"]');
    expect(panels.length).toBeGreaterThan(0);
  });

  it('renders all 5 celebration variants without errors', () => {
    for (const variant of CELEBRATION_VARIANTS) {
      const { unmount } = render(<BingoModal onDismiss={vi.fn()} variant={variant} />);
      expect(screen.getByRole('heading', { name: variant.heading })).toBeInTheDocument();
      expect(screen.getByText(variant.message)).toBeInTheDocument();
      unmount();
    }
  });

  it('has aria-labelledby pointing to the heading', () => {
    render(<BingoModal onDismiss={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'bingo-heading');
    expect(document.getElementById('bingo-heading')).toBeInTheDocument();
  });
});
