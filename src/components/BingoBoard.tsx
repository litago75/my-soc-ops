import type { BingoSquareData } from '../types';
import { BingoSquare } from './BingoSquare';

interface BingoBoardProps {
  board: BingoSquareData[];
  winningSquareIds: Set<number>;
  onSquareClick: (squareId: number) => void;
}

export function BingoBoard({ board, winningSquareIds, onSquareClick }: BingoBoardProps) {
  return (
    <div className="grid aspect-square w-full max-w-md grid-cols-5 gap-2 rounded-[2rem] border-4 border-white/90 bg-sticker-paper/95 p-2.5 shadow-[var(--shadow-sticker-lift),inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-5px_0_rgba(0,0,0,0.08)]">
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
