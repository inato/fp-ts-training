import { reader } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';
import { User } from '../User';
import { InMemoryUserRepository } from './InMemoryUserRepository';

export interface UserRepositoryAccess {
  userRepository: InMemoryUserRepository;
}

export const getById = (
  userId: string,
): ReaderTaskEither<UserRepositoryAccess, UserNotFoundError, User> =>
  pipe(
    reader.ask<UserRepositoryAccess>(),
    reader.map(({ userRepository }) => userRepository.getById(userId)),
  );

export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
  }
}
