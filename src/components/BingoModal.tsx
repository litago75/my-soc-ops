interface BingoModalProps {
  onDismiss: () => void;
}

export function BingoModal({ onDismiss }: BingoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="font-sticker sticker-card p-6 max-w-xs w-full text-center animate-[bounce_0.5s_ease-out]">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-3xl font-black text-sticker-bingo mb-2">BINGO!</h2>
        <p className="text-sticker-muted mb-6">You completed a line!</p>
        
        <button
          onClick={onDismiss}
          className="sticker-button w-full bg-accent text-white font-bold py-3 px-6 rounded-xl transition-all"
        >
          Keep Playing
        </button>
      </div>
    </div>
  );
}
