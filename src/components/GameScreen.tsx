import type { BingoSquareData } from '../types';
import { BingoBoard } from './BingoBoard';

interface GameScreenProps {
  board: BingoSquareData[];
  winningSquareIds: Set<number>;
  hasBingo: boolean;
  onSquareClick: (squareId: number) => void;
  onReset: () => void;
}

export function GameScreen({
  board,
  winningSquareIds,
  hasBingo,
  onSquareClick,
  onReset,
}: GameScreenProps) {
  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="mx-3 mt-3 sticker-card flex items-center justify-between p-3">
        <button
          onClick={onReset}
          className="text-[#7d5545] text-sm px-3 py-1.5 rounded-xl active:bg-[#ffe8cf]"
        >
          ← Back
        </button>
        <h1 className="font-black text-[#8a2e29] tracking-wide">Bingo Mixer</h1>
        <div className="w-16"></div>
      </header>

      {/* Instructions */}
      <p className="text-center text-[#7d5545] text-sm py-3 px-4 font-medium">
        Tap a square when you find someone who matches it.
      </p>

      {/* Bingo indicator */}
      {hasBingo && (
        <div className="mx-4 sticker-card bg-[#ffe89d] text-[#8e512a] text-center py-2 font-bold text-sm">
          🎉 BINGO! You got a line!
        </div>
      )}

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-3">
        <BingoBoard
          board={board}
          winningSquareIds={winningSquareIds}
          onSquareClick={onSquareClick}
        />
      </div>
    </div>
  );
}
