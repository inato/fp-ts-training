import { either, option } from 'fp-ts';
import * as exercise from './exo1.exercise';
import * as solution from './exo1.solution';
import { isTestingSolution } from '../testUtils';

const {
  divide,
  DivisionByZero,
  safeDivide,
  safeDivideWithError,
  asyncDivide,
  asyncSafeDivideWithError,
} = isTestingSolution() ? solution : exercise;

describe('exo1', () => {
  describe('divide', () => {
    it('should return the result of dividing two numbers', () => {
      expect(divide(25, 5)).toEqual(5);
    });

    it('should return Infinity or -Infinity if the denominator is zero', () => {
      expect(divide(25, 0)).toBe(Infinity);
      expect(divide(-25, 0)).toBe(-Infinity);
    });
  });

  describe('safeDivide', () => {
    it('should return the result of dividing two numbers', () => {
      expect(safeDivide(25, 5)).toStrictEqual(option.some(5));
    });

    it('should return option.none if the denominator is zero', () => {
      expect(safeDivide(25, 0)).toStrictEqual(option.none);
      expect(safeDivide(-25, 0)).toStrictEqual(option.none);
    });
  });

  describe('safeDivideWithError', () => {
    it('should return the result of dividing two numbers', () => {
      expect(safeDivideWithError(25, 5)).toStrictEqual(either.right(5));
    });

    it('should return either.left(DivisionByZero) if the denominator is zero', () => {
      expect(safeDivideWithError(25, 0)).toStrictEqual(
        either.left(DivisionByZero),
      );
      expect(safeDivideWithError(-25, 0)).toStrictEqual(
        either.left(DivisionByZero),
      );
    });
  });

  describe('asyncDivide', () => {
    it('should eventually return the result of dividing two numbers', async () => {
      const result = await asyncDivide(25, 5);

      expect(result).toEqual(5);
    });

    it('should eventually return Infinity if the denominator is zero', async () => {
      await expect(asyncDivide(25, 0)).rejects.toThrow();
      await expect(asyncDivide(-25, 0)).rejects.toThrow();
    });
  });

  describe('asyncSafeDivideWithError', () => {
    it('should eventually return the result of dividing two numbers', async () => {
      const result = await asyncSafeDivideWithError(25, 5)();

      expect(result).toStrictEqual(either.right(5));
    });

    it('should eventually return either.left(DivisionByZero) if the denominator is zero', async () => {
      const resultA = await asyncSafeDivideWithError(25, 0)();
      const resultB = await asyncSafeDivideWithError(-25, 0)();

      expect(resultA).toStrictEqual(either.left(DivisionByZero));
      expect(resultB).toStrictEqual(either.left(DivisionByZero));
    });
  });
});
