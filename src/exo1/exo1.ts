// `fp-ts` training Exercise 1
// Basic types:
// - Option
// - Either
// - TaskEither

import { either, option, taskEither } from 'fp-ts';
import { Either } from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/lib/function';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';
import { sleep } from '../utils';

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

// const safeDivideWithIfElse: (a: number, b: number) => Option<number> = (
//   a,
//   b,
// ) => {
//   if (b === 0) {
//     return option.none;
//   } else {
//     return option.some(a / b);
//   }
// };

// We should suggest using option.map
const safeDivideUsingfromPredicate: (a: number, b: number) => Option<number> = (
  a,
  b,
) => {
  const isNotZero = (number: number) => number !== 0;
  return pipe(
    b,
    option.fromPredicate(isNotZero),
    option.map(x => a / x),
  );
};

export const safeDivide = safeDivideUsingfromPredicate;

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

// Here is a simple error type to help you:
export type DivisionByZeroError = 'Error: Division by zero';
export const DivisionByZero = 'Error: Division by zero' as const;

// export const safeDivideWithError: (
//   a: number,
//   b: number,
// ) => Either<DivisionByZeroError, number> = (a, b) => {
//   const isNotZero = (number: number) => number !== 0;
//   return pipe(
//     b,
//     either.fromPredicate(isNotZero, () => DivisionByZero),
//     either.map(x => a / x),
//   );
// };

export const safeDivideWithError: (
  a: number,
  b: number,
) => Either<DivisionByZeroError, number> = flow(
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

// Write the safe version of `asyncDivide` with signature:
// asyncSafeDivideWithError : (a: number, b: number) => TaskEither<DivideByZeroError, number>
//
// HINT: TaskEither has a special constructor to transform a Promise<T> into
// a TaskEither<Error, T>:
// - `taskEither.tryCatch(f: () => promise, onReject: reason => leftValue)`

export const asyncSafeDivideWithError: (
  a: number,
  b: number,
) => TaskEither<DivisionByZeroError, number> = (a: number, b: number) =>
  taskEither.tryCatch(
    () => asyncDivide(a, b),
    () => DivisionByZero,
  );

// I like this explanation here :
// We know a Task is an asynchronous operation that can't fail. We also know an Either is a synchronous operation that can fail. Putting the two together, a TaskEither is an asynchronous operation that can fail.
// https://rlee.dev/practical-guide-to-fp-ts-part-3
