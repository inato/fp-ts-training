import { reader } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { Reader } from 'fp-ts/lib/Reader';

export const unimplemented = () => undefined as any;
export const unimplementedAsync = () => () => undefined as any;

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getReaderMethod =
  <Access, A extends ReadonlyArray<any>, R>(
    getMethod: (access: Access) => (...a: A) => R,
  ) =>
  (...a: A): Reader<Access, R> =>
    pipe(
      reader.ask<Access>(),
      reader.map(access => getMethod(access)(...a)),
    );
