import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBingoGame } from './useBingoGame';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

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
    localStorageMock.clear();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  afterEach(() => {
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

  it('re-triggers celebration for a new completed line', async () => {
    const { result } = renderHook(() => useBingoGame());

    act(() => {
      result.current.startGame('none');
    });

    await markSquares(result.current.handleSquareClick, [0, 1, 2, 3, 4]);
    expect(result.current.showBingoModal).toBe(true);

    act(() => {
      result.current.dismissModal();
    });
    expect(result.current.showBingoModal).toBe(false);

    await markSquares(result.current.handleSquareClick, [20, 21, 22, 23, 24]);
    expect(result.current.showBingoModal).toBe(true);
    expect(result.current.winningLine?.type).toBe('row');
    expect(result.current.winningLine?.index).toBe(4);
  });
});
