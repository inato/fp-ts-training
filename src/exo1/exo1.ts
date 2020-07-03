// `fp-ts` training Exercice 1
// Basic types:
// - Option
// - Either
// - TaskEither

import * as Option from 'fp-ts/lib/Option';
import * as Either from 'fp-ts/lib/Either';
import * as TaskEither from 'fp-ts/lib/TaskEither';

import { unimplemented, sleep, unimplementedAsync } from '../utils';

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
// - `Option.some(value)`
// - `Option.none`

export const safeDivide: (
  a: number,
  b: number,
) => Option.Option<number> = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                                  EITHER                                   //
///////////////////////////////////////////////////////////////////////////////

// Write the safe version of `divide` whith signature:
// safeDivideWithError : (a: number, b: number) => Either<DivideByZeroError, number>
//
// BONUS POINT: Implement `safeDivideWithError` in terms of `safeDivide`.
//
// HINT : Either has two basic constructors:
// - `Either.left(leftValue)`
// - `Either.right(rightValue)`
// as well as "smarter" constructors like:
// - `Either.fromOption(() => leftValue)(option)`

// Here is an simple error type to help you:
export type DivisionByZeroError = 'Error: Division by zero';
export const DivisionByZero = 'Error: Division by zero' as const;

export const safeDivideWithError: (
  a: number,
  b: number,
) => Either.Either<DivisionByZeroError, number> = unimplemented;

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
// - `TaskEither.tryCatch(onReject: err => leftValue, onResolve: val => rightValue)(promise)`

export const asyncSafeDivideWithError: (
  a: number,
  b: number,
) => TaskEither.TaskEither<DivisionByZeroError, number> = unimplementedAsync;
