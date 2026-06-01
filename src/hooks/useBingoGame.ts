import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { BingoSquareData, BingoLine, GameState } from '../types';
import {
  generateBoard,
  toggleSquare,
  checkAllBingos,
  getWinningSquareIds,
} from '../utils/bingoLogic';

/** How quickly two consecutive marks must occur (ms) to activate a combo */
const COMBO_WINDOW_MS = 3000;

export interface BingoGameState {
  gameState: GameState;
  board: BingoSquareData[];
  winningLine: BingoLine | null;
  winningSquareIds: Set<number>;
  showBingoModal: boolean;
  /** Number of consecutive squares marked without an unmark */
  streak: number;
  /** True while consecutive marks are happening within COMBO_WINDOW_MS */
  isCombo: boolean;
  /** Total winning lines completed this game */
  completedLineCount: number;
}

export interface BingoGameActions {
  startGame: () => void;
  handleSquareClick: (squareId: number) => void;
  resetGame: () => void;
  dismissModal: () => void;
}

const STORAGE_KEY = 'bingo-game-state';
const STORAGE_VERSION = 1;

interface StoredGameData {
  version: number;
  gameState: GameState;
  board: BingoSquareData[];
  winningLine: BingoLine | null;
}

function lineKey(line: BingoLine): string {
  return `${line.type}-${line.index}`;
}

function validateStoredData(data: unknown): data is StoredGameData {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  
  if (obj.version !== STORAGE_VERSION) {
    return false;
  }
  
  if (typeof obj.gameState !== 'string' || !['start', 'playing', 'bingo', 'double-bingo'].includes(obj.gameState)) {
    return false;
  }
  
  if (!Array.isArray(obj.board) || (obj.board.length !== 0 && obj.board.length !== 25)) {
    return false;
  }
  
  const validSquares = obj.board.every((sq: unknown) => {
    if (!sq || typeof sq !== 'object') return false;
    const square = sq as Record<string, unknown>;
    return (
      typeof square.id === 'number' &&
      typeof square.text === 'string' &&
      typeof square.isMarked === 'boolean' &&
      typeof square.isFreeSpace === 'boolean'
    );
  });
  
  if (!validSquares) {
    return false;
  }
  
  if (obj.winningLine !== null) {
    if (typeof obj.winningLine !== 'object') {
      return false;
    }
    const line = obj.winningLine as Record<string, unknown>;
    if (
      typeof line.type !== 'string' ||
      !['row', 'column', 'diagonal'].includes(line.type) ||
      typeof line.index !== 'number' ||
      !Array.isArray(line.squares)
    ) {
      return false;
    }
  }
  
  return true;
}

function loadGameState(): Pick<BingoGameState, 'gameState' | 'board' | 'winningLine'> | null {
  // SSR guard
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return null;
    }

    const parsed = JSON.parse(saved);
    
    if (validateStoredData(parsed)) {
      return {
        gameState: parsed.gameState,
        board: parsed.board,
        winningLine: parsed.winningLine,
      };
    } else {
      console.warn('Invalid game state data in localStorage, clearing...');
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Failed to load game state:', error);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return null;
}

function saveGameState(gameState: GameState, board: BingoSquareData[], winningLine: BingoLine | null): void {
  // SSR guard
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const data: StoredGameData = {
      version: STORAGE_VERSION,
      gameState,
      board,
      winningLine,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save game state:', error);
  }
}

export function useBingoGame(): BingoGameState & BingoGameActions {
  const loadedState = useMemo(() => loadGameState(), []);

  const [gameState, setGameState] = useState<GameState>(
    () => loadedState?.gameState || 'start'
  );
  const [board, setBoard] = useState<BingoSquareData[]>(
    () => loadedState?.board || []
  );
  const [winningLine, setWinningLine] = useState<BingoLine | null>(
    () => loadedState?.winningLine || null
  );
  const [showBingoModal, setShowBingoModal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isCombo, setIsCombo] = useState(false);
  const [completedLineCount, setCompletedLineCount] = useState(
    () => checkAllBingos(loadedState?.board ?? []).length
  );

  // Track which winning lines have already triggered a win event.
  // Pre-populate from any lines already completed on the loaded board so that
  // resuming a saved game does not re-trigger wins the user has already seen.
  const seenLineKeys = useRef<Set<string>>(
    new Set(checkAllBingos(loadedState?.board ?? []).map(lineKey))
  );

  const lastMarkTimeRef = useRef<number>(0);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const winningSquareIds = useMemo(
    () => getWinningSquareIds(winningLine),
    [winningLine]
  );

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    saveGameState(gameState, board, winningLine);
  }, [gameState, board, winningLine]);

  const startGame = useCallback(() => {
    seenLineKeys.current = new Set();
    lastMarkTimeRef.current = 0;
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    setBoard(generateBoard());
    setWinningLine(null);
    setGameState('playing');
    setStreak(0);
    setIsCombo(false);
    setCompletedLineCount(0);
  }, []);

  const handleSquareClick = useCallback((squareId: number) => {
    setBoard((currentBoard) => {
      const square = currentBoard.find((s) => s.id === squareId);
      if (!square || square.isFreeSpace) return currentBoard;

      const newBoard = toggleSquare(currentBoard, squareId);
      const nowMarked = !square.isMarked;

      // Find any newly completed lines not previously reported as wins
      const newLines = nowMarked
        ? checkAllBingos(newBoard).filter(
            (line) => !seenLineKeys.current.has(lineKey(line))
          )
        : [];

      // Mark all new lines as seen before scheduling state updates
      newLines.forEach((line) => seenLineKeys.current.add(lineKey(line)));
      const totalCompleted = seenLineKeys.current.size;

      // Schedule state updates to avoid synchronous setState in updater
      queueMicrotask(() => {
        if (nowMarked) {
          setStreak((s) => s + 1);

          // Activate combo when two marks happen within COMBO_WINDOW_MS
          const now = Date.now();
          if (lastMarkTimeRef.current > 0 && now - lastMarkTimeRef.current < COMBO_WINDOW_MS) {
            setIsCombo(true);
          }
          lastMarkTimeRef.current = now;

          // Reset the combo expiry timer on every mark
          if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
          comboTimerRef.current = setTimeout(() => {
            setIsCombo(false);
          }, COMBO_WINDOW_MS);

          if (newLines.length > 0) {
            setWinningLine(newLines[0]);
            setCompletedLineCount(totalCompleted);
            setGameState(totalCompleted >= 2 ? 'double-bingo' : 'bingo');
            setShowBingoModal(true);
          }
        } else {
          // Unmark: reset streak and combo
          setStreak(0);
          setIsCombo(false);
          lastMarkTimeRef.current = 0;
          if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
        }
      });

      return newBoard;
    });
  }, []);

  const resetGame = useCallback(() => {
    seenLineKeys.current = new Set();
    lastMarkTimeRef.current = 0;
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    setGameState('start');
    setBoard([]);
    setWinningLine(null);
    setShowBingoModal(false);
    setStreak(0);
    setIsCombo(false);
    setCompletedLineCount(0);
  }, []);

  const dismissModal = useCallback(() => {
    setShowBingoModal(false);
  }, []);

  return {
    gameState,
    board,
    winningLine,
    winningSquareIds,
    showBingoModal,
    streak,
    isCombo,
    completedLineCount,
    startGame,
    handleSquareClick,
    resetGame,
    dismissModal,
  };
}
