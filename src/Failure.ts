import * as decod from 'decod';
import { either, task } from 'fp-ts';

const decodeErrorMessage = decod.at('message', decod.string);

export enum FailureType {
  Unexpected = 'FailureType_Unexpected',
}

export type UnexpectedFailure = Failure<FailureType.Unexpected>;

export class Failure<T extends string = FailureType> {
  constructor({
    reason,
    type,
    originalError,
  }: {
    reason: string;
    type: T;
    originalError?: Error | unknown;
  }) {
    this.reason = reason;
    this.type = type;
    if (originalError instanceof Error) {
      this.originalError = originalError;
    }
  }

  reason: string;

  type: T;

  originalError?: Error;

  toError(): Error {
    if (this.originalError) return this.originalError;
    return new Error(this.reason);
  }

  static builder<T extends string>(type: T) {
    return (reason: string, originalError?: Error | unknown) =>
      new Failure<T>({
        reason,
        type,
        originalError,
      });
  }

  static unexpected = Failure.builder(FailureType.Unexpected);

  static fromUnknownError(originalError: unknown | Error): UnexpectedFailure {
    return Failure.unexpected(decodeErrorMessage(originalError), originalError);
  }

  static toType<T extends string>(type: T): (failure: Failure) => Failure<T> {
    return (failure: Failure) =>
      new Failure({
        reason: failure.reason,
        type,
        originalError: failure.originalError,
      });
  }

  static toUnexpected = Failure.toType(FailureType.Unexpected);

  private static throw = (failure: Failure) => {
    throw failure.toError();
  };

  static eitherUnsafeGet = either.getOrElseW(Failure.throw);

  static taskEitherUnsafeGet = task.map(this.eitherUnsafeGet);
}

export type FailureTypes<F extends Record<string, string>> = F[keyof F];
export interface FailureTypings<F extends Record<string, string>> {
  types: FailureTypes<F>;
  failure: Failure<FailureTypes<F>>;
}
