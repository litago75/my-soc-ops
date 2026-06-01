import type { CelebrationVariant } from '../types';
import { CELEBRATION_VARIANTS } from '../utils/celebrationVariants';

interface BingoModalProps {
  onDismiss: () => void;
  variant?: CelebrationVariant;
}

const DEFAULT_VARIANT = CELEBRATION_VARIANTS[0];

export function BingoModal({ onDismiss, variant = DEFAULT_VARIANT }: BingoModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bingo-heading"
    >
      <div className={`bg-white rounded-xl p-6 max-w-xs w-full text-center shadow-xl ${variant.animationClass}`}>
        <div className="text-5xl mb-4" aria-hidden="true">{variant.emoji}</div>
        <h2 id="bingo-heading" className={`text-3xl font-bold mb-2 ${variant.headingColorClass}`}>
          {variant.heading}
        </h2>
        <p className="text-gray-600 mb-6">{variant.message}</p>

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

