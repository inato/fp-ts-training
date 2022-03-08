// `fp-ts` training Exercise 5
// Managing nested effectful data with `traverse`

import { option, readonlyRecord, task, taskOption } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { Option } from 'fp-ts/lib/Option';
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord';
import { Task } from 'fp-ts/lib/Task';
import { sleep } from '../utils';

// When using many different Functors in a complex application, we can easily
// get to a point when we have many nested types that we would like to 'merge',
// like `Task<Option<Task<A>>>` or `Either<E,ReadonlyArray<Either<E,A>>>`
// It would be nice to have a way to 'move up' the similar types in order to
// chain them, like merging the `Task` to have a `Task<Option<A>>` or the
// `Either` to have a `Either<E,ReadonlyArray<A>>`
//
// That's precisely the concept of `traverse`. It will allow us to transform
// a `Option<Task<A>>` to a `Task<Option<A>>` so we can chain it with another
// `Task` for example, or to transform a `ReadonlyArray<Either<E,A>>` to a
// `Either<E,ReadonlyArray<A>>`

///////////////////////////////////////////////////////////////////////////////
//                                 SETUP                                     //
///////////////////////////////////////////////////////////////////////////////

// Let's consider a small range of countries (here, France, Spain and the USA)
// with a mapping from their name to their code:
type CountryCode = 'FR' | 'SP' | 'US';
export const countryNameToCountryCode: ReadonlyRecord<string, CountryCode> = {
  France: 'FR',
  Spain: 'SP',
  USA: 'US',
};

// Let's simulate the call to an api which would return the currency when
// providing a country code. For the sake of simplicity, let's consider that it
// cannot fail.
type Currency = 'EUR' | 'DOLLAR';
export const getCountryCurrency: (countryCode: CountryCode) => Task<Currency> =
  (countryCode: CountryCode): Task<Currency> =>
  async () => {
    if (countryCode === 'US') {
      return 'DOLLAR';
    }
    return 'EUR';
  };

// Let's simulate a way for the user to provide a country name.
// Let's consider that it cannot fail and let's add the possibility to set
// the user's response as a parameter for easier testing.
export const getCountryNameFromUser: (countryName: string) => Task<string> = (
  countryName: string,
) => task.of(countryName);

// Here's a function to retrieve the countryCode from a country name if it is
// matching a country we support. This method returns an `Option` as we cannot
// return anything if the given string is not matching a country name we know
export const getCountryCode: (countryName: string) => Option<CountryCode> = (
  countryName: string,
) => readonlyRecord.lookup(countryName)(countryNameToCountryCode);

///////////////////////////////////////////////////////////////////////////////
//                            TRAVERSING OPTIONS                             //
///////////////////////////////////////////////////////////////////////////////

// With all these functions, we can simulate a program that would ask for a
// country name and return its currency if it knows the country.
// A naive implementation would be mapping on each `Task` and `Option` to call
// the correct method:
export const naiveGiveCurrencyOfCountryToUser = (
  countryNameFromUserMock: string,
) =>
  pipe(
    getCountryNameFromUser(countryNameFromUserMock),
    task.map(getCountryCode),
    task.map(option.map(getCountryCurrency)),
  );
// The result type of this method is: `Task<Option<Task<Currency>>>`
// Not ideal, right? We would need to await the first `Task`, then check if it's
// `Some` to get the `Task` inside and finally await the `Task` to retrieve the
// currency.
// Let's do better than that!

// First we need a way to transform our `Option<Task<Currency>>` to
// `Task<Option<Currency>>`
// That's precisely what traverse is about.
// Use `option.traverse` to implement `getCountryCurrencyOfOptionalCountryCode`
// below. This function takes an `Option<CountryCode>`, should apply
// `getCountryCurrency` to the `CountryCode` and make it so that the result
// is `Task<Option<Currency>>`
//
// HINT: `option.traverse` asks for an Applicative as the first parameter. You
// can find it for `Task` in `task.ApplicativePar`

export const getCountryCurrencyOfOptionalCountryCode: (
  optionalCountryCode: Option<CountryCode>,
) => Task<Option<Currency>> = option.traverse(task.ApplicativePar)(
  getCountryCurrency,
);

// Let's now use this function in our naive implementation's pipe to see how it
// improves it.
// Implement `giveCurrencyOfCountryToUser` below so that it returns a
// `Task<Option<Currency>>`
//
// HINT: You should be able to copy the pipe from naiveGiveCurrencyOfCountryToUser
// and make only few updates of it. `task.chain` helper may be usefull.

export const giveCurrencyOfCountryToUser: (
  countryNameFromUserMock: string,
) => Task<Option<Currency>> = (countryNameFromUserMock) =>
  pipe(
    getCountryNameFromUser(countryNameFromUserMock),
    task.map(getCountryCode),
    task.chain(getCountryCurrencyOfOptionalCountryCode),
  );

// BONUS: We don't necessarily need `traverse` to do this. Try implementing
// `giveCurrencyOfCountryToUser` by lifting some of the functions' results to
// `TaskOption`

