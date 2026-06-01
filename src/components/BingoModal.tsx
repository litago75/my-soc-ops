interface BingoModalProps {
  isDoubleBingo?: boolean;
  onDismiss: () => void;
}

export function BingoModal({ isDoubleBingo = false, onDismiss }: BingoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-xs w-full text-center shadow-xl animate-[bounce_0.5s_ease-out]">
        <div className="text-5xl mb-4">{isDoubleBingo ? '🌟' : '🎉'}</div>
        <h2 className={`text-3xl font-bold mb-2 ${isDoubleBingo ? 'text-purple-600' : 'text-amber-500'}`}>
          {isDoubleBingo ? 'DOUBLE BINGO!' : 'BINGO!'}
        </h2>
        <p className="text-gray-600 mb-6">
          {isDoubleBingo ? 'Amazing — you completed two lines!' : 'You completed a line!'}
        </p>
        
        <button
          onClick={onDismiss}
          className="w-full bg-accent text-white font-semibold py-3 px-6 rounded-lg active:bg-accent-light transition-colors"
        >
          Keep Playing
        </button>
      </div>
    </div>
  );
}
