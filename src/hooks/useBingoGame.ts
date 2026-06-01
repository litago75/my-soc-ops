import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  BingoSquareData,
  BingoLine,
  GameState,
  RoundModifierId,
  RoundModifierSelection,
} from '../types';
import {
  generateBoard,
  toggleSquare,
  checkBingo,
  getWinningSquareIds,
} from '../utils/bingoLogic';
import {
  ROUND_MODIFIER_LABELS,
  computeRoundScore,
  resolveRoundModifier,
} from '../utils/roundModifiers';

export interface BingoGameState {
  gameState: GameState;
  board: BingoSquareData[];
  winningLine: BingoLine | null;
  winningSquareIds: Set<number>;
  showBingoModal: boolean;
  activeModifier: RoundModifierId;
  score: number;
  wildcardUsed: boolean;
  wildcardArmed: boolean;
  canUseWildcard: boolean;
  activeModifierLabel: string;
}

export interface BingoGameActions {
  startGame: (selection: RoundModifierSelection) => void;
  handleSquareClick: (squareId: number) => void;
  activateWildcard: () => void;
  resetGame: () => void;
  dismissModal: () => void;
}

const STORAGE_KEY = 'bingo-game-state';
const STORAGE_VERSION = 2;

interface StoredGameData {
  version: number;
  gameState: GameState;
  board: BingoSquareData[];
  winningLine: BingoLine | null;
  activeModifier: RoundModifierId;
  score: number;
  wildcardUsed: boolean;
  roundStartedAt: number;
  wildcardClaimedSquareId: number | null;
}

