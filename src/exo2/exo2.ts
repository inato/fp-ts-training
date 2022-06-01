// `fp-ts` training Exercise 2
// Let's have fun with combinators!

import { either, option, readonlyArray } from 'fp-ts';
import { Either } from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/lib/function';
import { Option } from 'fp-ts/Option';
import { Failure } from '../Failure';

///////////////////////////////////////////////////////////////////////////////
//                                   SETUP                                   //
///////////////////////////////////////////////////////////////////////////////

// We are developping a small game, and the player can control either one of
// three types of characters, mainly differentiated by the type of damage they
// can put out.

// Our main `Character` type is a simple union of all the concrete character
// types.
export type Character = Warrior | Wizard | Archer;

// We have three types of `Damage`, each corresponding to a character type.
export enum Damage {
  Physical = 'Physical damage',
  Magical = 'Magical damage',
  Ranged = 'Ranged damage',
}

// A `Warrior` only can output physical damage.
export class Warrior {
  smash() {
    return Damage.Physical;
  }

  toString() {
    return 'Warrior';
  }
}

// A `Wizard` only can output magical damage.
export class Wizard {
  burn() {
    return Damage.Magical;
  }

  toString() {
    return 'Wizard';
  }
}

// An `Archer` only can output ranged damage.
export class Archer {
  shoot() {
    return Damage.Ranged;
  }

  toString() {
    return 'Archer';
  }
}

// We also have convenient type guards to help us differentiate between
// character types when given a `Character`.

// I have to learn about type guard functions
export const isWarrior = (character: Character): character is Warrior => {
  return (character as Warrior).smash !== undefined;
};

export const isWizard = (character: Character): character is Wizard => {
  return (character as Wizard).burn !== undefined;
};

export const isArcher = (character: Character): character is Archer => {
  return (character as Archer).shoot !== undefined;
};

// Finally, we have convenient and expressive error types, defining what can
// go wrong in our game:
// - the player can try to perform an action with no character targeted
// - the player can try to perform the wrong action for a character class

export enum Exo2FailureType {
  NoTarget = 'Exo2FailureType_NoTarget',
  InvalidTarget = 'Exo2FailureType_InvalidTarget',
}

export type NoTargetFailure = Failure<Exo2FailureType.NoTarget>;
export const noTargetFailure = Failure.builder(Exo2FailureType.NoTarget);

export type InvalidTargetFailure = Failure<Exo2FailureType.InvalidTarget>;
export const invalidTargetFailure = Failure.builder(
  Exo2FailureType.InvalidTarget,
);

///////////////////////////////////////////////////////////////////////////////
//                                  EITHER                                   //
///////////////////////////////////////////////////////////////////////////////

// The next three functions take the unit currently targeted by the player and
// return the expected damage type if appropriate.
// I had to read the tests file to understand what is expected
//
// If no unit is selected, it should return
// `either.left(noTargetFailure('No unit currently selected'))`
//
// If a unit of the wrong type is selected, it should return
// `either.left(invalidTargetFailure('<unit_type> cannot perform <action>'))`
//
// Otherwise, it should return `either.right(<expected_damage_type>)`
//
// HINT: These functions represent the public API. But it is heavily
// recommended to break those down into smaller private functions that can be
// reused instead of doing one big `pipe` for each.
//
// HINT: `Either` has a special constructor `fromPredicate` that can accept
// a type guard such as `isWarrior` to help with type inference.
//
// HINT: Sequentially check for various possible errors is one of the most
// common operations done with the `Either` type and it is available through
// the `chain` operator and its slightly relaxed variant `chainW`.

const eitherIsX = (isX: (character: Character) => boolean, action: string) =>
  either.fromPredicate(isX, (character: Character) => {
    const unitType = character.toString();
    return invalidTargetFailure(`${unitType} cannot perform ${action}`);
  });

