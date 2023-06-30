import { either, reader, readerTaskEither as rte } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import * as exercise from './exo8.exercise';
import * as solution from './exo8.solution';
import { isTestingSolution } from '../testUtils';

const {
  apSEitherK: rteApSEitherK,
  apSEitherKW: rteApSEitherKW,
  bindEitherK: rteBindEitherK,
  bindEitherKW: rteBindEitherKW,
  bindReaderK: rteBindReaderK,
  bindReaderKW: rteBindReaderKW,
} = isTestingSolution() ? solution : exercise;

describe('exo8', () => {
  describe('bindEitherK[W]', () => {
    it('should be usable in a happy path do-notation rte pipeline', async () => {
      const pipeline = await pipe(
        rte.Do,
        rte.apS('foo', rte.of(42)),
        rteBindEitherK('bar', ({ foo }) => either.right(foo * 2)),
      )({})();

      const expected = await rte.of({ foo: 42, bar: 84 })({})();

      expect(pipeline).toStrictEqual(expected);
    });

    it('should be usable in a failing do-notation rte pipeline', async () => {
      const pipeline = await pipe(
        rte.Do,
        rte.apS('foo', rte.of<unknown, string, number>(42)),
        rteBindEitherK('bar', ({ foo }) => either.right(foo * 2)),
        rteBindEitherK('baz', ({ foo, bar }) =>
          either.left(`Error: foo = ${foo}, bar = ${bar}`),
        ),
      )({})();

      const expected = await rte.left('Error: foo = 42, bar = 84')({})();

      expect(pipeline).toStrictEqual(expected);
    });

    it('should widen the error type when using the `W` variant', async () => {
      const pipeline = await pipe(
        rte.Do,
        rte.apS('foo', rte.of<unknown, string, number>(42)),
        rteBindEitherK('bar', ({ foo }) => either.right(foo * 2)),
        rteBindEitherKW('baz', ({ foo, bar }) => either.left(foo + bar)),
      )({})();

      const expected = await rte.left(126)({})();

      expect(pipeline).toStrictEqual(expected);
    });
  });

  describe('apSEitherK[W]', () => {
    it('should be usable in a happy path do-notation rte pipeline', async () => {
      const pipeline = await pipe(
        rte.Do,
        rte.apS('foo', rte.of(42)),
        rteApSEitherK('bar', either.right(1337)),
      )({})();

      const expected = await rte.of({ foo: 42, bar: 1337 })({})();

      expect(pipeline).toStrictEqual(expected);
    });

    it('should be usable in a failing do-notation rte pipeline', async () => {
      const pipeline = await pipe(
        rte.Do,
        rte.apS('foo', rte.of<unknown, string, number>(42)),
        rteApSEitherK('bar', either.right(1337)),
        rteApSEitherK('baz', either.left(`Error!`)),
      )({})();

      const expected = await rte.left('Error!')({})();

      expect(pipeline).toStrictEqual(expected);
    });

    it('should widen the error type when using the `W` variant', async () => {
      const pipeline = await pipe(
        rte.Do,
        rte.apS('foo', rte.of<unknown, string, number>(42)),
        rteApSEitherK('bar', either.right(1337)),
        rteApSEitherKW('baz', either.left(0)),
      )({})();

      const expected = await rte.left(0)({})();

      expect(pipeline).toStrictEqual(expected);
    });
  });

  describe('bindReaderK[W]', () => {
    it('should be usable in a do-notation rte pipeline', async () => {
      const pipeline = await pipe(
        rte.Do,
        rte.apS('foo', rte.of(42)),
        rteBindReaderK('bar', ({ foo }) => reader.of(`${foo}`)),
      )({})();

      const expected = await rte.of({ foo: 42, bar: '42' })({})();

      expect(pipeline).toStrictEqual(expected);
    });

    it('should widen the error type when using the `W` variant', async () => {
      const pipeline = await pipe(
        rte.Do,
        rte.apS('foo', rte.of<{ a: string }, string, number>(42)),
        rteBindReaderKW('bar', ({ foo }) =>
          reader.of<{ b: number }, string>(`${foo}`),
        ),
      )({ a: '', b: 0 })();

      const expected = await rte.of({ foo: 42, bar: '42' })({})();

      expect(pipeline).toStrictEqual(expected);
    });
  });
});
