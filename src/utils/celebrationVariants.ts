import type { CelebrationVariant } from '../types';

export const CELEBRATION_VARIANTS: CelebrationVariant[] = [
  {
    id: 'classic',
    emoji: '🎉',
    heading: 'BINGO!',
    message: 'You completed a line!',
    animationClass: 'animate-bounce',
    headingColorClass: 'text-amber-500',
  },
  {
    id: 'stellar',
    emoji: '🌟',
    heading: 'BINGO!',
    message: 'Stellar work!',
    animationClass: 'animate-spin',
    headingColorClass: 'text-purple-500',
  },
  {
    id: 'fire',
    emoji: '🔥',
    heading: 'BINGO!',
    message: "You're on fire!",
    animationClass: 'animate-pulse',
    headingColorClass: 'text-orange-500',
  },
  {
    id: 'rocket',
    emoji: '🚀',
    heading: 'BINGO!',
    message: 'Blasting off!',
    animationClass: 'animate-ping',
    headingColorClass: 'text-blue-500',
  },
  {
    id: 'sweet',
    emoji: '🍭',
    heading: 'BINGO!',
    message: 'Sweet victory!',
    animationClass: 'animate-bounce',
    headingColorClass: 'text-pink-500',
  },
];

export function pickCelebrationVariant(): CelebrationVariant {
  const index = Math.floor(Math.random() * CELEBRATION_VARIANTS.length);
  return CELEBRATION_VARIANTS[index];
}
