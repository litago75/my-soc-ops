import { describe, it, expect, vi, afterEach } from 'vitest';
import { CELEBRATION_VARIANTS, pickCelebrationVariant } from './celebrationVariants';

describe('celebrationVariants', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('CELEBRATION_VARIANTS', () => {
    it('should have at least 4 distinct variants', () => {
      expect(CELEBRATION_VARIANTS.length).toBeGreaterThanOrEqual(4);
    });

    it('should have unique ids', () => {
      const ids = CELEBRATION_VARIANTS.map((v) => v.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('each variant should have required fields', () => {
      for (const variant of CELEBRATION_VARIANTS) {
        expect(typeof variant.id).toBe('string');
        expect(variant.id.length).toBeGreaterThan(0);
        expect(typeof variant.emoji).toBe('string');
        expect(variant.emoji.length).toBeGreaterThan(0);
        expect(typeof variant.heading).toBe('string');
        expect(variant.heading.length).toBeGreaterThan(0);
        expect(typeof variant.message).toBe('string');
        expect(variant.message.length).toBeGreaterThan(0);
        expect(typeof variant.animationClass).toBe('string');
        expect(variant.animationClass.length).toBeGreaterThan(0);
        expect(typeof variant.headingColorClass).toBe('string');
        expect(variant.headingColorClass.length).toBeGreaterThan(0);
      }
    });

    it('variants should have distinct emojis', () => {
      const emojis = CELEBRATION_VARIANTS.map((v) => v.emoji);
      expect(new Set(emojis).size).toBe(emojis.length);
    });

    it('variants should have distinct messages', () => {
      const messages = CELEBRATION_VARIANTS.map((v) => v.message);
      expect(new Set(messages).size).toBe(messages.length);
    });
  });

  describe('pickCelebrationVariant', () => {
    it('should return a valid variant from the list', () => {
      const variant = pickCelebrationVariant();
      expect(CELEBRATION_VARIANTS).toContainEqual(variant);
    });

    it('should return the first variant when Math.random returns 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const variant = pickCelebrationVariant();
      expect(variant).toEqual(CELEBRATION_VARIANTS[0]);
    });

    it('should return the last variant when Math.random returns just below 1', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999);
      const variant = pickCelebrationVariant();
      expect(variant).toEqual(CELEBRATION_VARIANTS[CELEBRATION_VARIANTS.length - 1]);
    });

    it('should be able to return different variants on consecutive calls', () => {
      let callCount = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        // Alternate between 0 and 0.5 so we get different indices
        return callCount++ % 2 === 0 ? 0 : 0.5;
      });

      const first = pickCelebrationVariant();
      const second = pickCelebrationVariant();

      // With 5 variants: index 0 (value 0) vs index 2 (value 0.5 * 5 = 2.5 → 2)
      expect(first).not.toEqual(second);
    });

    it('should cover all variants given deterministic inputs', () => {
      const seen = new Set<string>();
      for (let i = 0; i < CELEBRATION_VARIANTS.length; i++) {
        vi.spyOn(Math, 'random').mockReturnValueOnce(i / CELEBRATION_VARIANTS.length);
        const variant = pickCelebrationVariant();
        seen.add(variant.id);
      }
      expect(seen.size).toBe(CELEBRATION_VARIANTS.length);
    });
  });
});
