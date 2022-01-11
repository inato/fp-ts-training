import { option } from 'fp-ts';
import {
  sortStrings,
  sortNumbers,
  sortNumbersDescending,
  sortOptionalNumbers,
  sortPersonsByName,
  sortPersonsByAge,
  sortPersonsByAgeThenByName,
} from './exo3';

describe('exo3', () => {
  describe('sortStrings', () => {
    it('should return an alphabetically sorted array of strings', () => {
      const strings = ['xyz', 'aba', 'ori', 'aab', 'ghl'];

      const result = sortStrings(strings);
      const expected = ['aab', 'aba', 'ghl', 'ori', 'xyz'];

      expect(result).toStrictEqual(expected);
    });
  });

  describe('sortNumbers', () => {
    it('should return a sorted array of numbers', () => {
      const numbers = [1337, 42, 5701];

      const result = sortNumbers(numbers);
      const expected = [42, 1337, 5701];

      expect(result).toStrictEqual(expected);
    });
  });

  describe('sortNumbersDescending', () => {
    it('should return a sorted array of descending numbers', () => {
      const numbers = [1337, 42, 5701];

      const result = sortNumbersDescending(numbers);
      const expected = [5701, 1337, 42];

      expect(result).toStrictEqual(expected);
    });
  });

  describe('sortOptionalNumbers', () => {
    it('should return a sorted array of optional numbers', () => {
      const optionalNumbers = [option.some(1337), option.none, option.some(42)];

      const result = sortOptionalNumbers(optionalNumbers);
      const expected = [option.none, option.some(42), option.some(1337)];

      expect(result).toStrictEqual(expected);
    });
  });

  describe('sortPersonsByName', () => {
    it('should return an array of persons alphabetically sorted by their name', () => {
      const alice = { name: 'Alice', age: option.none };
      const bob = { name: 'Bob', age: option.none };
      const crystal = { name: 'Crystal', age: option.none };

      const persons = [crystal, alice, bob];

      const result = sortPersonsByName(persons);
      const expected = [alice, bob, crystal];

      expect(result).toStrictEqual(expected);
    });
  });

  describe('sortPersonsByName', () => {
    it('should return an array of persons sorted by their age', () => {
      const alice = { name: 'Alice', age: option.some(42) };
      const bob = { name: 'Bob', age: option.none };
      const crystal = { name: 'Crystal', age: option.some(29) };

      const persons = [crystal, alice, bob];

      const result = sortPersonsByAge(persons);
      const expected = [bob, crystal, alice];

      expect(result).toStrictEqual(expected);
    });
  });

  describe('sortPersonsByName', () => {
    it('should return an array of persons sorted first by age and then by name', () => {
      const alice = { name: 'Alice', age: option.some(42) };
      const bob = { name: 'Bob', age: option.none };
      const crystal = { name: 'Crystal', age: option.some(29) };
      const dorian = { name: 'Dorian', age: option.some(29) };
      const edgar = { name: 'Edgar', age: option.none };

      const persons = [dorian, alice, edgar, bob, crystal];

      const result = sortPersonsByAgeThenByName(persons);
      const expected = [bob, edgar, crystal, dorian, alice];

      expect(result).toStrictEqual(expected);
    });
  });
});
