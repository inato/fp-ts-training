// `fp-ts` training Exercise 6
// Introduction to `ReaderTaskEither`

import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';
import { unimplemented } from '../utils';
import { TimeServiceAccess } from './application/services/TimeService';
import {
  UserNotFoundError,
  UserRepositoryAccess,
} from './domain/User/Repository/Repository';

// In real world applications you will mostly manipulate `ReaderTaskEither` aka `rte` in the use-cases of the application.
// `Reader` -> For dependency injection
// `TaskEither` -> For async operation
//
// Keep in Mind, A ReaderTaskEither is nothing more than a Reader of a Task of an Either
// ReaderTaskEither<Env, Error, Value> === Reader<Env, Task<Either<Error, Value>>>
//
// The ReaderTaskEither module from fp-ts gives us some useful methods to manipulate it.
// You will learn the usage of the most common in the following usecases.

// In the following usecase, you will learn the usage of `rte.map()`.
// `rte.map()` allows you to perform an operation on the values stored in the current context.
// In the following example, we need to fetch a user by its id and then we want to capitalize its name.

export const getCapitalizedUserName: (args: {
  userId: string;
}) => ReaderTaskEither<UserRepositoryAccess, UserNotFoundError, string> =
  unimplemented;

// Sometimes you will need to fetch multiple data before performing an operation on them.
// In this case, it is very convenient to use the `Do` notation.
//
// The `Do` notation allows you to feed the context step-by-step by applicating the result
// of operations on named variables using `rte.apS()` and `rte.apSW()`
//
// For example:
// pipe(
//  rte.Do,
//  rte.apS('myDataOne', DataSource.getById(x)),
//  ...
// )

export const getConcatenationOfTheTwoUserNames: (args: {
  userIdOne: string;
  userIdTwo: string;
}) => ReaderTaskEither<UserRepositoryAccess, UserNotFoundError, string> =
  unimplemented;

// Sometimes, you will need to feed the current context with data that you can only retrieve after performing some operations.
// For example, if you want to fetch the best friend of a user you will have to fetch the first user and then fetch its bestfriend.
// In this case, we will use `rte.bindW()` to use data of the current context (the firstly fetched user)
// to perform a second operation (fetch its bestfriend) and bind the return value to feed the context and use those data.

export const getConcatenationOfTheBestFriendNameAndUserName: (args: {
  userIdOne: string;
}) => ReaderTaskEither<UserRepositoryAccess, UserNotFoundError, string> =
  unimplemented;

// Most of the time, you will need to use several external services.
// The challenge of this usecase is to use TimeService in the flow of our `rte`
type Dependencies = UserRepositoryAccess & TimeServiceAccess;

export const getConcatenationOfUserNameAndYear: (args: {
  userIdOne: string;
}) => ReaderTaskEither<Dependencies, UserNotFoundError, string> = unimplemented;
