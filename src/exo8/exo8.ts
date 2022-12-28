// `fp-ts` training Exercise 8
// Define your own combinators

import { Either } from 'fp-ts/Either';
import { ReaderTaskEither } from 'fp-ts/ReaderTaskEither';
import { unimplemented } from '../utils';

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
> = unimplemented;

// Write the implementation and type definition of `bindEitherKW`, the
// "Widened" version of `bindEitherK`.

export const bindEitherKW = unimplemented;

// Write the implementations and type definitions of `apEitherK` and
// `apEitherKW`.

export const apEitherK = unimplemented;

export const apEitherKW = unimplemented;

// Write the implementations and type definitions of `apEitherK` and
// `apEitherKW`.

export const bindReaderK = unimplemented;

export const bindReaderKW = unimplemented;
