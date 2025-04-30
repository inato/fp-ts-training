// Effect training Exercise 7 - Solution
// Manipulate collections with type-classes

import { Number, Array, pipe, HashMap, HashSet } from 'effect';

// In this exercise, we will learn how to manipulate essential collections
// such as `HashSet` and `HashMap`.
//
// These collections have very important properties that make them slightly
// more complex than the venerable `Array`:
// - `HashSet` requires each element to be unique
// - `HashMap` associates unique keys to values
//
// In fact, it can sometimes be helpful to think of `HashSet` as a special case
// of `HashMap` where `HashSet<T>` is strictly equivalent to `HashMap<T, void>`.
//
// To manipulate these collections, we often need to inform Effect on
// how to uphold the properties outlined above (e.g. how to determine whether
// two elements or keys have the same value, how to combine values together
// in case of key collision or how to order the values when converting back
// to an array).
//
// And the way to describe those properties for the specific inner types of a
// given `HashSet` or `HashMap` is through Effect's combinators and interfaces!

///////////////////////////////////////////////////////////////////////////////
//                                  HASHSET                                  //
///////////////////////////////////////////////////////////////////////////////

// A `HashSet` is pretty straightforward, it stores values but doesn't care at all
// about the ordering of those values. Furthermore, it ignores duplicates.

export const numberArray: ReadonlyArray<number> = [7, 42, 1337, 1, 0, 1337, 42];

// Construct `numberSet` from the provided `numberArray`.
// You need to use the `HashSet` module from Effect instead of the
// JavaScript standard constructor.
//
// HINTS:
// - You can look into `HashSet.fromIterable`
// - Effect uses the `Equal` interface for value equality

export const numberSet: HashSet.HashSet<number> = HashSet.fromIterable(numberArray);

// Convert `numberSet` back to an array in `numberArrayFromSet`.
// You need to use the `HashSet` module from Effect instead of the
// JavaScript standard constructor.
//
// HINTS:
// - You can look into `HashSet.toValues`
// - The elements in `numberSet` have no guarantees whatsoever regarding
//   their ordering. This ordering could be totally random. But remember that
//   functional programming is all about purity. Converting a set to an array
//   is a pure operation and as such, should return the same value for the
//   same input.
// - You can use `Array.sort` with `Number.Order` to ensure consistent ordering

export const numberArrayFromSet: ReadonlyArray<number> = pipe(
  numberSet,
  HashSet.toValues,
  Array.sort(Number.Order)
);

///////////////////////////////////////////////////////////////////////////////
//                                  HASHMAP                                  //
///////////////////////////////////////////////////////////////////////////////

// A `HashMap` associates a set of unique keys to arbitrary values. Values
// themselves can be duplicated across various keys but keys have to be unique.
//
// This means than when constructing a `HashMap` from an `Array`, you need to be
// explicit on how you wish to combine values in case of key collision (maybe
// you want to only insert the last value provided, maybe the first, maybe you
// want to combine both values in a specific way e.g. concatenate strings, add
// numbers, etc...)

export const associativeArray: ReadonlyArray<[number, string]> = [
  [1, 'Alice'],
  [2, 'Bob'],
  [3, 'Clara'],
  [4, 'Denise'],
  [2, 'Robert'],
];

// Construct `mapWithLastEntry` from the provided `associativeArray`.
// You need to use the `HashMap` module from Effect instead of the
// JavaScript standard constructor.
//
// The resulting `HashMap` should have the following shape:
// 1 => 'Alice'
// 2 => 'Robert'
// 3 => 'Clara'
// 4 => 'Denise'
//
// HINTS:
// - Since we need to keep the last entry in case of collision, we can simply
//   iterate through the array and set each key-value pair

// Simplified solution - we can just use HashMap.fromIterable
// Effect's HashMap.fromIterable uses the last value for collisions by default
export const mapWithLastEntry: HashMap.HashMap<number, string> = HashMap.fromIterable(associativeArray);

// Same thing as above, except that upon key collision we don't want to simply
// select the newest entry value but append it to the previous one.
//
// Basically, the resulting `HashMap` here should have the following shape:
// 1 => 'Alice'
// 2 => 'BobRobert'
// 3 => 'Clara'
// 4 => 'Denise'
//
// HINT:
// - We need to check if a key exists before setting, and if it does, concatenate

