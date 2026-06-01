import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StartScreen } from './StartScreen';
import { BingoModal } from './BingoModal';

describe('skeuomorphic sticker UI', () => {
  it('renders sticker start messaging and starts the game', () => {
    const onStart = vi.fn();

    render(<StartScreen onStart={onStart} />);

    expect(screen.getByText('Sticker Party Edition')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('shows updated bingo modal copy and dismisses', () => {
    const onDismiss = vi.fn();

    render(<BingoModal onDismiss={onDismiss} />);

    expect(screen.getByText('You completed a sticker line!')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Keep Playing' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
