import type { BingoSquareData } from '../types';

interface BingoSquareProps {
  square: BingoSquareData;
  isWinning: boolean;
  onClick: () => void;
}

export function BingoSquare({ square, isWinning, onClick }: BingoSquareProps) {
  const baseClasses =
    'relative flex min-h-[60px] select-none items-center justify-center overflow-hidden rounded-[0.9rem] border-2 p-1.5 text-center text-[11px] leading-tight font-bold transition-all duration-150';

  const stateClasses = square.isMarked
    ? isWinning
      ? 'border-sticker-teal bg-sticker-teal/55 text-sticker-ink ring-2 ring-white/45'
      : 'border-marked-border bg-marked text-sticker-ink'
    : 'border-sticker-blue/45 bg-white text-sticker-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-3px_0_rgba(0,0,0,0.08)] hover:bg-sticker-peach/70 active:translate-y-[1px]';

  const freeSpaceClasses = square.isFreeSpace ? 'font-display text-sm font-normal text-sticker-red' : '';

  return (
    <button
      onClick={onClick}
      disabled={square.isFreeSpace}
      className={`${baseClasses} ${stateClasses} ${freeSpaceClasses}`}
      aria-pressed={square.isMarked}
      aria-label={square.isFreeSpace ? 'Free space' : square.text}
    >
      {!square.isMarked && (
        <span className="pointer-events-none absolute -top-2 left-1/2 h-3.5 w-9 -translate-x-1/2 rounded-b-md bg-sticker-yellow/75 shadow-[0_2px_0_rgba(47,48,66,0.15)]" />
      )}
      <span className="wrap-break-word hyphens-auto">{square.text}</span>
      {square.isMarked && !square.isFreeSpace && (
        <span className="absolute top-0.5 right-0.5 text-xs text-sticker-red">✓</span>
      )}
    </button>
  );
}