export const mapWithConcatenatedEntries: HashMap.HashMap<number, string> = pipe(
  associativeArray,
  Array.reduce(
    HashMap.empty<number, string>(),
    (acc, [key, value]) => {
      const existing = HashMap.get(acc, key);
      return HashMap.set(acc, key, existing._tag === "Some" ? existing.value + value : value);
    }
  )
);

///////////////////////////////////////////////////////////////////////////////
//                     DIFFERENCE / UNION / INTERSECTION                     //
///////////////////////////////////////////////////////////////////////////////

export const primes = new Set([2, 3, 5, 7]);
export const odds = new Set([1, 3, 5, 7, 9]);

// Convert JavaScript Sets to Effect HashSets
const primesSet = HashSet.fromIterable(primes);
const oddsSet = HashSet.fromIterable(odds);

// Construct the set `nonPrimeOdds` from the two sets defined above. It should
// only include the odd numbers that are not prime.
//
// HINT:
// - Be mindful of the order of operands for the operator you will choose.
// - Look into `HashSet.difference`

export const nonPrimeOdds: HashSet.HashSet<number> = HashSet.difference(oddsSet, primesSet);

// Construct the set `primeOdds` from the two sets defined above. It should
// only include the odd numbers that are also prime.
//
// HINT:
// - Look into `HashSet.intersection`

export const primeOdds: HashSet.HashSet<number> = HashSet.intersection(oddsSet, primesSet);

///////////////////////////////////////////////////////////////////////////////

export type Analytics = {
  page: string;
  views: number;
};

// These example Maps are voluntarily written in a non-Effect way to not give
// away too much obviously ;)
//
// As an exercise for the reader, they may rewrite those with what they've
// learned earlier.

export const pageViewsA = new Map(
  [
    { page: 'home', views: 5 },
    { page: 'about', views: 2 },
    { page: 'blog', views: 7 },
  ].map(entry => [entry.page, entry])
);

export const pageViewsB = new Map(
  [
    { page: 'home', views: 10 },
    { page: 'blog', views: 35 },
    { page: 'faq', views: 5 },
  ].map(entry => [entry.page, entry])
);

// Convert JavaScript Maps to Effect HashMaps
const pageViewsAHashMap = HashMap.fromIterable<string, Analytics>(pageViewsA);
const pageViewsBHashMap = HashMap.fromIterable<string, Analytics>(pageViewsB);

// Construct the `HashMap` with the total page views for all the pages in both sources
// of analytics `pageViewsA` and `pageViewsB`.
//
// In case a page appears in both sources, their view count should be summed.
//
// HINT:
// - Using the union of keys and then building a new map

// Simplified solution - using HashMap operations more effectively
export const allPageViews: HashMap.HashMap<string, Analytics> = pipe(
  // Start with a copy of the first map
  HashMap.map(pageViewsAHashMap, (analytic) => ({ ...analytic })),
  // Then go through all entries in the second map
  (baseMap) => pipe(
    pageViewsBHashMap,
    HashMap.reduce(
      baseMap,
      (acc, value, key) => {
        const existing = HashMap.get(acc, key);
        return existing._tag === "Some"
          ? HashMap.set(acc, key, {
              page: key,
              views: existing.value.views + value.views
            })
          : HashMap.set(acc, key, value);
      }
    )
  )
);

// Construct the `HashMap` with the total page views but only for the pages that
// appear in both sources of analytics `pageViewsA` and `pageViewsB`.
//
// HINT:
// - Using the intersection of keys and then building a new map

// Simplified solution - we can filter one map based on keys in the other
export const intersectionPageViews: HashMap.HashMap<string, Analytics> = pipe(
  // Get all keys that exist in both maps
  HashSet.intersection(
    HashMap.keySet(pageViewsAHashMap),
    HashMap.keySet(pageViewsBHashMap)
  ),
  // Then build a new map with combined values for these keys
  HashSet.reduce(
    HashMap.empty<string, Analytics>(),
    (acc, key) => {
      const viewsA = HashMap.get(pageViewsAHashMap, key);
      const viewsB = HashMap.get(pageViewsBHashMap, key);
      
      if (viewsA._tag === "Some" && viewsB._tag === "Some") {
        return HashMap.set(acc, key, {
          page: key,
          views: viewsA.value.views + viewsB.value.views
        });
      }
      return acc;
    }
  )
); 