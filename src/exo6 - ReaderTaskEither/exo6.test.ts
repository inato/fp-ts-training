import { either } from 'fp-ts';
import { Application } from './application';
import { User } from './domain';
import {
  getCapitalizedUserName,
  getConcatenationOfTheBestFriendNameAndUserName,
  getConcatenationOfTheTwoUserNames,
  getConcatenationOfTheTwoUserNamesUsingAp,
  getConcatenationOfUserNameAndCurrentYear,
} from './exo6.exercise';

describe('exo6', () => {
  it('should return the capitalized user name', async () => {
    const usecase = getCapitalizedUserName({ userId: '1' })({
      userRepository: new User.Repository.InMemoryUserRepository([
        { id: '1', name: 'rob', bestFriendId: '' },
      ]),
    });

    const result = await usecase();

    expect(result).toEqual(either.right('Rob'));
  });

  it('should return the concatenation of the two capitalized user names', async () => {
    const usecase = getConcatenationOfTheTwoUserNames({
      userIdOne: '1',
      userIdTwo: '2',
    })({
      userRepository: new User.Repository.InMemoryUserRepository([
        { id: '1', name: 'rob', bestFriendId: '' },
        { id: '2', name: 'scott', bestFriendId: '' },
      ]),
    });

    const result = await usecase();

    expect(result).toEqual(either.right('RobScott'));
  });

  it('should return the concatenation of the two capitalized user names using rte.ap', async () => {
    const usecase = getConcatenationOfTheTwoUserNamesUsingAp({
      userIdOne: '1',
      userIdTwo: '2',
    })({
      userRepository: new User.Repository.InMemoryUserRepository([
        { id: '1', name: 'rob', bestFriendId: '' },
        { id: '2', name: 'scott', bestFriendId: '' },
      ]),
    });

    const result = await usecase();

    expect(result).toEqual(either.right('RobScott'));
  });

  it('should return the concatenation of the two capitalized user names based on the best friend relation', async () => {
    const usecase = getConcatenationOfTheBestFriendNameAndUserName({
      userIdOne: '1',
    })({
      userRepository: new User.Repository.InMemoryUserRepository([
        { id: '1', name: 'rob', bestFriendId: '2' },
        { id: '2', name: 'scott', bestFriendId: '1' },
      ]),
    });

    const result = await usecase();

    expect(result).toEqual(either.right('RobScott'));
  });

  it('should return the concatenation of the user name and the current year', async () => {
    const timeservice = new Application.NodeTimeService.NodeTimeService();

    const usecase = getConcatenationOfUserNameAndCurrentYear({
      userIdOne: '1',
    })({
      userRepository: new User.Repository.InMemoryUserRepository([
        { id: '1', name: 'rob', bestFriendId: '2' },
        { id: '2', name: 'scott', bestFriendId: '1' },
      ]),

      timeService: timeservice,
    });

    const result = await usecase();

    expect(result).toEqual(either.right(`rob${timeservice.thisYear()}`));
  });
});
