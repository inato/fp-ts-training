// `fp-ts` training Exercise 7
// Manipulate collections with type-classes

import { unimplemented } from '../utils';

// In this exercise, we will learn how to manipulate essential collections
// such as `Set` and `Map`.
//
// These collections have very important properties that make them slightly
// more complex than the venerable `Array`:
// - `Set` requires each element to be unique
// - `Map` associates unique keys to values
//
// In fact, it can sometimes be helpful to think of `Set` as a special case
// of `Map` where `Set<T>` is strictly equivalent to `Map<T, void>`.
//
// To manipulate these collections, we often need to inform `fp-ts` on
// how to uphold the properties outlined above (e.g. how to determine whether
// two elements or keys have the same value, how to combine values together
// in case of key collision or how to order the values when converting back
// to an array).
//
// And the way to describe those properties for the specific inner types of a
// given `Set` or `Map` is... TYPECLASSES!

///////////////////////////////////////////////////////////////////////////////
//                                    SET                                    //
///////////////////////////////////////////////////////////////////////////////

// A `Set` is pretty straightforward, it stores values but doesn't care at all
// about the ordering of those values. Furthermore, it ignores duplicates.

export const numberArray: ReadonlyArray<number> = [7, 42, 1337, 1, 0, 1337, 42];

// Construct `numberSet` from the provided `numberArray`.
// You need to use the `ReadonlySet` module from `fp-ts` instead of the
// JavaScript standard constructor.
//
// HINTS:
// - You can look into `readonlySet.fromReadonlyArray`
// - `fp-ts` doesn't know how you want to define equality for the inner type
//   and requires you to provide an `Eq` instance

export const numberSet: ReadonlySet<number> = unimplemented();

// Convert `numberSet` back to an array in `numberArrayFromSet`.
// You need to use the `ReadonlySet` module from `fp-ts` instead of the
// JavaScript standard constructor.
//
// HINTS:
// - You can look into `readonlySet.toReadonlyArray`
// - The elements in `numberSet` have no guarantees whatsoever regarding
//   their ordering. This ordering could be totally random. But remember that
//   functional programming is all about purity. Converting a set to an array
//   is a pure operation and as such, should return the same value for the
//   same input. This means you **need** to instruct `fp-ts` on how you wish
//   the values to be ordered in the output array, by providing an `Ord`
//   instance.

export const numberArrayFromSet: ReadonlyArray<number> = unimplemented();

///////////////////////////////////////////////////////////////////////////////
//                                    MAP                                    //
///////////////////////////////////////////////////////////////////////////////

// A `Map` associates a set of unique keys to arbitrary values. Values
// themselves can be duplicated across various keys but keys have to be unique.
//
// This means than when constructing a `Map` from an `Array`, you need to be
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
// You need to use the `ReadonlyMap` module from `fp-ts` instead of the
// JavaScript standard constructor.
//
// The resulting `Map` should have the following shape:
// 1 => 'Alice'
// 2 => 'Robert'
// 3 => 'Clara'
// 4 => 'Denise'
//
// HINTS:
// - You can look into `readonlyMap.fromFoldable`
// - You need to provide an `Eq` instance for the key type
// - You need to provide a `Magma` instance for the value type. In this case,
//   the `Magma` instance should ignore the first value and return the second.
//   (You can define your own, or look into the `Magma` or `Semigroup` module)
// - You need to provide the `Foldable` instance for the input container type.
//   Just know that you can construct a `Map` from other types than `Array` as
//   long as they implement `Foldable`. Here, you can simply pass the standard
//   `readonlyArray.Foldable` instance.

export const mapWithLastEntry: ReadonlyMap<number, string> = unimplemented();

// Same thing as above, except that upon key collision we don't want to simply
// select the newest entry value but append it to the previous one.
//
// Basically, the resulting `Map` here should have the following shape:
// 1 => 'Alice'
// 2 => 'BobRobert'
// 3 => 'Clara'
// 4 => 'Denise'
//
// HINT:
// - You can look into the `Semigroup` typeclass as it is a super-class of
//   `Magma`, meaning that a `Semigroup<A>` is also necessarily a `Magma<A>`.
//   The `string` module may contain what you need ;)
//
// Bonus point:
// Did you find something in the `Semigroup` module that may have been
// helpful in defining `mapWithLastEntry`?

export const mapWithConcatenatedEntries: ReadonlyMap<number, string> =
  unimplemented();

///////////////////////////////////////////////////////////////////////////////
//                     DIFFERENCE / UNION / INTERSECTION                     //
///////////////////////////////////////////////////////////////////////////////

export const primes = new Set([2, 3, 5, 7]);
export const odds = new Set([1, 3, 5, 7, 9]);

// Construct the set `nonPrimeOdds` from the two sets defined above. It should
// only include the odd numbers that are not prime.
//
// HINT:
// - Be mindful of the order of operands for the operator you will choose.

export const nonPrimeOdds: ReadonlySet<number> = unimplemented();

// Construct the set `primeOdds` from the two sets defined above. It should
// only include the odd numbers that are also prime.

export const primeOdds: ReadonlySet<number> = unimplemented();

///////////////////////////////////////////////////////////////////////////////

export type Analytics = {
  page: string;
  views: number;
};

// These example Maps are voluntarily written in a non fp-ts way to not give
// away too much obviously ;)
//
// As an exercise for the reader, they may rewrite those with what they've
// learned earlier.

export const pageViewsA = new Map(
  [
    { page: 'home', views: 5 },
    { page: 'about', views: 2 },
    { page: 'blog', views: 7 },
  ].map(entry => [entry.page, entry]),
);

export const pageViewsB = new Map(
  [
    { page: 'home', views: 10 },
    { page: 'blog', views: 35 },
    { page: 'faq', views: 5 },
  ].map(entry => [entry.page, entry]),
);

// Construct the `Map` with the total page views for all the pages in both sources
// of analytics `pageViewsA` and `pageViewsB`.
//
// In case a page appears in both sources, their view count should be summed.

export const allPageViews: ReadonlyMap<string, Analytics> = unimplemented();

// Construct the `Map` with the total page views but only for the pages that
// appear in both sources of analytics `pageViewsA` and `pageViewsB`.

export const intersectionPageViews: ReadonlyMap<string, Analytics> =
  unimplemented();
