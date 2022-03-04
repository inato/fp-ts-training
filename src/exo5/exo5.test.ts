import { option } from 'fp-ts';
import {
  getValidCountryCodeOfCountryNames,
  giveCurrencyOfCountryToUser,
} from './exo5';

describe('exo5', () => {
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
});
