import type { BingoSquareData } from '../types';
import { BingoBoard } from './BingoBoard';

interface GameScreenProps {
  board: BingoSquareData[];
  winningSquareIds: Set<number>;
  hasBingo: boolean;
  score: number;
  activeModifierLabel: string;
  wildcardArmed: boolean;
  canUseWildcard: boolean;
  onSquareClick: (squareId: number) => void;
  onUseWildcard: () => void;
  onReset: () => void;
}

export function GameScreen({
  board,
  winningSquareIds,
  hasBingo,
  score,
  activeModifierLabel,
  wildcardArmed,
  canUseWildcard,
  onSquareClick,
  onUseWildcard,
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
      <div className="px-4 py-3 text-center text-sm font-bold text-candy-ink/80">
        <p>Tap a square when you find someone who matches it.</p>
        <p className="mt-1 text-candy-violet">Modifier: {activeModifierLabel}</p>
        <p className="text-candy-violet">Score: {score}</p>
      </div>

      {canUseWildcard && (
        <div className="px-4 pb-2">
          <button
            onClick={onUseWildcard}
            className="w-full rounded-lg border border-amber-300 bg-amber-50 py-2 text-sm font-semibold text-amber-800 active:bg-amber-100"
          >
            {wildcardArmed ? 'Tap a square to claim your wildcard' : 'Use wildcard square'}
          </button>
        </div>
      )}

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
