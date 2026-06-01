import type { BingoSquareData } from '../types';

interface BingoSquareProps {
  square: BingoSquareData;
  isWinning: boolean;
  onClick: () => void;
}

export function BingoSquare({ square, isWinning, onClick }: BingoSquareProps) {
  const baseClasses =
    'sticker-square relative flex items-center justify-center p-1.5 text-center transition-all duration-150 select-none min-h-[60px] text-xs leading-tight text-[#6d3a2d]';

  const stateClasses = square.isMarked
    ? isWinning
      ? 'sticker-square-winning text-[#7d3022]'
      : 'sticker-square-marked text-[#6a4f14]'
    : 'active:bg-[#fff5df]';

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
        <span className="absolute top-1 right-1 text-[#8d5f00] text-xs">✓</span>
      )}
    </button>
  );
}
