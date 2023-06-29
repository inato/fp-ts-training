// `fp-ts` training Exercise 3
// Sort things out with `Ord`

import { Option } from 'fp-ts/Option';
import { unimplemented } from '../utils';

// Have you ever looked at the methods provided by `fp-ts` own `Array` and
// `ReadonlyArray` modules? They expose a load of functions to manipulate
// those collections.
//
// Some of those you likely are already familiar with, like `map` or `filter`.
// The difference with JavaScript's native `Array.prototype` methods is that
// these are more `fp-ts` friendly.
//
// In the following exercise, we will take a look at `array.sort`. Contrary to
// its JavaScript counterpart, `fp-ts` sort takes as an argument something of
// type `Ord<T>` where `T` is the type of elements contained in the collection.
//
// You can think as `Ord<T>` as "something which describes how to order `T`s".

///////////////////////////////////////////////////////////////////////////////
//                          SORT PRIMITIVE TYPES                             //
///////////////////////////////////////////////////////////////////////////////

// The next two functions only take an array of values of a primitive JS type
// like `string` or `number` and return a new array with those values but
// sorted.
//
// Obviously, we want to call `readonlyArray.sort` (the `fp-ts` version! no
// cheating). But, contrary to `ReadonlyArray.prototype.sort` which takes an
// ordering function, this sort will only accept an `Ord<T>`.
//
// HINT: The primitive type modules from `fp-ts` (`number`, `string`...)
// expose some pre constructed instances of `Ord<T>` for said primitives such as
// `string.Ord: Ord<string>` or `number.Ord: Ord<number>`.

export const sortStrings: (
  strings: ReadonlyArray<string>,
) => ReadonlyArray<string> = unimplemented;

export const sortNumbers: (
  numbers: ReadonlyArray<number>,
) => ReadonlyArray<number> = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                                REVERSE SORT                               //
///////////////////////////////////////////////////////////////////////////////

// This next function will sort an array of numbers but in descending order
// (which unfortunately is the reverse ordering from the one provided by
// `number.Ord`).
//
// Sure, we could just use `sortNumbers` defined earlier and then reverse the
// whole array but that would be horribly inefficient, wouldn't it?
//
// HINT: Any ordering can be reversed with a simple function `ord.reverse`.

export const sortNumbersDescending: (
  numbers: ReadonlyArray<number>,
) => ReadonlyArray<number> = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                            SORT OPTIONAL VALUES                           //
///////////////////////////////////////////////////////////////////////////////

// This next function will sort an array of numbers wrapped in `Option` with
// the following constraint: `option.none` < `option.some(_)`.
//
// As such, we cannot simply use `number.Ord` because it has type `Ord<number>`
// and we need an instance of `Ord<Option<number>>`.
//
// HINT: Some of `fp-ts` wrapper types such as `Option` do already have a way
// of building an `Ord` instance for their qualified inner type. You may want
// to take a look at `option.getOrd`.

export const sortOptionalNumbers: (
  optionalNumbers: ReadonlyArray<Option<number>>,
) => ReadonlyArray<Option<number>> = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                           SORT COMPLEX OBJECTS                            //
///////////////////////////////////////////////////////////////////////////////

// Primitive types are nice and all, but sometimes you want to sort some values
// with many fields by considering only one of those fields with a more
// primitive type.
//
// In the next two functions, we start with an array of `Person`s which have a
// `name` and may have an `age`. One function will sort our array by alphabetic
// ordering of the person's names, and the other will sort it by the person's
// ages.
//
// HINT: You can build an instance of `Ord` specialized for a field for a
// record with many fields by declaring how to access that field and which
// primitive `Ord` instance to use. This can be achieved with `ord.contramap`.

export interface Person {
  readonly name: string;
  readonly age: Option<number>;
}

export const sortPersonsByName: (
  persons: ReadonlyArray<Person>,
) => ReadonlyArray<Person> = unimplemented;

export const sortPersonsByAge: (
  persons: ReadonlyArray<Person>,
) => ReadonlyArray<Person> = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                          COMBINE SORTING SCHEMES                          //
///////////////////////////////////////////////////////////////////////////////

// Now, we want to sort the array first by age, but for people of the same age,
// we want to sort them by name.
//
// HINT: Take a look at `readonlyArray.sortBy`

export const sortPersonsByAgeThenByName: (
  persons: ReadonlyArray<Person>,
) => ReadonlyArray<Person> = unimplemented;
