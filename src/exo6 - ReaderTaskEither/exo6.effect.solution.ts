// Effect training Exercise 6
// Introduction to Effect for dependency injection, async operations, and error handling

import { Effect, pipe } from 'effect';
import { UserRepositoryService, UserNotFoundError, getById } from './domain/User/Repository/effect';
import { TimeServiceTag, thisYear } from './application/services/effect/TimeService';

// Define effect types for better type safety
type UserEffect<A> = Effect.Effect<A, UserNotFoundError, UserRepositoryService>;
type CombinedEffect<A> = Effect.Effect<A, UserNotFoundError, UserRepositoryService | TimeServiceTag>;

/**
 * Helper function to capitalize a string
 */
const capitalize = (str: string): string =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

/**
 * Solution 1: Basic Effect Mapping
 * 
 * Fetches a user by ID and returns their name capitalized.
 * Uses Effect.map to transform the result.
 */
export const getCapitalizedUserName = ({ userId }: { userId: string }): UserEffect<string> =>
  pipe(
    getById(userId),
    Effect.map(user => capitalize(user.name))
  );

/**
 * Solution 2: Composing Multiple Effects with Effect.gen
 * 
 * Fetches two users by their IDs and returns their capitalized names concatenated.
 * Uses Effect.gen and the generator syntax for cleaner async composition.
 */
export const getConcatenationOfTheTwoUserNames = ({
  userIdOne,
  userIdTwo,
}: {
  userIdOne: string;
  userIdTwo: string;
}): UserEffect<string> =>
  Effect.gen(function* (_) {
    const userOneCapitalizedName = yield* getCapitalizedUserName({ userId: userIdOne });
    const userTwoCapitalizedName = yield* getCapitalizedUserName({ userId: userIdTwo });
    
    return userOneCapitalizedName + userTwoCapitalizedName;
  });

/**
 * Solution 3: Using Effect Combinators
 * 
 * Performs the same task as above but using Effect.zip and other combinators
 * instead of generators, demonstrating a more functional approach.
 */
export const getConcatenationOfTheTwoUserNamesUsingZip = ({
  userIdOne,
  userIdTwo,
}: {
  userIdOne: string;
  userIdTwo: string;
}): UserEffect<string> =>
  pipe(
    Effect.zip(
      getCapitalizedUserName({ userId: userIdOne }),
      getCapitalizedUserName({ userId: userIdTwo })
    ),
    Effect.map(([name1, name2]) => name1 + name2)
  );

/**
 * Solution 4: Sequential Operations
 * 
 * 1. Fetches a user by ID
 * 2. Fetches their best friend using the bestFriendId
 * 3. Returns both names capitalized and concatenated
 * 
 * This demonstrates sequential dependency between effects.
 */
export const getConcatenationOfTheBestFriendNameAndUserName = ({
  userIdOne,
}: {
  userIdOne: string;
}): UserEffect<string> =>
  Effect.gen(function* (_) {
    const userOne = yield* getById(userIdOne);
    const userTwo = yield* getById(userOne.bestFriendId);
    
    return `${capitalize(userOne.name)}${capitalize(userTwo.name)}`;
  });

/**
 * Solution 5: Multiple Services
 * 
 * 1. Fetches a user by ID from the UserRepositoryService
 * 2. Gets the current year from the TimeService
 * 3. Returns the user's name concatenated with the year
 * 
 * This demonstrates how to use multiple services in a single Effect.
 */
export const getConcatenationOfUserNameAndCurrentYear = ({
  userIdOne,
}: {
  userIdOne: string;
}): CombinedEffect<string> =>
  Effect.gen(function* (_) {
    const user = yield* getById(userIdOne);
    const year = yield* thisYear();
    
    return `${user.name}${year}`;
  }); 