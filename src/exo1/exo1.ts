// `fp-ts` training Exercice 1
// Basic types:
// - Option
// - Either
// - TaskEither

import { either, option, taskEither } from 'fp-ts';
import { flow } from 'fp-ts/function';

import { sleep } from '../utils';

export const divide = (a: number, b: number): number => {
  return a / b;
};

///////////////////////////////////////////////////////////////////////////////
//                                  OPTION                                   //
///////////////////////////////////////////////////////////////////////////////

// Write the safe version of `divide` whith signature:
// safeDivide : (a: number, b: number) => Option<number>
//
// HINT: Option has two basic contructors:
// - `option.some(value)`
// - `option.none`

export const safeDivide = (a: number, b: number) => {
  if (b === 0) {
    return option.none;
  }

  return option.some(a / b);
};

///////////////////////////////////////////////////////////////////////////////
//                                  EITHER                                   //
///////////////////////////////////////////////////////////////////////////////

// Write the safe version of `divide` whith signature:
// safeDivideWithError : (a: number, b: number) => Either<DivideByZeroError, number>
//
// BONUS POINT: Implement `safeDivideWithError` in terms of `safeDivide`.
//
// HINT : Either has two basic constructors:
// - `either.left(leftValue)`
// - `either.right(rightValue)`
// as well as "smarter" constructors like:
// - `either.fromOption(() => leftValue)(option)`

// Here is an simple error type to help you:
export type DivisionByZeroError = 'Error: Division by zero';
export const DivisionByZero = 'Error: Division by zero' as const;

export const safeDivideWithError = flow(
  safeDivide,
  either.fromOption(() => DivisionByZero),
);

///////////////////////////////////////////////////////////////////////////////
//                                TASKEITHER                                 //
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

// Write the safe version of `divide` whith signature:
// asyncSafeDivideWithError : (a: number, b: number) => TaskEither<DivideByZeroError, number>
//
// HINT: TaskEither has a special constructor to transform a Promise<T> into
// a TaskEither<Error, T>:
// - `taskEither.tryCatch(f: () => promise, onReject: reason => leftValue)`

export const asyncSafeDivideWithError = (a: number, b: number) =>
  taskEither.tryCatch(
    () => asyncDivide(a, b),
    () => DivisionByZero,
  );
