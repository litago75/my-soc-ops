import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useBingoGame } from './useBingoGame';

describe('useBingoGame social mechanics', () => {
  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('transitions countdown mode to timeout when timer expires', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBingoGame());

    act(() => {
      result.current.startGame('countdown');
    });

    expect(result.current.socialMode).toBe('countdown');
    expect(result.current.timeRemaining).toBe(120);
    expect(result.current.gameState).toBe('playing');

    act(() => {
      vi.advanceTimersByTime(120_000);
    });

    expect(result.current.timeRemaining).toBe(0);
    expect(result.current.gameState).toBe('timeout');
  });

  it('tracks team score and winning team when a bingo line is completed', async () => {
    const { result } = renderHook(() => useBingoGame());

    act(() => {
      result.current.startGame('team');
    });

    [0, 1, 2, 3, 4].forEach((squareId) => {
      act(() => {
        result.current.handleSquareClick(squareId);
      });
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.gameState).toBe('bingo');
    expect(result.current.teamWinner).toBe('spark');
    expect(result.current.teamScores).toEqual({ spark: 6, pop: 2 });
  });
});
