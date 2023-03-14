// `fp-ts` training Exercise 6
// Introduction to `ReaderTaskEither`

import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';
import { unimplemented } from '../utils';
import { Application } from './application';
import { User } from './domain';

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

export const getCapitalizedUserName: (args: {
  userId: string;
}) => ReaderTaskEither<
  User.Repository.Access,
  User.Repository.UserNotFoundError,
  string
> = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                          DO NOTATION - APS                                //
///////////////////////////////////////////////////////////////////////////////

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

export const getConcatenationOfTheTwoUserNames: (args: {
  userIdOne: string;
  userIdTwo: string;
}) => ReaderTaskEither<
  User.Repository.Access,
  User.Repository.UserNotFoundError,
  string
> = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                          DO NOTATION - BIND                               //
///////////////////////////////////////////////////////////////////////////////

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
> = unimplemented;

// Most of the time, you will need to use several external services.
// The challenge of this usecase is to use TimeService in the context of our `rte`
type Dependencies = User.Repository.Access & Application.TimeService.Access;

export const getConcatenationOfUserNameAndCurrentYear: (args: {
  userIdOne: string;
}) => ReaderTaskEither<
  Dependencies,
  User.Repository.UserNotFoundError,
  string
> = unimplemented;
