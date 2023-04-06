// `fp-ts` training Exercise 6
// Introduction to `ReaderTaskEither`

import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';
import { unimplemented } from '../utils';
import { Application } from './application';
import { User } from './domain';
import { rte } from '../readerTaskEither';
import { pipe } from 'fp-ts/lib/function';
import { reader } from 'fp-ts';

// In real world applications you will mostly manipulate `ReaderTaskEither` aka
// `rte` in the use-cases of the application.
// `Reader` -> For dependency injection
// `Task` -> For async operation
// `Either` -> For computations that may fail
//
// Keep in Mind, A ReaderTaskEither is nothing more than a Reader of a Task of an Either
// type ReaderTaskEither<Env, Error, Value> = Reader<Env, Task<Either<Error, Value>>>
//
// The ReaderTaskEither module from fp-ts gives us some useful methods to manipulate it.
// You will learn the usage of the most common in the following usecases.

// In the following usecase, you will learn the usage of `rte.map()`.
// `rte.map()` allows you to perform an operation on the values stored in the
// current context. In the following example, we need to fetch a user by its id
// and then we want to return its capitalized.

const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getCapitalizedUserName: (args: {
  userId: string;
}) => ReaderTaskEither<
  User.Repository.Access,
  User.Repository.UserNotFoundError,
  string
> = ({ userId }) =>
  pipe(
    reader.ask<User.Repository.Access>(),
    reader.map(({ userRepository }) => userRepository.getById(userId)),
    rte.map(user => user.name),
    rte.map(capitalizeFirst),
  );

// Sometimes you will need to get multiple data before performing an operation
// on them. In this case, it is very convenient to use the `Do` notation.
//
// The `Do` notation allows you to enrich the context step-by-step by binding
// the result of an effect (in this case a RTE) to a named variable using
// `rte.apS` or `rte.apSW`.
//
// For example:
// pipe(
//  rte.Do,
//  rte.apS('myDataOne', DataSource.getById(x)),
//  ...
// )

// TODO @licarth Missing instructions ?

export const getConcatenationOfTheTwoUserNames: (args: {
  userIdOne: string;
  userIdTwo: string;
}) => ReaderTaskEither<
  User.Repository.Access,
  User.Repository.UserNotFoundError,
  string
> = ({ userIdOne, userIdTwo }) =>
  pipe(
    rte.Do,
    rte.apS('userOne', getCapitalizedUserName({ userId: userIdOne })),
    rte.apS('userTwo', getCapitalizedUserName({ userId: userIdTwo })),
    rte.map(({ userOne, userTwo }) => `${userOne}${userTwo}`),
  );

// Sometimes, you will need to feed the current context with data that you can
// only retrieve after performing some operations, in other words, operations
// need to be sequential.
// For example, if you want to fetch the best friend of a user you will have to
// fetch the first user and then fetch its best friend.
// In this case, we will use `rte.bindW()` to use data of the current context
// (the firstly fetched user) to perform a second operation (fetch its best friend)
// and bind the return value to feed the context and use those data.

export const getConcatenationOfTheBestFriendNameAndUserName: (args: {
  userIdOne: string;
}) => ReaderTaskEither<
  User.Repository.Access,
  User.Repository.UserNotFoundError,
  string
> = ({ userIdOne }) =>
  pipe(
    rte.ask<User.Repository.Access>(),
    rte.apS('userOne', ({ userRepository }) =>
      userRepository.getById(userIdOne),
    ),

    rte.bindW('userTwoName', ({ userOne }) =>
      getCapitalizedUserName({ userId: userOne.bestFriendId }),
    ),
    rte.map(
      ({ userOne, userTwoName }) =>
        `${pipe(userOne.name, capitalizeFirst)}${userTwoName}`,
    ),
  );

// Most of the time, you will need to use several external services.
// The challenge of this usecase is to use TimeService in the flow of our `rte`
type Dependencies = User.Repository.Access & Application.TimeService.Access;

export const getConcatenationOfUserNameAndCurrentYear: (args: {
  userIdOne: string;
}) => ReaderTaskEither<
  Dependencies,
  User.Repository.UserNotFoundError,
  string
> = ({ userIdOne }) =>
  pipe(
    rte.Do,
    rte.apS('name', findUserName(userIdOne)),
    rte.apSW('year', findCurrentYear()),
    rte.map(({ name, year }) => `${name}${year}`),
  );

const findUserName = (userIdOne: string) =>
  pipe(
    rte.ask<User.Repository.Access>(),
    rte.chainTaskEitherK(({ userRepository }) =>
      userRepository.getById(userIdOne),
    ),
    rte.map(user => user.name),
  );

const findCurrentYear = () =>
  pipe(
    rte.ask<Application.TimeService.Access>(),
    rte.map(({ timeService }) => timeService.thisYear()),
  );