export const giveCurrencyOfCountryToUserWithTaskOption: (
  countryNameFromUserMock: string,
) => Task<Option<Currency>> = (countryNameFromUserMock) =>
  pipe(
    getCountryNameFromUser(countryNameFromUserMock),
    task.map(getCountryCode),
    taskOption.chain((countryCode) =>
      taskOption.fromTask(getCountryCurrency(countryCode)),
    ),
  );

///////////////////////////////////////////////////////////////////////////////
//                             TRAVERSING ARRAYS                             //
///////////////////////////////////////////////////////////////////////////////

// Let's say we want to ask the user to provide multiple countries. We'll have an array
// of country names as `string` and we want to retrieve the country code of each.
// Looks pretty easy:
export const getCountryCodeOfCountryNames = (
  countryNames: ReadonlyArray<string>,
) => countryNames.map(getCountryCode);
// As expected, we end up with a `ReadonlyArray<Option<CountryCode>>`. We know for
// each item of the array if we have been able to find the corresponding country
// code or not.
// While this can be useful, you need to handle the option anytime you want to
// perform any operation on each country code (let's say you want get the currency
// of each)
// It would be easier to 'merge' all the options into one and have a `Some` only if
// all the country codes are `Some` and a `None` if at least one is `None`.
// Doing this allows you to stop the process if you have a `None` to tell the user
// that some countries are not valid or move on with a `ReadonlyArray<CountryCode>>`
// if all are valid.
// Typewise, it means going from `ReadonlyArray<Option<CountryCode>>` to
// `Option<ReadonlyArray<CountryCode>>`
// This is what traversing array is about.

// Let's write a method that gets the country code for each element of an array
// of country names and returns an option of an array of country codes.
//
// HINT: while `readonlyArray.traverse` exists, you have a shortcut in the `option`
// module: `option.traverseArray`

export const getValidCountryCodeOfCountryNames: (
  countryNames: ReadonlyArray<string>,
) => Option<ReadonlyArray<CountryCode>> = option.traverseArray(getCountryCode);

///////////////////////////////////////////////////////////////////////////////
//                   TRAVERSING ARRAYS ASYNCHRONOUSLY                        //
///////////////////////////////////////////////////////////////////////////////

// We've seen how to traverse an `array` of `option`s but this is not something
// specific to `option`. We can traverse an `array` of any applicative functor,
// like `either` or `task` for example.
// When dealing with functors that perform asynchronous side effects, like
//`task`, comes the question of parallelization. Do we want to run the
// computation on each item of the array in parallel or one after the other?
// Both are equally feasible with fp-ts, let's discover it!

// Let's simulate a method that reads a number in a database, does some async
// computation with it, replaces this number in the database by the result of
// the computation and returns it
const createSimulatedAsyncMethod = (): ((toAdd: number) => Task<number>) => {
  let number = 0;

  return (toAdd: number) => async () => {
    const currentValue = number;
    await sleep(100);
    number = currentValue + toAdd;
    return number;
  };
};

// Write a method to traverse an array by running the method
// `simulatedAsyncMethodForParallel: (toAdd: number) => Task<number>`
// defined below on each item in parallel.
//
// HINT: as was the case for `option`, you have a few helpers in the `task`
// module to traverse arrays

export const simulatedAsyncMethodForParallel = createSimulatedAsyncMethod();
export const performAsyncComputationInParallel: (
  numbers: ReadonlyArray<number>,
) => Task<ReadonlyArray<number>> = task.traverseArray(
  simulatedAsyncMethodForParallel,
);

// Write a method to traverse an array by running the method
// `simulatedAsyncMethodForSequence: (toAdd: number) => Task<number>`
// defined below on each item in sequence.
//
// HINT: as was the case for `option`, you have a few helpers in the `task`
// module to traverse arrays

export const simulatedAsyncMethodForSequence = createSimulatedAsyncMethod();
export const performAsyncComputationInSequence: (
  numbers: ReadonlyArray<number>,
) => Task<ReadonlyArray<number>> = task.traverseSeqArray(
  simulatedAsyncMethodForSequence,
);

///////////////////////////////////////////////////////////////////////////////
//                               SEQUENCE                                    //
///////////////////////////////////////////////////////////////////////////////

// `traverse` is nice when you need to get the value inside a container (let's
// say `Option`), apply a method to it that return another container type (let's
// say `Task`) and 'invert' the container (to get a `Task<Option>` instead of a
// `Option<Task>` in our example)
// Sometimes, you just have two nested containers that you want to 'invert'. It
// can be because the order of containers is meaningful (like `Either<Option>`
// and `Option<Either>`) because you got them from an external api, as
// in the examples.
// In that case, what you need is `sequence`, which you can find in the modules
// that have `traverse`.
//
// Use the `sequence` methods from the `option` module to implement the two
// functions below

export const sequenceOptionTask: (
  optionOfTask: Option<Task<Currency>>,
) => Task<Option<Currency>> = option.sequence(task.ApplicativePar);

export const sequenceOptionArray: (
  arrayOfOptions: ReadonlyArray<Option<CountryCode>>,
) => Option<ReadonlyArray<CountryCode>> = option.sequenceArray;

// BONUS: try using these two functions in the exercises 'TRAVERSING OPTIONS'
// and 'TRAVERSING ARRAYS' above
