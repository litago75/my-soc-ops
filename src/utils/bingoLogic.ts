import { questions, FREE_SPACE } from '../data/questions';
import type { BingoSquareData, BingoLine, GameMode } from '../types';

// Re-export types for convenience
export type { BingoSquareData, BingoLine } from '../types';

export const MODE_CONFIG: Record<GameMode, { boardSize: number }> = {
  quick: { boardSize: 3 },
  classic: { boardSize: 5 },
  chaos: { boardSize: 5 },
};
const MIN_BOARD_SIZE = Math.min(...Object.values(MODE_CONFIG).map((mode) => mode.boardSize));

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a new bingo board for a mode
 */
export function generateBoard(mode: GameMode = 'classic'): BingoSquareData[] {
  const boardSize = MODE_CONFIG[mode].boardSize;
  const totalSquares = boardSize * boardSize;
  const centerIndex = Math.floor(totalSquares / 2);
  const hasFreeSpace = boardSize % 2 === 1;
  const questionCount = hasFreeSpace ? totalSquares - 1 : totalSquares;
  const shuffledQuestions = shuffleArray(questions).slice(0, questionCount);
  const board: BingoSquareData[] = [];

  let questionIndex = 0;
  for (let i = 0; i < totalSquares; i++) {
    if (hasFreeSpace && i === centerIndex) {
      board.push({
        id: i,
        text: FREE_SPACE,
        isMarked: true,
        isFreeSpace: true,
      });
    } else {
      board.push({
        id: i,
        text: shuffledQuestions[questionIndex],
        isMarked: false,
        isFreeSpace: false,
      });
      questionIndex++;
    }
  }

  return board;
}

/**
 * Toggle a square's marked state
 */
export function toggleSquare(board: BingoSquareData[], squareId: number): BingoSquareData[] {
  return board.map((square) =>
    square.id === squareId && !square.isFreeSpace
      ? { ...square, isMarked: !square.isMarked }
      : square
  );
}

/**
 * Get all possible winning lines
 */
function getWinningLines(boardSize: number): BingoLine[] {
  const lines: BingoLine[] = [];

  // Rows
  for (let row = 0; row < boardSize; row++) {
    const squares = [];
    for (let col = 0; col < boardSize; col++) {
      squares.push(row * boardSize + col);
    }
    lines.push({ type: 'row', index: row, squares });
  }

  // Columns
  for (let col = 0; col < boardSize; col++) {
    const squares = [];
    for (let row = 0; row < boardSize; row++) {
      squares.push(row * boardSize + col);
    }
    lines.push({ type: 'column', index: col, squares });
  }

  // Diagonal (top-left to bottom-right)
  const leftToRight: number[] = [];
  for (let i = 0; i < boardSize; i++) {
    leftToRight.push(i * boardSize + i);
  }
  lines.push({
    type: 'diagonal',
    index: 0,
    squares: leftToRight,
  });

  // Diagonal (top-right to bottom-left)
  const rightToLeft: number[] = [];
  for (let i = 0; i < boardSize; i++) {
    rightToLeft.push(i * boardSize + (boardSize - 1 - i));
  }
  lines.push({
    type: 'diagonal',
    index: 1,
    squares: rightToLeft,
  });

  return lines;
}

/**
 * Check if there's a bingo and return the winning line(s)
 */
export function checkBingo(board: BingoSquareData[]): BingoLine | null {
  const boardSize = Math.sqrt(board.length);
  if (!Number.isInteger(boardSize) || boardSize < MIN_BOARD_SIZE) {
    return null;
  }

  const lines = getWinningLines(boardSize);

  for (const line of lines) {
    const isComplete = line.squares.every((idx) => board[idx].isMarked);
    if (isComplete) {
      return line;
    }
  }

  return null;
}

/**
 * Get the square IDs that are part of a winning line
 */
export function getWinningSquareIds(line: BingoLine | null): Set<number> {
  if (!line) return new Set();
  return new Set(line.squares);
}

/**
 * Apply one random chaos modifier (toggle a random non-free square)
 */
export function applyChaosModifier(board: BingoSquareData[]): BingoSquareData[] {
  const candidates = board.filter((square) => !square.isFreeSpace);
  if (candidates.length === 0) {
    return board;
  }

  const randomSquare = candidates[Math.floor(Math.random() * candidates.length)];
  return toggleSquare(board, randomSquare.id);
}
