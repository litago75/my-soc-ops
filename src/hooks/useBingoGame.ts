import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  BingoSquareData,
  BingoLine,
  GameState,
  SocialMode,
  TeamName,
  TeamScores,
} from '../types';
import {
  generateBoard,
  toggleSquare,
  checkBingo,
  getWinningSquareIds,
} from '../utils/bingoLogic';

export interface BingoGameState {
  gameState: GameState;
  board: BingoSquareData[];
  winningLine: BingoLine | null;
  winningSquareIds: Set<number>;
  showBingoModal: boolean;
  socialMode: SocialMode;
  timeRemaining: number | null;
  teamScores: TeamScores;
  activeTeam: TeamName;
  teamWinner: TeamName | null;
}

export interface BingoGameActions {
  startGame: (socialMode: SocialMode) => void;
  handleSquareClick: (squareId: number) => void;
  resetGame: () => void;
  dismissModal: () => void;
}

const STORAGE_KEY = 'bingo-game-state';
const STORAGE_VERSION = 2;
const COUNTDOWN_DURATION_SECONDS = 120;
const EMPTY_TEAM_SCORES: TeamScores = { spark: 0, pop: 0 };

interface StoredGameData {
  version: number;
  gameState: GameState;
  board: BingoSquareData[];
  winningLine: BingoLine | null;
  socialMode: SocialMode;
  timeRemaining: number | null;
  teamScores: TeamScores;
  activeTeam: TeamName;
  teamWinner: TeamName | null;
}

function validateStoredData(data: unknown): data is StoredGameData {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  
  if (obj.version !== STORAGE_VERSION) {
    return false;
  }
  
  if (typeof obj.gameState !== 'string' || !['start', 'playing', 'bingo', 'timeout'].includes(obj.gameState)) {
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

  if (typeof obj.socialMode !== 'string' || !['classic', 'countdown', 'team'].includes(obj.socialMode)) {
    return false;
  }

  if (obj.timeRemaining !== null && (typeof obj.timeRemaining !== 'number' || obj.timeRemaining < 0)) {
    return false;
  }

  if (!obj.teamScores || typeof obj.teamScores !== 'object') {
    return false;
  }
  const scores = obj.teamScores as Record<string, unknown>;
  if (
    typeof scores.spark !== 'number' ||
    typeof scores.pop !== 'number'
  ) {
    return false;
  }

  if (typeof obj.activeTeam !== 'string' || !['spark', 'pop'].includes(obj.activeTeam)) {
    return false;
  }

  if (obj.teamWinner !== null && (typeof obj.teamWinner !== 'string' || !['spark', 'pop'].includes(obj.teamWinner))) {
    return false;
  }
  
  return true;
}

function loadGameState(): Pick<
  BingoGameState,
  'gameState' | 'board' | 'winningLine' | 'socialMode' | 'timeRemaining' | 'teamScores' | 'activeTeam' | 'teamWinner'
> | null {
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
        socialMode: parsed.socialMode,
        timeRemaining: parsed.timeRemaining,
        teamScores: parsed.teamScores,
        activeTeam: parsed.activeTeam,
        teamWinner: parsed.teamWinner,
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
  socialMode: SocialMode,
  timeRemaining: number | null,
  teamScores: TeamScores,
  activeTeam: TeamName,
  teamWinner: TeamName | null
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
      socialMode,
      timeRemaining,
      teamScores,
      activeTeam,
      teamWinner,
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
  const [socialMode, setSocialMode] = useState<SocialMode>(
    () => loadedState?.socialMode || 'classic'
  );
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    () => loadedState?.timeRemaining ?? null
  );
  const [teamScores, setTeamScores] = useState<TeamScores>(
    () => loadedState?.teamScores || EMPTY_TEAM_SCORES
  );
  const [activeTeam, setActiveTeam] = useState<TeamName>(
    () => loadedState?.activeTeam || 'spark'
  );
  const [teamWinner, setTeamWinner] = useState<TeamName | null>(
    () => loadedState?.teamWinner || null
  );

  const winningSquareIds = useMemo(
    () => getWinningSquareIds(winningLine),
    [winningLine]
  );

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    saveGameState(gameState, board, winningLine, socialMode, timeRemaining, teamScores, activeTeam, teamWinner);
  }, [gameState, board, winningLine, socialMode, timeRemaining, teamScores, activeTeam, teamWinner]);

  useEffect(() => {
    if (socialMode !== 'countdown' || gameState !== 'playing' || timeRemaining === null) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeRemaining((current) => {
        if (current === null) {
          return null;
        }
        if (current <= 1) {
          window.clearInterval(interval);
          setGameState((state) => (state === 'playing' ? 'timeout' : state));
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [gameState, socialMode, timeRemaining]);

  const startGame = useCallback((selectedSocialMode: SocialMode) => {
    setBoard(generateBoard());
    setWinningLine(null);
    setSocialMode(selectedSocialMode);
    setTimeRemaining(selectedSocialMode === 'countdown' ? COUNTDOWN_DURATION_SECONDS : null);
    setTeamScores(EMPTY_TEAM_SCORES);
    setActiveTeam('spark');
    setTeamWinner(null);
    setShowBingoModal(false);
    setGameState('playing');
  }, []);

  const handleSquareClick = useCallback((squareId: number) => {
    if (gameState === 'timeout') {
      return;
    }

    const turnTeam = activeTeam;

    setBoard((currentBoard) => {
      const newBoard = toggleSquare(currentBoard, squareId);
      const previousSquare = currentBoard[squareId];
      const nextSquare = newBoard[squareId];

      if (
        socialMode === 'team' &&
        previousSquare &&
        nextSquare &&
        !previousSquare.isMarked &&
        nextSquare.isMarked
      ) {
        setTeamScores((currentScores) => ({
          ...currentScores,
          [turnTeam]: currentScores[turnTeam] + 1,
        }));
        setActiveTeam(turnTeam === 'spark' ? 'pop' : 'spark');
      }
      
      // Check for bingo after toggling
      const bingo = checkBingo(newBoard);
      if (bingo && !winningLine) {
        // Schedule state updates to avoid synchronous setState in effect
        queueMicrotask(() => {
          if (socialMode === 'team') {
            setTeamScores((currentScores) => ({
              ...currentScores,
              [turnTeam]: currentScores[turnTeam] + 3,
            }));
            setTeamWinner(turnTeam);
          }
          setWinningLine(bingo);
          setGameState('bingo');
          setShowBingoModal(true);
        });
      }
      
      return newBoard;
    });
  }, [activeTeam, gameState, socialMode, winningLine]);

  const resetGame = useCallback(() => {
    setGameState('start');
    setBoard([]);
    setWinningLine(null);
    setShowBingoModal(false);
    setSocialMode('classic');
    setTimeRemaining(null);
    setTeamScores(EMPTY_TEAM_SCORES);
    setActiveTeam('spark');
    setTeamWinner(null);
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
    socialMode,
    timeRemaining,
    teamScores,
    activeTeam,
    teamWinner,
    startGame,
    handleSquareClick,
    resetGame,
    dismissModal,
  };
}
