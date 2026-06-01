/** Domain types for the Bingo game */

export interface BingoSquareData {
  id: number;
  text: string;
  isMarked: boolean;
  isFreeSpace: boolean;
}

export interface BingoLine {
  type: 'row' | 'column' | 'diagonal' | 'corners';
  index: number;
  squares: number[];
}

export type GameState = 'start' | 'playing' | 'bingo';

export interface CelebrationVariant {
  id: string;
  emoji: string;
  heading: string;
  message: string;
  animationClass: string;
  headingColorClass: string;
}
