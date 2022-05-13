// `fp-ts` training Exercise 1
// Basic types:
// - Option
// - Either
// - TaskEither

import { Either } from 'fp-ts/Either';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';
import { unimplemented, sleep, unimplementedAsync } from '../utils';

export const divide = (a: number, b: number): number => {
  return a / b;
};

///////////////////////////////////////////////////////////////////////////////
//                                  OPTION                                   //
///////////////////////////////////////////////////////////////////////////////

// Write the safe version (meaning it handles the case where b is 0) of `divide` with signature:
// safeDivide : (a: number, b: number) => Option<number>
//
// HINT: Option has two basic contructors:
// - `option.some(value)`
// - `option.none`

export const safeDivide: (a: number, b: number) => Option<number> =
  unimplemented;


// You probably wrote `safeDivide` using `if` statements and it's perfectly valid!
// There are ways to not use `if` statements.
// Keep in mind that extracting small functions out of pipes and using `if` statements in them 
// is perfectly fine and is sometimes more readable than not using `if`.
//
// BONUS: Try now to re-write `safeDivide` without any `if`
//
// HINT: Have a look at `fromPredicate` constructor


///////////////////////////////////////////////////////////////////////////////
//                                  EITHER                                   //
///////////////////////////////////////////////////////////////////////////////

// Write the safe version of `divide` with signature:
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

export const safeDivideWithError: (
  a: number,
  b: number,
) => Either<DivisionByZeroError, number> = unimplemented;

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

// Write the safe version of `asyncDivide` with signature:
// asyncSafeDivideWithError : (a: number, b: number) => TaskEither<DivideByZeroError, number>
//
// HINT: TaskEither has a special constructor to transform a Promise<T> into
// a TaskEither<Error, T>:
// - `taskEither.tryCatch(f: () => promise, onReject: reason => leftValue)`

export const asyncSafeDivideWithError: (
  a: number,
  b: number,
) => TaskEither<DivisionByZeroError, number> = unimplementedAsync;