function validateStoredData(data: unknown): data is StoredGameData {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  
  if (obj.version !== STORAGE_VERSION) {
    return false;
  }
  
  if (typeof obj.gameState !== 'string' || !['start', 'playing', 'bingo'].includes(obj.gameState)) {
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

  if (
    typeof obj.activeModifier !== 'string' ||
    ![
      'none',
      'double-score-diagonal',
      'wildcard-square',
      'speed-round-bonus-window',
    ].includes(obj.activeModifier)
  ) {
    return false;
  }

  if (typeof obj.score !== 'number') {
    return false;
  }

  if (typeof obj.wildcardUsed !== 'boolean') {
    return false;
  }

  if (typeof obj.roundStartedAt !== 'number') {
    return false;
  }

  if (
    obj.wildcardClaimedSquareId !== null &&
    typeof obj.wildcardClaimedSquareId !== 'number'
  ) {
    return false;
  }
  
  return true;
}

function loadGameState():
  | Pick<
      BingoGameState,
      'gameState' | 'board' | 'winningLine' | 'activeModifier' | 'score' | 'wildcardUsed'
    > & {
      roundStartedAt: number;
      wildcardClaimedSquareId: number | null;
    }
  | null {
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
        activeModifier: parsed.activeModifier,
        score: parsed.score,
        wildcardUsed: parsed.wildcardUsed,
        roundStartedAt: parsed.roundStartedAt,
        wildcardClaimedSquareId: parsed.wildcardClaimedSquareId,
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

function saveGameState(
  gameState: GameState,
  board: BingoSquareData[],
  winningLine: BingoLine | null,
  activeModifier: RoundModifierId,
  score: number,
  wildcardUsed: boolean,
  roundStartedAt: number,
  wildcardClaimedSquareId: number | null
): void {
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
      activeModifier,
      score,
      wildcardUsed,
      roundStartedAt,
      wildcardClaimedSquareId,
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
  const [activeModifier, setActiveModifier] = useState<RoundModifierId>(
    () => loadedState?.activeModifier || 'none'
  );
  const [score, setScore] = useState<number>(() => loadedState?.score ?? 0);
  const [wildcardUsed, setWildcardUsed] = useState<boolean>(
    () => loadedState?.wildcardUsed ?? false
  );
  const [wildcardArmed, setWildcardArmed] = useState(false);
  const [roundStartedAt, setRoundStartedAt] = useState<number>(
    () => loadedState?.roundStartedAt ?? Date.now()
  );
  const [wildcardClaimedSquareId, setWildcardClaimedSquareId] = useState<number | null>(
    () => loadedState?.wildcardClaimedSquareId ?? null
  );
  const canUseWildcard = activeModifier === 'wildcard-square' && !wildcardUsed;
  const activeModifierLabel = ROUND_MODIFIER_LABELS[activeModifier];

  const winningSquareIds = useMemo(
    () => getWinningSquareIds(winningLine),
    [winningLine]
  );

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    saveGameState(
      gameState,
      board,
      winningLine,
      activeModifier,
      score,
      wildcardUsed,
      roundStartedAt,
      wildcardClaimedSquareId
    );
  }, [
    gameState,
    board,
    winningLine,
    activeModifier,
    score,
    wildcardUsed,
    roundStartedAt,
    wildcardClaimedSquareId,
  ]);

  const startGame = useCallback((selection: RoundModifierSelection) => {
    const resolvedModifier = resolveRoundModifier(selection);
    setBoard(generateBoard());
    setWinningLine(null);
    setActiveModifier(resolvedModifier);
    setScore(0);
    setWildcardUsed(false);
    setWildcardArmed(false);
    setRoundStartedAt(Date.now());
    setWildcardClaimedSquareId(null);
    setGameState('playing');
  }, []);

  const handleSquareClick = useCallback((squareId: number) => {
    setBoard((currentBoard) => {
      if (currentBoard.length === 0) {
        return currentBoard;
      }

      if (squareId === wildcardClaimedSquareId && currentBoard[squareId]?.isMarked) {
        return currentBoard;
      }

      const isWildcardMove =
        activeModifier === 'wildcard-square' &&
        wildcardArmed &&
        !wildcardUsed &&
        !currentBoard[squareId]?.isFreeSpace &&
        !currentBoard[squareId]?.isMarked;

      const newBoard = isWildcardMove
        ? currentBoard.map((square) =>
            square.id === squareId ? { ...square, isMarked: true } : square
          )
        : toggleSquare(currentBoard, squareId);
      
      // Check for bingo after toggling
      const bingo = checkBingo(newBoard);
      if (isWildcardMove) {
        queueMicrotask(() => {
          setWildcardUsed(true);
          setWildcardArmed(false);
          setWildcardClaimedSquareId(squareId);
        });
      }

      if (bingo && !winningLine) {
        const nextScore = computeRoundScore(
          bingo,
          activeModifier,
          roundStartedAt,
          wildcardUsed || isWildcardMove
        );

        // Schedule state updates to avoid synchronous setState in effect
        queueMicrotask(() => {
          setWinningLine(bingo);
          setGameState('bingo');
          setShowBingoModal(true);
          setScore(nextScore);
        });
      }
      
      return newBoard;
    });
  }, [
    activeModifier,
    roundStartedAt,
    wildcardArmed,
    wildcardClaimedSquareId,
    wildcardUsed,
    winningLine,
  ]);

  const activateWildcard = useCallback(() => {
    if (activeModifier !== 'wildcard-square' || wildcardUsed || gameState !== 'playing') {
      return;
    }
    setWildcardArmed(true);
  }, [activeModifier, gameState, wildcardUsed]);

  const resetGame = useCallback(() => {
    setGameState('start');
    setBoard([]);
    setWinningLine(null);
    setShowBingoModal(false);
    setActiveModifier('none');
    setScore(0);
    setWildcardUsed(false);
    setWildcardArmed(false);
    setRoundStartedAt(Date.now());
    setWildcardClaimedSquareId(null);
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
    activeModifier,
    score,
    wildcardUsed,
    wildcardArmed,
    canUseWildcard,
    activeModifierLabel,
    startGame,
    handleSquareClick,
    activateWildcard,
    resetGame,
    dismissModal,
  };
}
