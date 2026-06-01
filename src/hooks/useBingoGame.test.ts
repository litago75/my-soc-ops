import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBingoGame } from './useBingoGame';

async function markSquares(
  clickSquare: (id: number) => void,
  ids: number[]
): Promise<void> {
  await act(async () => {
    ids.forEach((id) => clickSquare(id));
    await Promise.resolve();
  });
}

describe('useBingoGame modifiers', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('applies random modifier selection at game start', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.95);
    const { result } = renderHook(() => useBingoGame());

    act(() => {
      result.current.startGame('random');
    });

    expect(result.current.activeModifier).toBe('speed-round-bonus-window');
  });

  it('doubles score when diagonal line wins with diagonal modifier', async () => {
    const { result } = renderHook(() => useBingoGame());

    act(() => {
      result.current.startGame('double-score-diagonal');
    });

    await markSquares(result.current.handleSquareClick, [0, 6, 18, 24]);

    expect(result.current.gameState).toBe('bingo');
    expect(result.current.winningLine?.type).toBe('diagonal');
    expect(result.current.score).toBe(200);
  });

  it('applies speed bonus only inside the 30-second window', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
    const { result } = renderHook(() => useBingoGame());

    act(() => {
      result.current.startGame('speed-round-bonus-window');
    });

    vi.advanceTimersByTime(30_001);
    await markSquares(result.current.handleSquareClick, [0, 1, 2, 3, 4]);

    expect(result.current.score).toBe(100);
  });

  it('allows wildcard claim once and keeps claimed square marked', async () => {
    const { result } = renderHook(() => useBingoGame());

    act(() => {
      result.current.startGame('wildcard-square');
    });

    act(() => {
      result.current.activateWildcard();
    });

    expect(result.current.wildcardArmed).toBe(true);

    await act(async () => {
      result.current.handleSquareClick(0);
      await Promise.resolve();
    });

    expect(result.current.wildcardUsed).toBe(true);
    expect(result.current.wildcardArmed).toBe(false);
    expect(result.current.board[0].isMarked).toBe(true);

    act(() => {
      result.current.handleSquareClick(0);
      result.current.activateWildcard();
    });

    expect(result.current.board[0].isMarked).toBe(true);
    expect(result.current.wildcardArmed).toBe(false);

    await markSquares(result.current.handleSquareClick, [1, 2, 3, 4]);
    expect(result.current.score).toBe(125);
  });
});
