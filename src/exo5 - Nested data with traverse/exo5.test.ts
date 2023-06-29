import { option } from 'fp-ts';
import {
  getCountryCurrencyOfOptionalCountryCode,
  getValidCountryCodeOfCountryNames,
  giveCurrencyOfCountryToUser,
  performAsyncComputationInParallel,
  performAsyncComputationInSequence,
  sequenceOptionArray,
  sequenceOptionTask,
} from './exo5.exercise';

describe('exo5', () => {
  describe('getCountryCurrencyOfOptionalCountryCode', () => {
    it('should return a Task<None> if given a None', async () => {
      const result = await getCountryCurrencyOfOptionalCountryCode(
        option.none,
      )();

      expect(result).toStrictEqual(option.none);
    });

    it('should return a Task<Option> with the currency if given a Some', async () => {
      const result = await getCountryCurrencyOfOptionalCountryCode(
        option.some('FR'),
      )();

      expect(result).toStrictEqual(option.some('EUR'));
    });
  });
  describe('giveCurrencyOfCountryToUser', () => {
    it('should return Some<EUR> if provided string is "France"', async () => {
      const result = await giveCurrencyOfCountryToUser('France')();

      expect(result).toStrictEqual(option.some('EUR'));
    });

    it('should return Some<DOLLAR> if provided string is "USA"', async () => {
      const result = await giveCurrencyOfCountryToUser('USA')();

      expect(result).toStrictEqual(option.some('DOLLAR'));
    });

    it('should return None if provided string is "Germany"', async () => {
      const result = await giveCurrencyOfCountryToUser('Germany')();

      expect(result).toStrictEqual(option.none);
    });
  });

  describe('getValidCountryCodeOfCountryNames', () => {
    it('should return a Some of the country codes if all the country names are valid', () => {
      const result = getValidCountryCodeOfCountryNames(['France', 'Spain']);

      expect(result).toStrictEqual(option.some(['FR', 'SP']));
    });

    it('should return a None if any of the country names is not valid', () => {
      const result = getValidCountryCodeOfCountryNames(['France', 'Germany']);

      expect(result).toStrictEqual(option.none);
    });
  });

  describe('performAsyncComputationInParallel', () => {
    it('should return the same value for each element with the same value', async () => {
      const result = await performAsyncComputationInParallel([1, 1, 1])();

      expect(result).toStrictEqual([1, 1, 1]);
    });
  });
  describe('performAsyncComputationInSequence', () => {
    it('should return an increasing value for each element with the same value', async () => {
      const result = await performAsyncComputationInSequence([1, 1, 1])();

      expect(result).toStrictEqual([1, 2, 3]);
    });
  });
  describe('sequenceOptionTask', () => {
    it('should return a None if called with a None', async () => {
      const result = await sequenceOptionTask(option.none)();
      expect(result).toStrictEqual(option.none);
    });
    it('should return a Some if called with a Some', async () => {
      const result = await sequenceOptionTask(option.some(async () => 'EUR'))();
      expect(result).toStrictEqual(option.some('EUR'));
    });
  });
  describe('sequenceOptionArray', () => {
    it('should return a None if one of the option in the array is None', () => {
      const result = sequenceOptionArray([option.none, option.some('FR')]);
      expect(result).toStrictEqual(option.none);
    });
    it('should return a Some if all the options in the arrat are Some', () => {
      const result = sequenceOptionArray([
        option.some('FR'),
        option.some('SP'),
      ]);
      expect(result).toStrictEqual(option.some(['FR', 'SP']));
    });
  });
});
