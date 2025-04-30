import { Effect, pipe } from 'effect';
import { InMemoryUserRepository, UserRepositoryService, UserNotFoundError, getById } from './domain/User/Repository/effect';
import { NodeTimeService } from './application/services/effect/NodeTimeService';
import { TimeServiceTag, thisYear } from './application/services/effect/TimeService';

// Define helper functions and types
const capitalize = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
type UserEffect<A> = Effect.Effect<A, UserNotFoundError, UserRepositoryService>;
type CombinedEffect<A> = Effect.Effect<A, UserNotFoundError, UserRepositoryService | TimeServiceTag>;

/**
 * Test implementations for the Effect exercise
 */
const getCapitalizedUserName = ({ userId }: { userId: string }): UserEffect<string> => 
  pipe(getById(userId), Effect.map(user => capitalize(user.name)));

const getConcatenationOfTheTwoUserNames = ({ userIdOne, userIdTwo }: { userIdOne: string; userIdTwo: string }): UserEffect<string> => 
  Effect.gen(function* () {
    const user1Name = yield* getCapitalizedUserName({ userId: userIdOne });
    const user2Name = yield* getCapitalizedUserName({ userId: userIdTwo });
    return user1Name + user2Name;
  });

const getConcatenationOfTheTwoUserNamesUsingZip = ({ userIdOne, userIdTwo }: { userIdOne: string; userIdTwo: string }): UserEffect<string> => 
  pipe(
    Effect.zip(
      getCapitalizedUserName({ userId: userIdOne }),
      getCapitalizedUserName({ userId: userIdTwo })
    ),
    Effect.map(([name1, name2]) => name1 + name2)
  );

const getConcatenationOfTheBestFriendNameAndUserName = ({ userIdOne }: { userIdOne: string }): UserEffect<string> => 
  Effect.gen(function* () {
    const user1 = yield* getById(userIdOne);
    const user2 = yield* getById(user1.bestFriendId);
    return `${capitalize(user1.name)}${capitalize(user2.name)}`;
  });

const getConcatenationOfUserNameAndCurrentYear = ({ userIdOne }: { userIdOne: string }): CombinedEffect<string> => 
  Effect.gen(function* () {
    const user = yield* getById(userIdOne);
    const year = yield* thisYear();
    return `${user.name}${year}`;
  });

describe('exo6.effect', () => {
  it('should return the capitalized user name', async () => {
    // GIVEN a repository with a user
    const userRepo = new InMemoryUserRepository([{ id: '1', name: 'rob', bestFriendId: '' }]);
    
    // WHEN getting the capitalized name
    const result = await Effect.runPromise(
      pipe(
        getCapitalizedUserName({ userId: '1' }),
        Effect.provideService(UserRepositoryService, userRepo)
      )
    );

    // THEN it should return the capitalized name
    expect(result).toEqual('Rob');
  });

  it('should return the concatenation of the two capitalized user names', async () => {
    // GIVEN a repository with two users
    const userRepo = new InMemoryUserRepository([
      { id: '1', name: 'rob', bestFriendId: '' },
      { id: '2', name: 'scott', bestFriendId: '' },
    ]);
    
    // WHEN getting the concatenated names using gen function
    const result = await Effect.runPromise(
      pipe(
        getConcatenationOfTheTwoUserNames({
          userIdOne: '1',
          userIdTwo: '2',
        }),
        Effect.provideService(UserRepositoryService, userRepo)
      )
    );

    // THEN it should return the concatenated capitalized names
    expect(result).toEqual('RobScott');
  });

  it('should return the concatenation of the two capitalized user names using zip', async () => {
    // GIVEN a repository with two users
    const userRepo = new InMemoryUserRepository([
      { id: '1', name: 'rob', bestFriendId: '' },
      { id: '2', name: 'scott', bestFriendId: '' },
    ]);
    
    // WHEN getting the concatenated names using zip
    const result = await Effect.runPromise(
      pipe(
        getConcatenationOfTheTwoUserNamesUsingZip({
          userIdOne: '1',
          userIdTwo: '2',
        }),
        Effect.provideService(UserRepositoryService, userRepo)
      )
    );

    // THEN it should return the concatenated capitalized names
    expect(result).toEqual('RobScott');
  });

  it('should return the concatenation of the two capitalized user names based on the best friend relation', async () => {
    // GIVEN a repository with two users who are best friends
    const userRepo = new InMemoryUserRepository([
      { id: '1', name: 'rob', bestFriendId: '2' },
      { id: '2', name: 'scott', bestFriendId: '1' },
    ]);
    
    // WHEN getting the concatenated names of a user and their best friend
    const result = await Effect.runPromise(
      pipe(
        getConcatenationOfTheBestFriendNameAndUserName({
          userIdOne: '1',
        }),
        Effect.provideService(UserRepositoryService, userRepo)
      )
    );

    // THEN it should return the concatenated capitalized names
    expect(result).toEqual('RobScott');
  });

  it('should return the concatenation of the user name and the current year', async () => {
    // GIVEN a repository and a time service
    const userRepo = new InMemoryUserRepository([
      { id: '1', name: 'rob', bestFriendId: '2' },
      { id: '2', name: 'scott', bestFriendId: '1' },
    ]);
    const timeService = new NodeTimeService();
    const year = timeService.thisYear();
    
    // WHEN getting the user name concatenated with the current year
    const result = await Effect.runPromise(
      pipe(
        getConcatenationOfUserNameAndCurrentYear({
          userIdOne: '1',
        }),
        Effect.provideService(UserRepositoryService, userRepo),
        Effect.provideService(TimeServiceTag, timeService)
      )
    );

    // THEN it should return the name concatenated with the year
    expect(result).toEqual(`rob${year}`);
  });

  it('getCapitalizedUserName', async () => {
    const userRepo = new InMemoryUserRepository([
      { id: 'user1', name: 'alice', bestFriendId: 'user2' }
    ]);
    
    await Effect.runPromise(
      pipe(
        Effect.gen(function* () {
          const result = yield* getCapitalizedUserName({ userId: 'user1' });
          expect(result).toBe('Alice');
        }),
        Effect.provideService(UserRepositoryService, userRepo)
      )
    );
  });

  it('getConcatenationOfTheTwoUserNames', async () => {
    const userRepo = new InMemoryUserRepository([
      { id: 'user1', name: 'alice', bestFriendId: 'user2' },
      { id: 'user2', name: 'bob', bestFriendId: 'user1' }
    ]);
    
    await Effect.runPromise(
      pipe(
        Effect.gen(function* () {
          const result = yield* getConcatenationOfTheTwoUserNames({
            userIdOne: 'user1',
            userIdTwo: 'user2',
          });
          expect(result).toBe('AliceBob');
        }),
        Effect.provideService(UserRepositoryService, userRepo)
      )
    );
  });

  it('getConcatenationOfTheBestFriendNameAndUserName', async () => {
    const userRepo = new InMemoryUserRepository([
      { id: 'user1', name: 'alice', bestFriendId: 'user2' },
      { id: 'user2', name: 'bob', bestFriendId: 'user1' }
    ]);
    
    await Effect.runPromise(
      pipe(
        Effect.gen(function* () {
          const result = yield* getConcatenationOfTheBestFriendNameAndUserName({
            userIdOne: 'user1',
          });
          expect(result).toBe('AliceBob');
        }),
        Effect.provideService(UserRepositoryService, userRepo)
      )
    );
  });
}); 