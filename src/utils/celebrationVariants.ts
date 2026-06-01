import type { CelebrationVariant } from '../types';

export const CELEBRATION_VARIANTS: CelebrationVariant[] = [
  {
    id: 'classic',
    emoji: '🎉',
    heading: 'BINGO!',
    message: 'You completed a line!',
    animationClass: 'animate-[bounce_0.5s_ease-out]',
    headingColorClass: 'text-amber-500',
  },
  {
    id: 'stellar',
    emoji: '🌟',
    heading: 'BINGO!',
    message: 'Stellar work!',
    animationClass: 'animate-[spin_0.6s_ease-out]',
    headingColorClass: 'text-purple-500',
  },
  {
    id: 'fire',
    emoji: '🔥',
    heading: 'BINGO!',
    message: "You're on fire!",
    animationClass: 'animate-[pulse_0.5s_ease-out]',
    headingColorClass: 'text-orange-500',
  },
  {
    id: 'rocket',
    emoji: '🚀',
    heading: 'BINGO!',
    message: 'Blasting off!',
    animationClass: 'animate-[ping_0.5s_ease-out]',
    headingColorClass: 'text-blue-500',
  },
  {
    id: 'sweet',
    emoji: '🍭',
    heading: 'BINGO!',
    message: 'Sweet victory!',
    animationClass: 'animate-[bounce_0.4s_ease-out]',
    headingColorClass: 'text-pink-500',
  },
];

export function pickCelebrationVariant(): CelebrationVariant {
  const index = Math.floor(Math.random() * CELEBRATION_VARIANTS.length);
  return CELEBRATION_VARIANTS[index];
}
