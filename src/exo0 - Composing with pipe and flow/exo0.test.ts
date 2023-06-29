import { isOddF, isOddP, next, next3 } from './exo0.exercise';

describe('exo0', () => {
  describe('isOddP', () => {
    it('should return true if the provided number is odd', () => {
      const oddValue = 1;

      expect(isOddP(oddValue)).toBe(true);
    });

    it('should return false if the provided number is even', () => {
      const oddValue = 2;

      expect(isOddP(oddValue)).toBe(false);
    });
  });

  describe('isOddF', () => {
    it('should return true if the provided number is odd', () => {
      const oddValue = 1;

      expect(isOddF(oddValue)).toBe(true);
    });

    it('should return false if the provided number is even', () => {
      const oddValue = 2;

      expect(isOddF(oddValue)).toBe(false);
    });
  });

  describe('next', () => {
    it('should return the correct next element in the Collatz sequence', () => {
      expect(next(4)).toBe(2);
      expect(next(2)).toBe(1);
      expect(next(1)).toBe(4);
    });
  });

  describe('next3', () => {
    it('should return the correct element in the Collatz sequence 3 steps ahead', () => {
      expect(next3(12)).toBe(10);
      expect(next3(10)).toBe(8);
      expect(next3(8)).toBe(1);
      expect(next3(1)).toBe(1);
    });
  });
});
