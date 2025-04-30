// Effect training Exercise 3
// Sort things out with `Ord`

import { Option, Array, Order } from 'effect';

// Have you ever looked at the methods provided by Effect's `Array` module? 
// They expose a load of functions to manipulate collections.
//
// Some of those you likely are already familiar with, like `map` or `filter`.
// The difference with JavaScript's native `Array.prototype` methods is that
// these are more functional programming friendly.
//
// In the following exercise, we will take a look at `Array.sort`. Contrary to
// its JavaScript counterpart, Effect's sort takes as an argument something of
// type `Order<T>` where `T` is the type of elements contained in the collection.
//
// You can think of `Order<T>` as "something which describes how to order `T`s".

///////////////////////////////////////////////////////////////////////////////
//                          SORT PRIMITIVE TYPES                             //
///////////////////////////////////////////////////////////////////////////////

// The next two functions only take an array of values of a primitive JS type
// like `string` or `number` and return a new array with those values but
// sorted.
//
// Obviously, we want to call `Array.sort` (the Effect version! no cheating). 
// But, contrary to `Array.prototype.sort` which takes an ordering function, 
// this sort will only accept an `Order<T>`.
//
// HINT: The primitive type modules from Effect (`Number`, `String`...)
// expose some pre-constructed instances of `Order<T>` for said primitives such as
// `Order.string: Order<string>` or `Order.number: Order<number>`.

export const sortStrings = Array.sort(Order.string);

export const sortNumbers = Array.sort(Order.number);

///////////////////////////////////////////////////////////////////////////////
//                                REVERSE SORT                               //
///////////////////////////////////////////////////////////////////////////////

// This next function will sort an array of numbers but in descending order
// (which unfortunately is the reverse ordering from the one provided by
// `Number.Order`).
//
// Sure, we could just use `sortNumbers` defined earlier and then reverse the
// whole array but that would be horribly inefficient, wouldn't it?
//
// HINT: Any ordering can be reversed with `Order.reverse`.

export const sortNumbersDescending = (numbers: ReadonlyArray<number>): ReadonlyArray<number> => 
  Array.sort(numbers, Order.reverse(Order.number));

///////////////////////////////////////////////////////////////////////////////
//                            SORT OPTIONAL VALUES                           //
///////////////////////////////////////////////////////////////////////////////

// This next function will sort an array of numbers wrapped in `Option` with
// the following constraint: `Option.none()` < `Option.some(_)`.
//
// As such, we cannot simply use `Number.Order` because it has type `Order<number>`
// and we need an instance of `Order<Option<number>>`.
//
// HINT: Some of Effect wrapper types such as `Option` do already have a way
// of building an `Order` instance for their qualified inner type. You may want
// to take a look at `Option.getOrder`.

export const sortOptionalNumbers = (
  optionalNumbers: ReadonlyArray<Option.Option<number>>
): ReadonlyArray<Option.Option<number>> => 
  Array.sort(optionalNumbers, Option.getOrder(Order.number));

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
// HINT: You can build an instance of `Order` specialized for a field for a
// record with many fields by declaring how to access that field and which
// primitive `Order` instance to use. This can be achieved with `Order.mapInput`.

export interface Person {
  readonly name: string;
  readonly age: Option.Option<number>;
}

const byName = Order.mapInput(Order.string, (person: Person) => person.name);

export const sortPersonsByName = (persons: ReadonlyArray<Person>): ReadonlyArray<Person> => 
  Array.sort(persons, byName);

const byAge = Order.mapInput(
  Option.getOrder(Order.number),
  (person: Person) => person.age
);

export const sortPersonsByAge = (persons: ReadonlyArray<Person>): ReadonlyArray<Person> => 
  Array.sort(persons, byAge);

///////////////////////////////////////////////////////////////////////////////
//                          COMBINE SORTING SCHEMES                          //
///////////////////////////////////////////////////////////////////////////////

// Now, we want to sort the array first by age, but for people of the same age,
// we want to sort them by name.
//
// HINT: Take a look at `Order.combine` to combine multiple orders

export const sortPersonsByAgeThenByName = (persons: ReadonlyArray<Person>): ReadonlyArray<Person> => 
  Array.sort(persons, Order.combine(byAge, byName)); 