import type { BingoSquareData } from '../types';
import { BingoSquare } from './BingoSquare';

interface BingoBoardProps {
  boardSize: number;
  board: BingoSquareData[];
  winningSquareIds: Set<number>;
  onSquareClick: (squareId: number) => void;
}

export function BingoBoard({ boardSize, board, winningSquareIds, onSquareClick }: BingoBoardProps) {
  const gridColumnsClass = boardSize === 3 ? 'grid-cols-3' : 'grid-cols-5';

  return (
    <div className={`grid ${gridColumnsClass} gap-1 w-full max-w-md mx-auto aspect-square`}>
      {board.map((square) => (
        <BingoSquare
          key={square.id}
          square={square}
          isWinning={winningSquareIds.has(square.id)}
          onClick={() => onSquareClick(square.id)}
        />
      ))}
    </div>
  );
}
