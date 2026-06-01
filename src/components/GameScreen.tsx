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
    <div className="relative flex min-h-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-candy-sky/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-14 h-52 w-52 rounded-full bg-candy-yellow/30 blur-2xl" />
      {/* Header */}
      <header className="relative z-10 mx-3 mt-3 flex items-center justify-between rounded-2xl border-2 border-white/75 bg-candy-cream/85 px-3 py-2 shadow-candy-header backdrop-blur-sm">
        <button
          onClick={onReset}
          className="rounded-xl bg-white px-3 py-1.5 text-sm font-bold text-candy-violet transition-colors hover:bg-candy-violet/10 active:bg-candy-violet/20"
        >
          ← Back
        </button>
        <h1 className="font-display text-2xl font-extrabold text-candy-pink">Bingo Mixer</h1>
        <div className="w-16"></div>
      </header>

      {/* Instructions */}
      <p className="px-4 py-3 text-center text-sm font-bold text-candy-ink/80">
        Tap a square when you find someone who matches it.
      </p>

      {/* Bingo indicator */}
      {hasBingo && (
        <div className="mx-3 animate-[bounce_0.6s_ease-in-out] rounded-2xl border-2 border-candy-mint/80 bg-candy-mint/25 py-2 text-center text-sm font-extrabold text-candy-ink shadow-candy-indicator">
          🍭 BINGO! You got a sweet line!
        </div>
      )}

      {/* Board */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-3">
        <BingoBoard
          board={board}
          winningSquareIds={winningSquareIds}
          onSquareClick={onSquareClick}
        />
      </div>
    </div>
  );
}
