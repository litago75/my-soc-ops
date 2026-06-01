import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StartScreen } from './StartScreen';

describe('StartScreen round modifier selection', () => {
  it('starts with default "none" modifier', () => {
    const onStart = vi.fn();

    render(<StartScreen onStart={onStart} />);
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));

    expect(onStart).toHaveBeenCalledWith('none');
  });

  it('passes selected random modifier option', () => {
    const onStart = vi.fn();

    render(<StartScreen onStart={onStart} />);
    fireEvent.change(screen.getByLabelText('Round modifier (optional)'), {
      target: { value: 'random' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));

    expect(onStart).toHaveBeenCalledWith('random');
  });

  it('passes selected concrete modifier option', () => {
    const onStart = vi.fn();

    render(<StartScreen onStart={onStart} />);
    fireEvent.change(screen.getByLabelText('Round modifier (optional)'), {
      target: { value: 'double-score-diagonal' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));

    expect(onStart).toHaveBeenCalledWith('double-score-diagonal');
  });
});
