import { Effect, Context } from 'effect';
import { User } from '../../User';

export class UserNotFoundError extends Error {
  readonly _tag = 'UserNotFoundError';
  constructor() {
    super('User not found');
  }
}

export interface UserRepository {
  getById: (userId: string) => Effect.Effect<User, UserNotFoundError>;
}

export class UserRepositoryService extends Context.Tag('UserRepositoryService')<
  UserRepositoryService,
  UserRepository
>() {}

export const getById = (userId: string): Effect.Effect<User, UserNotFoundError, UserRepositoryService> =>
  Effect.flatMap(UserRepositoryService, (repo) => repo.getById(userId)); 