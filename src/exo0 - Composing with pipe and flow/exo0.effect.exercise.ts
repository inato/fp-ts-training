// Effect training introduction
// Composing computations with `pipe` and `flow`

// Functional programming is all about composing small functions together like
// Lego bricks to build more and more complex computations.
//
// Strictly speaking, composing two functions `f` and `g` means applying the
// result of the first one to the second one. By applying this composition
// over and over you can chain multiple functions together.
//
// The `Effect` library provides helpers to do that:
// - `pipe` which first needs to be fed a value to start the pipe and then
//   any number of functions to be applied sequentially.
// - `flow` which is the same thing but where we do not have to provide the
//   first value. It will then return a function which will expect that value
//   to be provided
//
// ```ts
// flow(f, g, h) === x => pipe(x, f, g, h)
// pipe(x, f, g, h) === flow(f, g, h)(x)
// ```
//
// NOTES:
// - `flow(f) === f`
// - `pipe(x, f) === f(x)`

import { flow } from "fp-ts/lib/function"
import { unimplemented } from "../utils"

export const isEven = (value: number) => value % 2 === 0

export const not = (value: boolean) => !value

///////////////////////////////////////////////////////////////////////////////
//                               PIPE & FLOW                                   //
///////////////////////////////////////////////////////////////////////////////

// For this exercise each function needs to be implemented using both forms:
// - a `pipe` implementation (P suffix)
// - a `flow` implementation (F suffix)

// Using only the two helpers `isEven` and `not` at the top of this file (and
// `pipe` or `flow`), write the function `isOdd` that checks if a number is
// odd.

export const isOddP = (value: number) => unimplemented;

export const isOddF = (value: number) => unimplemented;

// We will write a function that for any given number, computes the next
// one according to the following rules:
// - if n is even => divide it by two
// - if n is odd  => triple it and add one
//
// This sequence is the object of The Collatz conjecture: https://en.wikipedia.org/wiki/Collatz_conjecture
//
// Below is the functional equivalent of the control flow statement if-else.

export const ifThenElse =
  <A>(onTrue: () => A, onFalse: () => A) =>
  (condition: boolean) =>
    condition ? onTrue() : onFalse()

// Using `pipe` and `ifThenElse`, write the function that computes the next step in the Collatz
// sequence.

export const next = (value: number) => unimplemented;

// Using only `flow` and `next`, write the function that for any given number
// a_n from the Collatz sequence, returns the number a_n+3 (i.e. the number
// three steps ahead in the sequence).

export const next3 = unimplemented;