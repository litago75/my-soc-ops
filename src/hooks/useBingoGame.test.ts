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
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
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

  it('should initialise progression state to zero on startGame', () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });
    expect(result.current.streak).toBe(0);
    expect(result.current.isCombo).toBe(false);
    expect(result.current.completedLineCount).toBe(0);
  });

  it('should increment streak on each mark', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    const square = result.current.board.find((s) => !s.isFreeSpace && !s.isMarked);
    await act(async () => {
      result.current.handleSquareClick(square!.id);
      await Promise.resolve();
    });

    expect(result.current.streak).toBe(1);
  });

  it('should accumulate streak across multiple marks', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    const squares = result.current.board.filter((s) => !s.isFreeSpace && !s.isMarked);

    for (const sq of squares.slice(0, 3)) {
      await act(async () => {
        result.current.handleSquareClick(sq.id);
        await Promise.resolve();
      });
    }

    expect(result.current.streak).toBe(3);
  });

  it('should reset streak to zero on unmark', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    const square = result.current.board.find((s) => !s.isFreeSpace && !s.isMarked);

    // Mark
    await act(async () => {
      result.current.handleSquareClick(square!.id);
      await Promise.resolve();
    });
    expect(result.current.streak).toBe(1);

    // Unmark
    await act(async () => {
      result.current.handleSquareClick(square!.id);
      await Promise.resolve();
    });
    expect(result.current.streak).toBe(0);
  });

  it('should not set combo on the first mark', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    const square = result.current.board.find((s) => !s.isFreeSpace && !s.isMarked);
    await act(async () => {
      result.current.handleSquareClick(square!.id);
      await Promise.resolve();
    });

    expect(result.current.isCombo).toBe(false);
  });

  it('should activate combo when two marks happen within the combo window', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    const squares = result.current.board.filter((s) => !s.isFreeSpace && !s.isMarked);

    // First mark
    await act(async () => {
      result.current.handleSquareClick(squares[0].id);
      await Promise.resolve();
    });
    expect(result.current.isCombo).toBe(false);

    // Second mark within 3 s
    act(() => { vi.advanceTimersByTime(1000); });
    await act(async () => {
      result.current.handleSquareClick(squares[1].id);
      await Promise.resolve();
    });

    expect(result.current.isCombo).toBe(true);
  });

  it('should not activate combo when marks are separated by more than the combo window', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    const squares = result.current.board.filter((s) => !s.isFreeSpace && !s.isMarked);

    // First mark
    await act(async () => {
      result.current.handleSquareClick(squares[0].id);
      await Promise.resolve();
    });

    // Advance past the combo window
    await act(async () => {
      vi.advanceTimersByTime(4000);
      await Promise.resolve();
    });

    // Second mark
    await act(async () => {
      result.current.handleSquareClick(squares[1].id);
      await Promise.resolve();
    });

    expect(result.current.isCombo).toBe(false);
  });

  it('should clear combo after the combo window expires with no further marks', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    const squares = result.current.board.filter((s) => !s.isFreeSpace && !s.isMarked);

    // Trigger combo
    await act(async () => {
      result.current.handleSquareClick(squares[0].id);
      await Promise.resolve();
    });
    act(() => { vi.advanceTimersByTime(500); });
    await act(async () => {
      result.current.handleSquareClick(squares[1].id);
      await Promise.resolve();
    });
    expect(result.current.isCombo).toBe(true);

    // Let the combo window expire
    await act(async () => {
      vi.advanceTimersByTime(3500);
      await Promise.resolve();
    });
    expect(result.current.isCombo).toBe(false);
  });

  it('should reset combo on unmark', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    const squares = result.current.board.filter((s) => !s.isFreeSpace && !s.isMarked);

    // Trigger combo
    await act(async () => {
      result.current.handleSquareClick(squares[0].id);
      await Promise.resolve();
    });
    act(() => { vi.advanceTimersByTime(500); });
    await act(async () => {
      result.current.handleSquareClick(squares[1].id);
      await Promise.resolve();
    });
    expect(result.current.isCombo).toBe(true);

    // Unmark a square
    await act(async () => {
      result.current.handleSquareClick(squares[1].id);
      await Promise.resolve();
    });
    expect(result.current.isCombo).toBe(false);
  });

  it('should detect first bingo and show modal', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    // Mark all squares in row 0
    await act(async () => {
      for (let i = 0; i < 5; i++) {
        if (!result.current.board[i].isMarked) {
          result.current.handleSquareClick(i);
        }
      }
      await Promise.resolve();
    });

    expect(result.current.gameState).toBe('bingo');
    expect(result.current.winningLine).not.toBeNull();
    expect(result.current.showBingoModal).toBe(true);
    expect(result.current.completedLineCount).toBe(1);
  });

  it('should detect double-bingo (2 completed lines) and update state', async () => {
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
    expect(result.current.completedLineCount).toBe(1);

    act(() => { result.current.dismissModal(); });

    // Complete row 1
    await act(async () => {
      for (let i = 5; i < 10; i++) {
        if (!result.current.board[i].isMarked) {
          result.current.handleSquareClick(i);
        }
      }
      await Promise.resolve();
    });

    expect(result.current.gameState).toBe('double-bingo');
    expect(result.current.completedLineCount).toBeGreaterThanOrEqual(2);
    expect(result.current.showBingoModal).toBe(true);
  });

  it('should not re-trigger win for an already-seen line', async () => {
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
    expect(result.current.completedLineCount).toBe(1);
    act(() => { result.current.dismissModal(); });

    // Re-mark row 0 squares (unmark then remark) – should not add to count
    await act(async () => {
      result.current.handleSquareClick(0);
      await Promise.resolve();
    });
    await act(async () => {
      result.current.handleSquareClick(0);
      await Promise.resolve();
    });

    expect(result.current.completedLineCount).toBe(1);
  });

  it('should reset all progression state on resetGame', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    const square = result.current.board.find((s) => !s.isFreeSpace && !s.isMarked);
    await act(async () => {
      result.current.handleSquareClick(square!.id);
      await Promise.resolve();
    });
    expect(result.current.streak).toBeGreaterThan(0);

    act(() => { result.current.resetGame(); });

    expect(result.current.gameState).toBe('start');
    expect(result.current.streak).toBe(0);
    expect(result.current.isCombo).toBe(false);
    expect(result.current.completedLineCount).toBe(0);
  });

  it('should reset all progression state on startGame', async () => {
    const { result } = renderHook(() => useBingoGame());
    act(() => { result.current.startGame(); });

    // Mark some squares and trigger a bingo
    await act(async () => {
      for (let i = 0; i < 5; i++) {
        if (!result.current.board[i].isMarked) {
          result.current.handleSquareClick(i);
        }
      }
      await Promise.resolve();
    });
    expect(result.current.streak).toBeGreaterThan(0);

    // Start a new game
    act(() => { result.current.startGame(); });

    expect(result.current.gameState).toBe('playing');
    expect(result.current.streak).toBe(0);
    expect(result.current.isCombo).toBe(false);
    expect(result.current.completedLineCount).toBe(0);
  });
});
