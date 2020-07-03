import * as Either from 'fp-ts/lib/Either';
import * as Option from 'fp-ts/lib/Option';

import {
  divide,
  DivisionByZero,
  safeDivide,
  safeDivideWithError,
  asyncDivide,
  asyncSafeDivideWithError,
} from './exo1';

describe('exo1', () => {
  describe('divide', () => {
    it('should return the result of dividing two numbers', () => {
      expect(divide(25, 5)).toEqual(5);
    });

    it('should return Infinity if the denominator is zero', () => {
      expect(divide(25, 0)).toBe(Infinity);
    });
  });

  describe('safeDivide', () => {
    it('should return the result of dividing two numbers', () => {
      expect(safeDivide(25, 5)).toStrictEqual(Option.some(5));
    });

    it('should return Option.none if the denominator is zero', () => {
      expect(safeDivide(25, 0)).toStrictEqual(Option.none);
    });
  });

  describe('safeDivideWithError', () => {
    it('should return the result of dividing two numbers', () => {
      expect(safeDivideWithError(25, 5)).toStrictEqual(Either.right(5));
    });

    it('should return Either.left(DivisionByZero) if the denominator is zero', () => {
      expect(safeDivideWithError(25, 0)).toStrictEqual(
        Either.left(DivisionByZero),
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
    });
  });

  describe('asyncSafeDivideWithError', () => {
    it('should eventually return the result of dividing two numbers', async () => {
      const result = await asyncSafeDivideWithError(25, 5)();

      expect(result).toStrictEqual(Either.right(5));
    });

    it('should eventually return Either.left(DivisionByZero) if the denominator is zero', async () => {
      const result = await asyncSafeDivideWithError(25, 0)();

      expect(result).toStrictEqual(Either.left(DivisionByZero));
    });
  });
});
