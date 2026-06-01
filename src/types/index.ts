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

export type GameState = 'start' | 'playing' | 'bingo' | 'timeout';

export type SocialMode = 'classic' | 'countdown' | 'team';

export type TeamName = 'spark' | 'pop';

export interface TeamScores {
  spark: number;
  pop: number;
}
