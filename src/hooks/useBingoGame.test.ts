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

describe('useBingoGame', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should start in "start" state', () => {
    const { result } = renderHook(() => useBingoGame());
    expect(result.current.gameState).toBe('start');
  });

  it('should transition to "playing" after startGame', () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });
    expect(result.current.gameState).toBe('playing');
    expect(result.current.board).toHaveLength(25);
  });

  it('should detect first bingo and show modal', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    // Mark all of row 0
    await act(async () => {
      for (let i = 0; i < 5; i++) {
        if (!result.current.board[i].isMarked) {
          result.current.handleSquareClick(i);
        }
      }
      // Allow microtask queue to flush
      await Promise.resolve();
    });

    expect(result.current.gameState).toBe('bingo');
    expect(result.current.winningLine).not.toBeNull();
    expect(result.current.showBingoModal).toBe(true);
  });

  it('should detect second bingo after dismissing first modal', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    // Complete row 0 (first bingo)
    await act(async () => {
      for (let i = 0; i < 5; i++) {
        if (!result.current.board[i].isMarked) {
          result.current.handleSquareClick(i);
        }
      }
      await Promise.resolve();
    });

    expect(result.current.gameState).toBe('bingo');
    expect(result.current.showBingoModal).toBe(true);

    // Dismiss the first modal
    act(() => { result.current.dismissModal(); });
    expect(result.current.showBingoModal).toBe(false);
    expect(result.current.gameState).toBe('bingo');

    // Complete row 4 (second bingo) — indices 20-24
    await act(async () => {
      for (let i = 20; i <= 24; i++) {
        if (!result.current.board[i].isMarked) {
          result.current.handleSquareClick(i);
        }
      }
      await Promise.resolve();
    });

    expect(result.current.showBingoModal).toBe(true);
    expect(result.current.winningLine).not.toBeNull();
    // The winning line should be updated to the second line (row 4)
    expect(result.current.winningLine?.type).toBe('row');
    expect(result.current.winningLine?.index).toBe(4);
  });

  it('should not re-trigger win event for an already-seen line', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    // Complete row 0
    await act(async () => {
      for (let i = 0; i < 5; i++) {
        if (!result.current.board[i].isMarked) {
          result.current.handleSquareClick(i);
        }
      }
      await Promise.resolve();
    });

    expect(result.current.showBingoModal).toBe(true);
    act(() => { result.current.dismissModal(); });

    // Clicking an already-marked square in row 0 unmarks and re-marks it
    // Row 0 would be lost then regained — it should re-trigger because
    // untoggling removes the bingo and re-marking restores it as "new"
    // But clicking a square OUTSIDE row 0 that doesn't complete a new line
    // should NOT show the modal again
    await act(async () => {
      // Click a non-winning, non-marked square
      const unmarkedNonWinning = result.current.board.find(
        (sq) => !sq.isMarked && sq.id > 4 && sq.id < 20
      );
      if (unmarkedNonWinning) {
        result.current.handleSquareClick(unmarkedNonWinning.id);
      }
      await Promise.resolve();
    });

    expect(result.current.showBingoModal).toBe(false);
  });

  it('should reset seenLineKeys on resetGame so new game can win again', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    // Complete row 0
    await act(async () => {
      for (let i = 0; i < 5; i++) {
        if (!result.current.board[i].isMarked) {
          result.current.handleSquareClick(i);
        }
      }
      await Promise.resolve();
    });

    expect(result.current.gameState).toBe('bingo');

    act(() => { result.current.resetGame(); });
    expect(result.current.gameState).toBe('start');

    act(() => { result.current.startGame(); });

    // Complete row 0 on new board
    await act(async () => {
      for (let i = 0; i < 5; i++) {
        if (!result.current.board[i].isMarked) {
          result.current.handleSquareClick(i);
        }
      }
      await Promise.resolve();
    });

    expect(result.current.gameState).toBe('bingo');
    expect(result.current.showBingoModal).toBe(true);
  });
});
