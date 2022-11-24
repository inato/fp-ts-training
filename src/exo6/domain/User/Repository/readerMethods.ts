import { reader } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { ReaderTaskEither } from 'fp-ts/ReaderTaskEither';
import { User } from '../User';
import { InMemoryUserRepository } from './InMemoryUserRepository';

export interface Access {
  userRepository: InMemoryUserRepository;
}

export const getById = (
  userId: string,
): ReaderTaskEither<Access, UserNotFoundError, User> =>
  pipe(
    reader.ask<Access>(),
    reader.map(({ userRepository }) => userRepository.getById(userId)),
  );

export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
  }
}
