import { Option, Effect } from 'effect';
import * as exercise from './exo5.effect.exercise';

const {
  getCountryCurrencyOfOptionalCountryCode,
  getValidCountryCodeOfCountryNames,
  giveCurrencyOfCountryToUser,
  performAsyncComputationInParallel,
  performAsyncComputationInSequence,
  sequenceOptionTask,
  sequenceOptionArray,
} = exercise;

describe('exo5.effect', () => {
  describe('getCountryCurrencyOfOptionalCountryCode', () => {
    it('should return an Effect<None> if given a None', async () => {
      const result = await Effect.runPromise(
        getCountryCurrencyOfOptionalCountryCode(Option.none())
      );

      expect(result).toStrictEqual(Option.none());
    });

    it('should return an Effect<Option> with the currency if given a Some', async () => {
      const result = await Effect.runPromise(
        getCountryCurrencyOfOptionalCountryCode(Option.some('FR'))
      );

      expect(result).toStrictEqual(Option.some('EUR'));
    });
  });
  
  describe('giveCurrencyOfCountryToUser', () => {
    it('should return Some<EUR> if provided string is "France"', async () => {
      const result = await Effect.runPromise(giveCurrencyOfCountryToUser('France'));

      expect(result).toStrictEqual(Option.some('EUR'));
    });

    it('should return Some<DOLLAR> if provided string is "USA"', async () => {
      const result = await Effect.runPromise(giveCurrencyOfCountryToUser('USA'));

      expect(result).toStrictEqual(Option.some('DOLLAR'));
    });

    it('should return None if provided string is "Germany"', async () => {
      const result = await Effect.runPromise(giveCurrencyOfCountryToUser('Germany'));

      expect(result).toStrictEqual(Option.none());
    });
  });

  describe('getValidCountryCodeOfCountryNames', () => {
    it('should return a Some of the country codes if all the country names are valid', () => {
      const result = getValidCountryCodeOfCountryNames(['France', 'Spain']);

      expect(result).toStrictEqual(Option.some(['FR', 'SP']));
    });

    it('should return a None if any of the country names is not valid', () => {
      const result = getValidCountryCodeOfCountryNames(['France', 'Germany']);

      expect(result).toStrictEqual(Option.none());
    });
  });

  describe('performAsyncComputationInParallel', () => {
    it('should return the same value for each element with the same value', async () => {
      const result = await Effect.runPromise(performAsyncComputationInParallel([1, 1, 1]));

      expect(result).toStrictEqual([1, 1, 1]);
    });
  });
  
  describe('performAsyncComputationInSequence', () => {
    it('should return an increasing value for each element with the same value', async () => {
      const result = await Effect.runPromise(performAsyncComputationInSequence([1, 1, 1]));

      expect(result).toStrictEqual([1, 2, 3]);
    });
  });
  
  describe('sequenceOptionTask', () => {
    it('should return a None if called with a None', async () => {
      const result = await Effect.runPromise(sequenceOptionTask(Option.none()));
      expect(result).toStrictEqual(Option.none());
    });
    
    it('should return a Some if called with a Some', async () => {
      const result = await Effect.runPromise(
        sequenceOptionTask(Option.some(Effect.succeed('EUR')))
      );
      expect(result).toStrictEqual(Option.some('EUR'));
    });
  });
  
  describe('sequenceOptionArray', () => {
    it('should return a None if one of the option in the array is None', () => {
      const result = sequenceOptionArray([Option.none(), Option.some('FR')]);
      expect(result).toStrictEqual(Option.none());
    });
    
    it('should return a Some if all the options in the array are Some', () => {
      const result = sequenceOptionArray([
        Option.some('FR'),
        Option.some('SP'),
      ]);
      expect(result).toStrictEqual(Option.some(['FR', 'SP']));
    });
  });
}); 