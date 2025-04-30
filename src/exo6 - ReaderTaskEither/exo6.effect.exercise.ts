// Effect training Exercise 6
// Introduction to Effect for dependency injection, async operations, and error handling

import { Effect, pipe } from 'effect';
import { UserRepositoryService, UserNotFoundError, getById } from './domain/User/Repository/effect';
import { TimeServiceTag, thisYear } from './application/services/effect/TimeService';

// Define effect types for better type safety
type UserEffect<A> = Effect.Effect<A, UserNotFoundError, UserRepositoryService>;
type CombinedEffect<A> = Effect.Effect<A, UserNotFoundError, UserRepositoryService | TimeServiceTag>;

// A utility function to capitalize a string
const capitalize = (str: string): string =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

/**
 * Exercise 1: Basic Effect Mapping
 * 
 * Implement getCapitalizedUserName to fetch a user by ID and return their name capitalized.
 * Use Effect.map to transform the result.
 */
export const getCapitalizedUserName = ({ userId }: {
  userId: string;
}): UserEffect<string> => {
  // Your implementation here
  return pipe(
    getById(userId),
    Effect.map(() => "")
  );
};

/**
 * Exercise 2: Composing Multiple Effects with Effect.gen
 * 
 * Implement getConcatenationOfTheTwoUserNames to fetch two users
 * by their IDs and return their capitalized names concatenated.
 * Use Effect.gen and the generator syntax.
 */
export const getConcatenationOfTheTwoUserNames = (args: {
  userIdOne: string;
  userIdTwo: string;
}): UserEffect<string> => {
  // Your implementation here
  return Effect.succeed("");
};

/**
 * Exercise 3: Using Effect Combinators
 * 
 * Implement getConcatenationOfTheTwoUserNamesUsingZip to perform the same
 * task as above but using Effect.zip and other combinators instead of generators.
 */
export const getConcatenationOfTheTwoUserNamesUsingZip = (args: {
  userIdOne: string;
  userIdTwo: string;
}): UserEffect<string> => {
  // Your implementation here
  return Effect.succeed("");
};

/**
 * Exercise 4: Sequential Operations
 * 
 * Implement getConcatenationOfTheBestFriendNameAndUserName to:
 * 1. Fetch a user by ID
 * 2. Fetch their best friend using the bestFriendId
 * 3. Return both names capitalized and concatenated
 */
export const getConcatenationOfTheBestFriendNameAndUserName = (args: {
  userIdOne: string;
}): UserEffect<string> => {
  // Your implementation here
  return Effect.succeed("");
};

/**
 * Exercise 5: Multiple Services
 * 
 * Implement getConcatenationOfUserNameAndCurrentYear to:
 * 1. Fetch a user by ID from the UserRepositoryService
 * 2. Get the current year from the TimeService
 * 3. Return the user's name concatenated with the year
 * 
 * This demonstrates how to use multiple services in a single Effect.
 */
export const getConcatenationOfUserNameAndCurrentYear = (args: {
  userIdOne: string;
}): CombinedEffect<string> => {
  // Your implementation here
  return Effect.succeed("");
}; 