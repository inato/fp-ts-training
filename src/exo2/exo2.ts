// `fp-ts` training Exercise 2
// Let's have fun with combinators!

import { Either } from 'fp-ts/Either';
import { Option } from 'fp-ts/Option';
import { Failure } from '../Failure';
import { unimplemented } from '../utils';
import { flow, pipe } from 'fp-ts/lib/function';
import { array, either, option, readonlyArray, readonlyRecord } from 'fp-ts';
import { sequenceS } from 'fp-ts/lib/Apply';
import { foldMap, map } from 'fp-ts/lib/ReadonlyRecord';

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

const checkTargetIsNotNone = either.fromOption(() =>
  noTargetFailure('No unit currently selected'),
);

type GuardedType<T> = T extends (x: any) => x is infer T ? T : never;

const checkTarget =
  <
    T extends
      | {
          typeGuard: (c: Character) => c is Warrior;
          action: 'smash';
        }
      | {
          typeGuard: (c: Character) => c is Wizard;
          action: 'burn';
        }
      | {
          typeGuard: (c: Character) => c is Archer;
          action: 'shoot';
        },
    ReturnType extends GuardedType<T['typeGuard']>,
  >(
    props: T,
  ) =>
  (c: Character) =>
    pipe(
      c,
      either.fromPredicate(props.typeGuard, target =>
        invalidTargetFailure(
          `${target.toString()} cannot perform ${props.action}`,
        ),
      ),
      either.map(target => target as ReturnType),
    );

export const checkTargetAndSmash: (
  target: Option<Character>,
) => Either<NoTargetFailure | InvalidTargetFailure, Damage> = flow(
  checkTargetIsNotNone,
  either.chainW(checkTarget({ typeGuard: isWarrior, action: 'smash' })),
  either.map(warrior => warrior.smash()),
);

export const checkTargetAndBurn: (
  target: Option<Character>,
) => Either<NoTargetFailure | InvalidTargetFailure, Damage> = flow(
  checkTargetIsNotNone,
  either.chainW(checkTarget({ typeGuard: isWizard, action: 'burn' })),
  either.map(wizard => wizard.burn()),
);

export const checkTargetAndShoot: (
  target: Option<Character>,
) => Either<NoTargetFailure | InvalidTargetFailure, Damage> = flow(
  checkTargetIsNotNone,
  either.chainW(checkTarget({ typeGuard: isArcher, action: 'shoot' })),
  either.map(archer => archer.shoot()),
);

///////////////////////////////////////////////////////////////////////////////
//                                  OPTION                                   //
///////////////////////////////////////////////////////////////////////////////

// The next three function take a `Character` and optionally return the
// expected damage type if the unit matches the expected character type.
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

export const smashOption: (
  character: Character,
) => Option<Damage> = character =>
  pipe(checkTargetAndSmash(option.some(character)), option.fromEither); // That's the lazy way

export const burnOption: (character: Character) => Option<Damage> = flow(
  // That's without reusing the previous functions, only smaller private helpers
  option.fromNullable,
  checkTargetIsNotNone,
  either.chainW(checkTarget({ typeGuard: isWizard, action: 'burn' })),
  either.map(wizard => wizard.burn()),
  option.fromEither,
);

export const shootOption: (character: Character) => Option<Damage> = flow(
  option.fromNullable,
  checkTargetIsNotNone,
  either.chainW(checkTarget({ typeGuard: isArcher, action: 'shoot' })),
  either.map(archer => archer.shoot()),
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
export const attack: (army: ReadonlyArray<Character>) => TotalDamage = army =>
  pipe(
    {
      [Damage.Physical]: countDamage(smashOption),
      [Damage.Magical]: countDamage(burnOption),
      [Damage.Ranged]: countDamage(shootOption),
    },
    readonlyRecord.map(m => m(army)),
  );

const countDamage = (
  expectedDamageByCharacter: (character: Character) => Option<Damage>,
): ((fa: readonly Character[]) => number) =>
  flow(readonlyArray.filterMap(expectedDamageByCharacter), a => a.length);
