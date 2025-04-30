import { Effect } from 'effect';
import { User } from '../../User';
import { UserNotFoundError, UserRepository } from './UserRepository';

export class InMemoryUserRepository implements UserRepository {
  protected aggregates: Map<string, User>;

  constructor(aggregates: User[]) {
    this.aggregates = new Map(aggregates.map(user => [user.id, user]));
  }

  getById(userId: string): Effect.Effect<User, UserNotFoundError> {
    const user = this.aggregates.get(userId);
    if (user === undefined) {
      return Effect.fail(new UserNotFoundError());
    }
    return Effect.succeed(user);
  }
} 