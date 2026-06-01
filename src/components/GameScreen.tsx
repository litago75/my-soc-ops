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
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(47,48,66,0.4)_1px,transparent_0)] [background-size:14px_14px]" />
      <div className="pointer-events-none absolute -top-20 -right-16 h-54 w-54 rotate-6 rounded-[2.2rem] border-4 border-white/80 bg-sticker-blue/60 shadow-sticker-soft" />
      <div className="pointer-events-none absolute -bottom-20 -left-14 h-52 w-52 -rotate-12 rounded-[2.2rem] border-4 border-white/80 bg-sticker-yellow/70 shadow-sticker-lift" />
      {/* Header */}
      <header className="relative z-10 mx-3 mt-3 flex items-center justify-between rounded-[1.4rem] border-3 border-white/90 bg-sticker-paper/95 px-3 py-2 shadow-[var(--shadow-sticker-press),var(--shadow-sticker-soft)]">
        <button
          onClick={onReset}
          className="rounded-xl border-2 border-sticker-blue/70 bg-white px-3 py-1.5 text-sm font-bold text-sticker-ink transition-colors hover:bg-sticker-blue/20 active:bg-sticker-blue/30"
        >
          ← Back
        </button>
        <h1 className="font-display text-2xl font-normal text-sticker-red">Bingo Mixer</h1>
        <div className="w-16"></div>
      </header>

      {/* Instructions */}
      <p className="px-4 py-3 text-center text-sm font-bold text-sticker-ink/85">
        Tap a square when you find someone who matches it.
      </p>

      {/* Bingo indicator */}
      {hasBingo && (
        <div className="mx-3 animate-[bounce_0.6s_ease-in-out] rounded-2xl border-2 border-sticker-teal/80 bg-sticker-teal/35 py-2 text-center text-sm font-extrabold text-sticker-ink shadow-[var(--shadow-sticker-press),var(--shadow-sticker-soft)]">
          BINGO! Sticker line complete.
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
