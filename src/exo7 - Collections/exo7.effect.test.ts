import { HashSet, HashMap } from 'effect';
import { isTestingSolution } from '../testUtils';
import * as exercise from './exo7.effect.exercise';
import * as solution from './exo7.effect.solution';

const {
  allPageViews,
  intersectionPageViews,
  mapWithConcatenatedEntries,
  mapWithLastEntry,
  nonPrimeOdds,
  numberArray,
  numberArrayFromSet,
  numberSet,
  primeOdds,
} = isTestingSolution() ? solution : exercise;

describe('exo7 Effect', () => {
  describe('numberSet', () => {
    it('should be the set of unique values from `numberArray`', () => {
      // Convert the HashSet back to a JavaScript Set for comparison
      const jsSet = new Set(HashSet.toValues(numberSet));
      expect(jsSet).toStrictEqual(new Set(numberArray));
    });
  });

  describe('numberArrayFromSet', () => {
    it('should be the array of unique values from `numberArray`', () => {
      expect(numberArrayFromSet).toStrictEqual(
        [...new Set(numberArray)].sort((a, b) => a - b),
      );
    });
  });

  describe('mapWithLastEntry', () => {
    it('should construct the map from `associativeArray` keeping only the last entry for colliding keys', () => {
      // Convert the HashMap to a JavaScript Map for comparison
      const jsMap = new Map(HashMap.toEntries(mapWithLastEntry));
      expect(jsMap).toStrictEqual(
        new Map([
          [1, 'Alice'],
          [3, 'Clara'],
          [4, 'Denise'],
          [2, 'Robert'],
        ]),
      );
    });
  });

  describe('mapWithConcatenatedEntries', () => {
    it('should construct the map from `associativeArray` concatenating values for colliding keys', () => {
      // Convert the HashMap to a JavaScript Map for comparison
      const jsMap = new Map(HashMap.toEntries(mapWithConcatenatedEntries));
      expect(jsMap).toStrictEqual(
        new Map([
          [1, 'Alice'],
          [3, 'Clara'],
          [4, 'Denise'],
          [2, 'BobRobert'],
        ]),
      );
    });
  });

  describe('nonPrimeOdds', () => {
    it('should contain only the odd numbers that are not prime', () => {
      // Convert the HashSet back to a JavaScript Set for comparison
      const jsSet = new Set(HashSet.toValues(nonPrimeOdds));
      expect(jsSet).toStrictEqual(new Set([1, 9]));
    });
  });

  describe('primeOdds', () => {
    it('should contain only the odd numbers that are also prime', () => {
      // Convert the HashSet back to a JavaScript Set for comparison
      const jsSet = new Set(HashSet.toValues(primeOdds));
      expect(jsSet).toStrictEqual(new Set([3, 5, 7]));
    });
  });

  describe('allPageViews', () => {
    it('should contain the map of aggregated page views from both sources of analytics', () => {
      // Convert the HashMap to a JavaScript Map for comparison
      const jsMap = new Map(HashMap.toEntries(allPageViews));
      expect(jsMap).toStrictEqual(
        new Map([
          ['home', { page: 'home', views: 15 }],
          ['about', { page: 'about', views: 2 }],
          ['blog', { page: 'blog', views: 42 }],
          ['faq', { page: 'faq', views: 5 }],
        ]),
      );
    });
  });

  describe('intersectionPageViews', () => {
    it('should contain the map of intersecting page views from both sources of analytics', () => {
      // Convert the HashMap to a JavaScript Map for comparison
      const jsMap = new Map(HashMap.toEntries(intersectionPageViews));
      expect(jsMap).toStrictEqual(
        new Map([
          ['home', { page: 'home', views: 15 }],
          ['blog', { page: 'blog', views: 42 }],
        ]),
      );
    });
  });
}); 