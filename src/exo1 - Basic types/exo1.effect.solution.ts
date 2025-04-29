// Effect training Exercise 1
// Basic types:
// - Option
// - Either
// - Effect

import { Option, Either, Effect, pipe } from "effect";
import { sleep } from '../utils.effect';

export const divide = (a: number, b: number): number => {
  return a / b;
};

///////////////////////////////////////////////////////////////////////////////
//                                  OPTION                                   //
///////////////////////////////////////////////////////////////////////////////

// Write the safe version (meaning it handles the case where b is 0) of `divide` with signature:
// safeDivide : (a: number, b: number) => Option<number>
//
// HINT: Option has two basic constructors:
// - `O.some(value)`
// - `O.none()`

export const safeDivide = (a: number, b: number): Option.Option<number> => {
  if (b === 0) {
    return Option.none();
  }

  return Option.some(a / b);
};

// You probably wrote `safeDivide` using `if` statements, and it's perfectly valid!
// There are ways to not use `if` statements.
// Keep in mind that extracting small functions out of pipes and using `if` statements in them
// is perfectly fine and is sometimes more readable than not using `if`.
//
// BONUS: Try now to re-write `safeDivide` without any `if`
//
// HINT: Have a look at `liftPredicate` constructor

export const safeDivideBonus = (a: number, b: number): Option.Option<number> => pipe(
  b,
  Option.liftPredicate(n => n!= 0),
  Option.map(b => a / b)
);



///////////////////////////////////////////////////////////////////////////////
//                                  EITHER                                   //
///////////////////////////////////////////////////////////////////////////////

// Write the safe version of `divide` with signature:
// safeDivideWithError : (a: number, b: number) => Either<number, DivisionByZeroError>
//
// BONUS POINT: Implement `safeDivideWithError` in terms of `safeDivide`.
//
// HINT : Either has two basic constructors:
// - `Either.left(leftValue)`
// - `Either.right(rightValue)`
// as well as "smarter" constructors like:
// supported - `Either.fromOption(() => leftValue)(option)`
// preferred - `Either.fromOption(option, () => leftValue)`
// because Effect supports dual API.

// Here is a simple error type to help you:
export type DivisionByZeroError = 'Error: Division by zero';
export const DivisionByZero = 'Error: Division by zero' as const;

// Note: In Effect, Either is Either<Right, Left> (opposite to fp-ts)
export const safeDivideWithError = (a: number, b: number): Either.Either<number, DivisionByZeroError> => {
  return pipe(
    safeDivide(a, b),
    Either.fromOption(() => DivisionByZero)
  );
};

///////////////////////////////////////////////////////////////////////////////
//                                   EFFECT                                  //
///////////////////////////////////////////////////////////////////////////////

// Now let's say we have a (pretend) API call that will perform the division for us
// (throwing an error when the denominator is 0)
export const asyncDivide = async (a: number, b: number) => {
  await sleep(1000);

  if (b === 0) {
    throw new Error('BOOM!');
  }

  return a / b;
};

// Write the safe version of `asyncDivide` with signature:
// asyncSafeDivideWithError : (a: number, b: number) => Effect.Effect<number, DivisionByZeroError>

// HINT: Effect has a special constructor to transform a Promise<T> into
// an Effect<T, Error, never> (Success, Error, Environment):
// - `Effect.tryPromise({try: () => promise, catch: reason => error})`

// Note: In Effect, Effect.Effect<A, E, R> where:
// - A is the success value type
// - E is the error type
// - R is the requirements type
// (When no requirements are needed, use 'never' or omit the last argument)
export const asyncSafeDivideWithError = (
  a: number,
  b: number
): Effect.Effect<number, DivisionByZeroError, never> => 
  Effect.tryPromise({
    try: () => asyncDivide(a, b),
    catch: () => DivisionByZero
  });
