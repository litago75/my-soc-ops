interface BingoModalProps {
  onDismiss: () => void;
}

export function BingoModal({ onDismiss }: BingoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-candy-violet/25 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-xs animate-[bounce_0.55s_ease-out] rounded-3xl border-4 border-white/90 bg-candy-cream p-6 text-center shadow-candy-modal">
        <div className="mb-4 text-5xl">🍬</div>
        <h2 className="mb-2 font-display text-4xl font-extrabold text-candy-pink">BINGO!</h2>
        <p className="mb-6 font-bold text-candy-ink">You completed a sweet line!</p>

        <button
          onClick={onDismiss}
          className="w-full rounded-2xl border-b-4 border-candy-pink-dark bg-accent px-6 py-3 font-display text-xl font-extrabold text-white transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 active:bg-accent-light"
        >
          Keep Playing
        </button>
      </div>
    </div>
  );
}
