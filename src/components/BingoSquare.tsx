import type { BingoSquareData } from '../types';

interface BingoSquareProps {
  square: BingoSquareData;
  isWinning: boolean;
  onClick: () => void;
}

export function BingoSquare({ square, isWinning, onClick }: BingoSquareProps) {
  const baseClasses =
    'relative flex min-h-[60px] select-none items-center justify-center rounded-xl border-2 p-1 text-center text-[11px] leading-tight font-bold transition-all duration-150';

  const stateClasses = square.isMarked
    ? isWinning
      ? 'border-candy-mint bg-candy-mint/55 text-candy-ink ring-2 ring-white/45'
      : 'border-marked-border bg-marked text-candy-ink'
    : 'border-white/90 bg-candy-cream/90 text-candy-ink hover:bg-candy-yellow/30 active:bg-candy-yellow/45';

  const freeSpaceClasses = square.isFreeSpace ? 'font-display text-sm text-candy-pink' : '';

  return (
    <button
      onClick={onClick}
      disabled={square.isFreeSpace}
      className={`${baseClasses} ${stateClasses} ${freeSpaceClasses}`}
      aria-pressed={square.isMarked}
      aria-label={square.isFreeSpace ? 'Free space' : square.text}
    >
      <span className="wrap-break-word hyphens-auto">{square.text}</span>
      {square.isMarked && !square.isFreeSpace && (
        <span className="absolute top-0.5 right-0.5 text-xs text-candy-violet">✓</span>
      )}
    </button>
  );
}
