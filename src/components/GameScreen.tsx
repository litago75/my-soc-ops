import type { BingoSquareData, SocialMode, TeamName, TeamScores } from '../types';
import { BingoBoard } from './BingoBoard';

interface GameScreenProps {
  board: BingoSquareData[];
  winningSquareIds: Set<number>;
  hasBingo: boolean;
  isTimedOut: boolean;
  socialMode: SocialMode;
  timeRemaining: number | null;
  teamScores: TeamScores;
  activeTeam: TeamName;
  teamWinner: TeamName | null;
  onSquareClick: (squareId: number) => void;
  onReset: () => void;
}

export function GameScreen({
  board,
  winningSquareIds,
  hasBingo,
  isTimedOut,
  socialMode,
  timeRemaining,
  teamScores,
  activeTeam,
  teamWinner,
  onSquareClick,
  onReset,
}: GameScreenProps) {
  const minutes = timeRemaining === null ? null : Math.floor(timeRemaining / 60);
  const seconds = timeRemaining === null ? null : String(timeRemaining % 60).padStart(2, '0');

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
      <p className="text-center text-gray-500 text-sm py-2 px-4">
        Tap a square when you find someone who matches it.
      </p>

      <div className="px-4 py-2 text-sm text-gray-700 bg-white border-y border-gray-200">
        {socialMode === 'classic' && <p>Mode: Classic (no pressure).</p>}
        {socialMode === 'countdown' && (
          <p>
            Mode: Countdown — Time left: <span className="font-semibold">{minutes}:{seconds}</span>
          </p>
        )}
        {socialMode === 'team' && (
          <p>
            Mode: Team — Spark {teamScores.spark} · Pop {teamScores.pop} · Next turn: {activeTeam === 'spark' ? 'Spark' : 'Pop'}
          </p>
        )}
      </div>

      {/* Bingo indicator */}
      {hasBingo && (
        <div className="bg-amber-100 text-amber-800 text-center py-2 font-semibold text-sm">
          🎉 BINGO! {teamWinner ? `${teamWinner === 'spark' ? 'Spark' : 'Pop'} team got the line!` : 'You got a line!'}
        </div>
      )}
      {isTimedOut && (
        <div className="bg-rose-100 text-rose-800 text-center py-2 font-semibold text-sm">
          ⏰ Time is up! Reset to play again.
        </div>
      )}

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-3">
        <BingoBoard
          board={board}
          winningSquareIds={winningSquareIds}
          onSquareClick={isTimedOut ? () => undefined : onSquareClick}
        />
      </div>
    </div>
  );
}
