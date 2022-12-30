// `fp-ts` training Exercise 8
// Define your own combinators

import { Either } from 'fp-ts/Either';
import { flow } from 'fp-ts/function';
import { Reader } from 'fp-ts/Reader';
import { ReaderTaskEither } from 'fp-ts/ReaderTaskEither';
import { rte } from '../readerTaskEither';

// Technically, a combinator is a pure function with no free variables in it,
// ie. one that does not depend on any variable from its enclosing scope.
//
// We usually refer to functions that allow the manipulation of types like
// `Option`, `Either` and the likes such as `map`, `chain` and so on as
// combinators.
//
// The fp-ts library provides a rich collection for such combinators for each
// type and module but sometimes, you may want to reach for a combinator that
// doesn't yet exist in the library and it is usefull to know how to define
// your own.

///////////////////////////////////////////////////////////////////////////////
//                            TRANSFORMER HELPERS                            //
///////////////////////////////////////////////////////////////////////////////

// Transformer stacks such as `ReaderTaskEither` already provide useful
// combinators such as `chainOptionK`, `chainEitherK[W]`, and so on... However,
// these combinators are not available to use in the context of the do-notation
// (as `bindXXX` variants).

// Part of the difficulty in writing your own combinator is writing its type
// definition properly.
// We provide the type definition for this first one as a stepping stone, but
// the following ones must be carefully defined on your own.

// Write the implementation of `bindEitherK`. It must behave like
// `rte.chainEitherK` but in the context of the do-notation.
//
// HINTS:
// - take some time to study the type definition carefully
// - the implementation really should be the easy part, as you are allowed to
//   use any other combinators available from the library
// - you may want to define it using the existing `rte.bind` and somehow
//   applying some conversion to the result

export const bindEitherK: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Either<E, B>,
) => <R>(
  ma: ReaderTaskEither<R, E, A>,
) => ReaderTaskEither<
  R,
  E,
  { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
> = (name, f) => rte.bind(name, a => rte.fromEither(f(a)));

// Write the implementation and type definition of `bindEitherKW`, the
// "Widened" version of `bindEitherK`.

export const bindEitherKW: <N extends string, A, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Either<E2, B>,
) => <R, E1>(
  ma: ReaderTaskEither<R, E1, A>,
) => ReaderTaskEither<
  R,
  E1 | E2,
  { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
> = (name, f) => rte.bindW(name, a => rte.fromEither(f(a)));

// Write the implementations and type definitions of `apEitherK` and
// `apEitherKW`.

// Don't understand why I can remove the generic type on ma here ?
export const apEitherK: <N extends string, A, R, E, B>(
  name: Exclude<N, keyof A>,
  f: Either<E, B>,
) => (
  ma: ReaderTaskEither<R, E, A>,
) => ReaderTaskEither<
  R,
  E,
  { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
> = (name, f) => rte.apS(name, rte.fromEither(f));

export const apEitherKW: <N extends string, A, E, B>(
  name: Exclude<N, keyof A>,
  f: Either<E, B>,
) => <R, E1>(
  ma: ReaderTaskEither<R, E1, A>,
) => ReaderTaskEither<
  R,
  E | E1,
  { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
> = (name, f) => rte.apSW(name, rte.fromEither(f));

// Write the implementations and type definitions of `apEitherK` and
// `apEitherKW`.

export const bindReaderK: <N extends string, A, R, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Reader<R, B>,
) => (fa: ReaderTaskEither<R, E, A>) => ReaderTaskEither<
  R,
  E,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B;
  }
> = (name, f) => rte.bind(name, a => rte.fromReader(f(a)));

export const bindReaderKW: <N extends string, A, R1, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Reader<R1, B>,
) => <R2>(fa: ReaderTaskEither<R2, E, A>) => ReaderTaskEither<
  R1 & R2,
  E,
  {
    readonly [K in keyof A | N]: K extends keyof A ? A[K] : B;
  }
> = (name, f) => rte.bindW(name, flow(f, rte.rightReader));
