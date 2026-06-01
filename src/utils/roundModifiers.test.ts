import { describe, expect, it } from 'vitest';
import type { BingoLine } from '../types';
import { computeRoundScore, resolveRoundModifier } from './roundModifiers';

const rowLine: BingoLine = { type: 'row', index: 0, squares: [0, 1, 2, 3, 4] };
const diagonalLine: BingoLine = { type: 'diagonal', index: 0, squares: [0, 6, 12, 18, 24] };

describe('roundModifiers', () => {
  describe('resolveRoundModifier', () => {
    it('returns explicit selection when not random', () => {
      expect(resolveRoundModifier('none')).toBe('none');
      expect(resolveRoundModifier('wildcard-square')).toBe('wildcard-square');
    });

    it('resolves random selection using provided random function', () => {
      expect(resolveRoundModifier('random', () => 0.0)).toBe('double-score-diagonal');
      expect(resolveRoundModifier('random', () => 0.5)).toBe('wildcard-square');
      expect(resolveRoundModifier('random', () => 0.99)).toBe('speed-round-bonus-window');
    });
  });

  describe('computeRoundScore', () => {
    it('returns base score without modifier effects', () => {
      expect(computeRoundScore(rowLine, 'none', Date.now(), false)).toBe(100);
    });

    it('doubles score only for diagonal line with diagonal modifier', () => {
      expect(computeRoundScore(diagonalLine, 'double-score-diagonal', Date.now(), false)).toBe(200);
      expect(computeRoundScore(rowLine, 'double-score-diagonal', Date.now(), false)).toBe(100);
    });

    it('adds speed bonus only inside the 30 second window', () => {
      const now = Date.now();
      expect(computeRoundScore(rowLine, 'speed-round-bonus-window', now - 29_999, false)).toBe(150);
      expect(computeRoundScore(rowLine, 'speed-round-bonus-window', now - 30_001, false)).toBe(100);
    });

    it('adds wildcard bonus only when wildcard was used', () => {
      expect(computeRoundScore(rowLine, 'wildcard-square', Date.now(), true)).toBe(125);
      expect(computeRoundScore(rowLine, 'wildcard-square', Date.now(), false)).toBe(100);
    });
  });
});
