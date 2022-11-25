import {
  allPageViews,
  intersectionPageViews,
  mapWithConcatenatedEntries,
  mapWithLastEntry,
  nonPrimeOdds,
  numberArray,
  numberArrayFromSet,
  numberSet,
  primeOdds,
} from './exo7';

describe('exo7', () => {
  describe('numberSet', () => {
    it('should be the set of unique values from `numberArray`', () => {
      expect(numberSet).toStrictEqual(new Set(numberArray));
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
      expect(mapWithLastEntry).toStrictEqual(
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
      expect(mapWithConcatenatedEntries).toStrictEqual(
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
      expect(nonPrimeOdds).toStrictEqual(new Set([1, 9]));
    });
  });

  describe('primeOdds', () => {
    it('should contain only the odd numbers that are also prime', () => {
      expect(primeOdds).toStrictEqual(new Set([3, 5, 7]));
    });
  });

  describe('allPageViews', () => {
    it('should contain the map of aggregated page views from both sources of analytics', () => {
      expect(allPageViews).toStrictEqual(
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
      expect(intersectionPageViews).toStrictEqual(
        new Map([
          ['home', { page: 'home', views: 15 }],
          ['blog', { page: 'blog', views: 42 }],
        ]),
      );
    });
  });
});
