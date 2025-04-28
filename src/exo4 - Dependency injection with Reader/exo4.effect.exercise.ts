// Effect training Exercise 4
// Dependency injection with Effect

import { Effect, Context } from 'effect';

// Sometimes, a function can have a huge amount of dependencies (services,
// repositories, ...) and it is often impractical (not to say truly annoying)
// to thread those values through multiple levels of the call stack.
//
// That's precisely what dependency injection is meant to solve, and it's not a
// concept exclusive to OOP!
// In the world of FP, the dependency injection pattern can be implemented using
// the Reader pattern, which in Effect is built into the Effect type itself.

///////////////////////////////////////////////////////////////////////////////
//                                 SETUP                                     //
///////////////////////////////////////////////////////////////////////////////

// Let's consider a small range of countries (here, France, Spain and the USA):

export enum Country {
  France = 'France',
  Spain = 'Spain',
  USA = 'USA',
}

// Create a service interface for our dependency
export class CountryService extends Context.Tag('CountryService')<CountryService, Country>() {}

///////////////////////////////////////////////////////////////////////////////
//                             EFFECT WITH CONTEXT                           //
///////////////////////////////////////////////////////////////////////////////

// These countries have different rules on how to add exclamation to a sentence:
// - French speakers will add an exclamation point at the end preceded by a
//   space: "Youpi !"
// - spanish speakers begin the sentence with an inverted exclamation point and
//   finish it by a regular one: `¡Olé!`
// - english speakers will have no space before the exclamation point at the end
//   of the sentence: `Yeah!`
//
// The following function should take a sentence as input and return an Effect
// that requires a Country context and returns the sentence with the
// proper exclamation style.

export const exclamation = (sentence: string): Effect.Effect<string, never, CountryService> => {
  return Effect.gen(function* (_) {
    const country = yield* CountryService;
    switch (country) {
      case Country.France:
        return `${sentence} !`;
      case Country.Spain:
        return `¡${sentence}!`;
      case Country.USA:
        return `${sentence}!`;
    }
  });
};

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

export const greet = (name: string): Effect.Effect<string, never, CountryService> => {
  return Effect.gen(function* (_) {
    const country = yield* CountryService;
    const greeting = sayHello(country);
    return `${greeting}, ${name}`;
  });
};

// Finally, we are going to compose multiple Effects together.
//
// Sometimes, a simple greeting is not enough, we want to communicate our
// excitement to see the person.
// Luckily, we already know how to greet them normally (`greet`) and how to
// add excitement to a sentence (`exclamation`).
//
// Compose those two to complete the `excitedlyGreet` function below:

export const excitedlyGreet = (name: string): Effect.Effect<string, never, CountryService> => {
  return Effect.flatMap(greet(name), exclamation);
}; 