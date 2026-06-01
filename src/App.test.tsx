import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('App modifier integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows selected modifier label in game screen', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Round modifier (optional)'), {
      target: { value: 'wildcard-square' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));

    expect(screen.getByText('Modifier: Wildcard square')).toBeInTheDocument();
  });

  it('applies speed bonus score within 30-second window', async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Round modifier (optional)'), {
      target: { value: 'speed-round-bonus-window' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));

    const squares = Array.from(document.querySelectorAll('button[aria-label]')) as HTMLButtonElement[];
    [0, 1, 2, 3, 4].forEach((idx) => {
      fireEvent.click(squares[idx]);
    });

    await waitFor(() => {
      expect(screen.getByText('Score: 150')).toBeInTheDocument();
    });
  });

  it('applies diagonal double-score modifier on diagonal bingo', async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Round modifier (optional)'), {
      target: { value: 'double-score-diagonal' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));

    const squares = Array.from(document.querySelectorAll('button[aria-label]')) as HTMLButtonElement[];
    [0, 6, 18, 24].forEach((idx) => {
      fireEvent.click(squares[idx]);
    });

    await waitFor(() => {
      expect(screen.getByText('Score: 200')).toBeInTheDocument();
    });
  });
});
