import type { BingoLine, RoundModifierId, RoundModifierSelection } from '../types';

export const RANDOMIZABLE_ROUND_MODIFIERS: Exclude<RoundModifierId, 'none'>[] = [
  'double-score-diagonal',
  'wildcard-square',
  'speed-round-bonus-window',
];

export const ROUND_MODIFIER_LABELS: Record<RoundModifierId, string> = {
  none: 'No modifier',
  'double-score-diagonal': 'Double-score diagonal',
  'wildcard-square': 'Wildcard square',
  'speed-round-bonus-window': 'Speed round bonus window',
};

export function resolveRoundModifier(
  selection: RoundModifierSelection,
  randomFn: () => number = Math.random
): RoundModifierId {
  if (selection !== 'random') {
    return selection;
  }

  const idx = Math.floor(randomFn() * RANDOMIZABLE_ROUND_MODIFIERS.length);
  return RANDOMIZABLE_ROUND_MODIFIERS[idx];
}

export function computeRoundScore(
  winningLine: BingoLine,
  modifier: RoundModifierId,
  roundStartedAt: number,
  wildcardUsed: boolean
): number {
  const baseScore = 100;

  if (modifier === 'double-score-diagonal' && winningLine.type === 'diagonal') {
    return baseScore * 2;
  }

  if (modifier === 'speed-round-bonus-window') {
    const elapsedMs = Date.now() - roundStartedAt;
    return elapsedMs <= 30_000 ? baseScore + 50 : baseScore;
  }

  if (modifier === 'wildcard-square' && wildcardUsed) {
    return baseScore + 25;
  }

  return baseScore;
}
