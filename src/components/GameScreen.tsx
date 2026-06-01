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
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-3 bg-white border-b border-gray-200">
        <button
          onClick={onReset}
          className="text-gray-500 text-sm px-3 py-1.5 rounded active:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="font-bold text-gray-900">Bingo Mixer</h1>
        <div className="w-16"></div>
      </header>

      {/* Instructions */}
      <div className="text-center text-gray-500 text-sm py-2 px-4 space-y-1">
        <p>Tap a square when you find someone who matches it.</p>
        <p className="font-medium text-gray-700">Modifier: {activeModifierLabel}</p>
        <p className="font-medium text-gray-700">Score: {score}</p>
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
        <div className="bg-amber-100 text-amber-800 text-center py-2 font-semibold text-sm">
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
