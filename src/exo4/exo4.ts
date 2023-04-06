// `fp-ts` training Exercise 4
// Dependency injection with `Reader`

import { Reader } from 'fp-ts/Reader';

import { unimplemented } from '../utils';
import { flow, pipe } from 'fp-ts/lib/function';
import { reader } from 'fp-ts';

// Sometimes, a function can have a huge amount of dependencies (services,
// repositories, ...) and it is often impractical (not to say truly annoying)
// to thread those values through multiple levels of the call stack.
//
// That's precisely what dependency injection is meant to solve, and it's not a
// concept exclusive to OOP!
// In the world of FP, the so-called `Reader` construct (just a fancy word for
// a partially applied function) offers precisely those capabilities.

///////////////////////////////////////////////////////////////////////////////
//                                 SETUP                                     //
///////////////////////////////////////////////////////////////////////////////

// Let's consider a small range of countries (here, France, Spain and the USA):

export enum Country {
  France = 'France',
  Spain = 'Spain',
  USA = 'USA',
}

///////////////////////////////////////////////////////////////////////////////
//                                  ASK                                      //
///////////////////////////////////////////////////////////////////////////////

// These countries have different rules on how to add exclamation to a sentence:
// - french speakers will add an exclamation point at the end preceded by a
//   space: "Youpi !"
// - spanish speakers begin the sentence with an inverted exclamation point and
//   finish it by a regular one: `¡Olé!`
// - english speakers will have no space before the exclamation point at the end
//   of the sentence: `Yeah!`
//
// The following function should take a sentence as input and return a `Reader`
// that will at some point expect a `Country` and return the sentence with the
// proper exclamation style.
//
// HINT: Take a look at `reader.ask` to access the environment value

export const exclamation: (
  sentence: string,
) => Reader<Country, string> = sentence =>
  pipe(
    reader.ask<Country>(),
    reader.map(c => {
      switch (c) {
        case Country.France:
          return `${sentence} !`;
        case Country.Spain:
          return `¡${sentence}!`;
        case Country.USA:
          return `${sentence}!`;
        default:
          return `${sentence}!`;
      }
    }),
  );

// Obviously, different countries often mean different languages and so
// different words for saying "Hello":

export const sayHello = (country: Country): string => {
  switch (country) {
    case Country.France:
      return 'Bonjour';
    case Country.Spain:
      return 'Buenos dìas';
    case Country.USA:
      return 'Hello';
  }
};

// Using the `sayHello` function above, write the `greet` function that
// delivers a personalized greeting to a person based on their name.
// The output should look something like `${hello}, ${name}`.
//
// HINT: Remember that a `Reader<R, T>` is just an alias for `(r: R) => T`
//
// HINT: You can look into `reader.map` to modify the output of a `Reader`
// action.

export const greet: (name: string) => Reader<Country, string> = name =>
  pipe(
    reader.ask<Country>(),
    reader.map(c => `${sayHello(c)}, ${name}`),
  );

// Finally, we are going to compose multiple `Reader`s together.
//
// Sometimes, a simple greeting is not enough, we want to communicate our
// excitement to see the person.
// Luckily, we already know how to greet them normally (`greet`) and how to
// add excitement to a sentence (`exclamation`).
//
// Compose those two to complete the `excitedlyGreet` function below:
//
// HINT: As with other wrapper types in `fp-ts`, `reader` offers a way of
// composing effects with `reader.chain`.

export const excitedlyGreet: (name: string) => Reader<Country, string> = flow(
  greet,
  reader.chain(exclamation),
);