const eitherIsWarrior = eitherIsX(isWarrior, 'smash');
const eitherIsWizard = eitherIsX(isWizard, 'burn');
const eitherIsArcher = eitherIsX(isArcher, 'shoot');

const eitherExists = either.fromOption(() =>
  noTargetFailure('No unit currently selected'),
);

export const checkTargetAndSmash: (
  target: Option<Character>,
) => Either<NoTargetFailure | InvalidTargetFailure, Damage> = (
  target: Option<Character>,
) => {
  return pipe(
    target,
    eitherExists, // I do not understand why there is an alert when I used chain instead of chainW
    either.chainW(eitherIsWarrior),
    either.chainW(() => either.right(Damage.Physical)),
  );
};

export const checkTargetAndBurn: (
  target: Option<Character>,
) => Either<NoTargetFailure | InvalidTargetFailure, Damage> = (
  target: Option<Character>,
) => {
  return pipe(
    target,
    eitherExists,
    either.chainW(eitherIsWizard),
    either.chainW(() => either.right(Damage.Magical)),
  );
};

export const checkTargetAndShoot: (
  target: Option<Character>,
) => Either<NoTargetFailure | InvalidTargetFailure, Damage> = (
  target: Option<Character>,
) => {
  return pipe(
    target,
    eitherExists,
    either.chainW(eitherIsArcher),
    either.chainW(() => either.right(Damage.Ranged)),
  );
};

///////////////////////////////////////////////////////////////////////////////
//                                  OPTION                                   //
///////////////////////////////////////////////////////////////////////////////

// The next three function take a `Character` and optionally return the
// expected damage type if the unit matches the expected character type.
// I read the tests to understand what is expected
//
// HINT: These functions represent the public API. But it is heavily
// recommended to break those down into smaller private functions that can be
// reused instead of doing one big `pipe` for each.
//
// HINT: `Option` has a special constructor `fromEither` that discards the
// error type.
//
// BONUS POINTS: If you properly defined small private helpers in the previous
// section, they should be easily reused for those use-cases.

export const smashOption: (character: Character) => Option<Damage> = flow(
  eitherIsWarrior,
  either.chain(() => either.right(Damage.Physical)),
  option.fromEither,
);

export const burnOption: (character: Character) => Option<Damage> = flow(
  eitherIsWizard,
  either.chain(() => either.right(Damage.Magical)),
  option.fromEither,
);

export const shootOption: (character: Character) => Option<Damage> = flow(
  eitherIsArcher,
  either.chain(() => either.right(Damage.Ranged)),
  option.fromEither,
);

///////////////////////////////////////////////////////////////////////////////
//                                   ARRAY                                   //
///////////////////////////////////////////////////////////////////////////////

// We now want to aggregate all the attacks of a selection of arbitrarily many
// units and know how many are Physical, Magical or Ranged.
//
// HINT: You should be able to reuse the attackOption variants defined earlier
//
// HINT: `ReadonlyArray` from `fp-ts` has a neat `filterMap` function that
// perform mapping and filtering at the same time by applying a function
// of type `A => Option<B>` over the collection.

export interface TotalDamage {
  [Damage.Physical]: number;
  [Damage.Magical]: number;
  [Damage.Ranged]: number;
}

export const attack: (army: ReadonlyArray<Character>) => TotalDamage = (
  army: ReadonlyArray<Character>,
) => {
  const physical = pipe(
    army,
    readonlyArray.filterMap(smashOption),
    readonlyArray.reduce(0, prev => prev + 1), // Am I supposed to use reduce ?
  );
  const magical = pipe(
    army,
    readonlyArray.filterMap(burnOption),
    readonlyArray.reduce(0, prev => prev + 1),
  );
  const ranged = pipe(
    army,
    readonlyArray.filterMap(shootOption),
    readonlyArray.reduce(0, prev => prev + 1),
  );
  return {
    [Damage.Physical]: physical,
    [Damage.Magical]: magical,
    [Damage.Ranged]: ranged,
  };
};
