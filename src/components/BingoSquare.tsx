import type { BingoSquareData } from '../types';

interface BingoSquareProps {
  square: BingoSquareData;
  isWinning: boolean;
  onClick: () => void;
}

export function BingoSquare({ square, isWinning, onClick }: BingoSquareProps) {
  const baseClasses =
    'sticker-square relative flex items-center justify-center p-1.5 text-center transition-all duration-150 select-none min-h-[60px] text-xs leading-tight text-sticker-heading';

  const stateClasses = square.isMarked
    ? isWinning
      ? 'sticker-square-winning text-sticker-win'
      : 'sticker-square-marked text-sticker-mark'
    : 'active:bg-sticker-active';

  const freeSpaceClasses = square.isFreeSpace ? 'font-bold text-sm' : '';

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
        <span className="absolute top-1 right-1 text-sticker-check text-xs">✓</span>
      )}
    </button>
  );
}
