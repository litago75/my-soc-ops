interface BingoModalProps {
  onDismiss: () => void;
}

export function BingoModal({ onDismiss }: BingoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sticker-blue/25 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-xs animate-[bounce_0.55s_ease-out] rounded-[2rem] border-4 border-white/95 bg-sticker-paper p-6 text-center shadow-[var(--shadow-sticker-lift),inset_0_2px_0_rgba(255,255,255,0.8),inset_0_-5px_0_rgba(0,0,0,0.08)]">
        <div className="mb-4 text-5xl">🏷️</div>
        <h2 className="mb-2 font-display text-4xl font-normal text-sticker-red">BINGO!</h2>
        <p className="mb-6 font-bold text-sticker-ink">You completed a sticker line!</p>

        <button
          onClick={onDismiss}
          className="w-full rounded-2xl border-2 border-sticker-red-dark bg-accent px-6 py-3 font-display text-xl font-normal text-white [box-shadow:var(--shadow-sticker-press),0_9px_0_rgb(222_58_82_/_35%)] transition-all hover:-translate-y-0.5 active:translate-y-1 active:bg-accent-light"
        >
          Keep Playing
        </button>
      </div>
    </div>
  );
}
