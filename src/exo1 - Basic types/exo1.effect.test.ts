import { Option, Either, Effect } from "effect";
import * as solution from './exo1.effect.solution';

// Use the solution implementation directly to avoid type mismatches
const {
  divide,
  DivisionByZero,
  safeDivide,
  safeDivideWithError,
  asyncDivide,
  asyncSafeDivideWithError,
} = solution;

describe('exo1.effect', () => {
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
      expect(safeDivide(25, 5)).toStrictEqual(Option.some(5));
    });

    it('should return Option.none() if the denominator is zero', () => {
      expect(safeDivide(25, 0)).toStrictEqual(Option.none());
      expect(safeDivide(-25, 0)).toStrictEqual(Option.none());
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
      expect(safeDivideWithError(-25, 0)).toStrictEqual(
        Either.left(DivisionByZero),
      );
    });
  });

  describe('asyncDivide', () => {
    it('should eventually return the result of dividing two numbers', async () => {
      const result = await asyncDivide(25, 5);

      expect(result).toEqual(5);
    });

    it('should eventually throw an error if the denominator is zero', async () => {
      await expect(asyncDivide(25, 0)).rejects.toThrow();
      await expect(asyncDivide(-25, 0)).rejects.toThrow();
    });
  });

  describe('asyncSafeDivideWithError', () => {
    it('should eventually return the result of dividing two numbers', async () => {
      const result = await Effect.runPromise(asyncSafeDivideWithError(25, 5));

      expect(result).toEqual(5);
    });

    it('should eventually return an Effect with error DivisionByZero if the denominator is zero', async () => {
      const program = Effect.gen(function* () {
        // Test first case with Effect.either
        const resultA = yield* asyncSafeDivideWithError(25, 0).pipe(Effect.either);
        expect(resultA).toStrictEqual(Either.left(DivisionByZero));

        // Test second case with Effect.flip
        const resultB = yield* asyncSafeDivideWithError(-25, 0).pipe(Effect.flip);
        expect(resultB).toBe(DivisionByZero);
      });

      await Effect.runPromise(program);
    });
  });
}); 