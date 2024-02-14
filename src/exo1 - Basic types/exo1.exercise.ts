// `fp-ts` training Exercise 1
// Basic types:
// - Option
// - Either
// - TaskEither

import { Option } from 'fp-ts/Option';
import { sleep } from '../utils';
import { either, option, taskEither } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

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
// - `option.some(value)`
// - `option.none`

export const safeDivide: (a: number, b: number) => Option<number> =
  (a: number, b: number) => {
    if (b !== 0) {
      return option.some(divide(a, b))
    }
    return option.none
}

/*
I used the solution to help me write the version below:

const isValidDivisor = (n: number): boolean => n !== 0;
export const safeDivide = (a: number, b: number) => 
  pipe(b,
    option.fromPredicate(b => isValidDivisor(b)), 
    option.map(b => divide(a, b))
  )
*/

// You probably wrote `safeDivide` using `if` statements, and it's perfectly valid!
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
 
export const safeDivideWithError = (
  a: number,
  b: number) =>  
  pipe(
    b, 
    either.fromPredicate(
      n => n!== 0,
      () => DivisionByZero,
    ),
    either.map(b => a/b)
  )
  

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

export const asyncSafeDivideWithError = (
  a: number,
  b: number,
) => taskEither.tryCatch(() => asyncDivide(a, b), () => DivisionByZero)
