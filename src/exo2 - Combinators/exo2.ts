// `fp-ts` training Exercise 2
// Let's have fun with combinators!

import { Either } from 'fp-ts/Either';
import { Option } from 'fp-ts/Option';
import { Failure } from '../Failure';
import { unimplemented } from '../utils';

///////////////////////////////////////////////////////////////////////////////
//                                   SETUP                                   //
///////////////////////////////////////////////////////////////////////////////

// We are developing a small game, and the player can control either one of
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

export const checkTargetAndSmash: (
  target: Option<Character>,
) => Either<NoTargetFailure | InvalidTargetFailure, Damage> = unimplemented;

export const checkTargetAndBurn: (
  target: Option<Character>,
) => Either<NoTargetFailure | InvalidTargetFailure, Damage> = unimplemented;

export const checkTargetAndShoot: (
  target: Option<Character>,
) => Either<NoTargetFailure | InvalidTargetFailure, Damage> = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                                  OPTION                                   //
///////////////////////////////////////////////////////////////////////////////

// The next three functions take a `Character` and optionally return the
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

export const smashOption: (character: Character) => Option<Damage> =
  unimplemented;

export const burnOption: (character: Character) => Option<Damage> =
  unimplemented;

export const shootOption: (character: Character) => Option<Damage> =
  unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                                   ARRAY                                   //
///////////////////////////////////////////////////////////////////////////////

// We now want to aggregate all the attacks of a selection of arbitrarily many
// units (an Army) and know how many are Physical, Magical or Ranged.
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

export type Army = ReadonlyArray<Character>;

export const attack: (army: Army) => TotalDamage = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                                   BONUS                                   //
///////////////////////////////////////////////////////////////////////////////

// Two armies can fight together. For that we must "rank" them in order to
// compare them and determine who is the winner.
// The rank of an Amry will be the weighted sum of its attack power (from the
// previous section). The weights are:
// Physical: 1
// Magical: 2
// Ranged: 3
//
// HINT: you should be able to reuse the previous function attack

export const rank: (army: Army) => number = unimplemented;

// When two armies fight, the winner will be the army with highest rank.
// If two armies have the same rank, then it is a draw, which is represented
// by the result 0 here.
//
// HINT: you should be able to reuse the previous rank function
type FightOutcome = 0 | 1 | 2;
export const fight: (army1: Army) => (army2: Army) => FightOutcome =
  unimplemented;

// Sometimes one army shows up on the battlefield only to discover that their
// adversary is not there (alarm problem, wrong date in the calendar)! If one
// of the two armies (or both!!) does not show up then there is no battle.
// In the next function, we represent the absence of an army and therefore
// the absence of a battle with an Option.
//
// HINT: you should be able to reuse the previous fight function
export const maybeFight: (
  army1: Option<Army>,
  army2: Option<Army>,
) => Option<FightOutcome> = unimplemented;

// You probably used two flatMap in a row to achieve this and it's ok.
// The thing is, it means also nesting a pipe inside another one:
//    pipe(
//      army1,
//      option.flatMap(army1 =>
//        pipe(
//          army2,
//          option.map(army2 => ...),
//        ),
//      ),
//    );
// which makes it harder to read.
// Another valid approach would be to use the Do notation which will be
// introduced later in the training (exo6), but the reading experience
// is still a bit difficult.
//
// Option exposes a nice helper function:
// `option.ap: <A>(fa: Option<A>) => <B>(fab: Option<(a: A) => B>) => Option<B>`
// which "lifts" the application of a function (a: A) => B in the Option space.
//
// Try to rewrite the maybeFight function using `option.ap`
//
// NOTE: almost all types in fp-ts expose the `ap` function

export const maybeFightWithAp: (
  army1: Option<Army>,
  army2: Option<Army>,
) => Option<FightOutcome> = unimplemented;
