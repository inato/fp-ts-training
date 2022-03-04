// `fp-ts` training Exercice 5
// Managing nested effectful data with `traverse`

import { option, readonlyRecord, task } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { Option } from 'fp-ts/lib/Option';
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord';
import { Task } from 'fp-ts/lib/Task';
import { unimplemented, unimplementedAsync } from '../utils';

// TBD

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
// cannot fail so the signature is
// `getCountryCurrency: (countryCode: CountryCode) => Task<Currency>`
type Currency = 'EUR' | 'DOLLAR';
export const getCountryCurrency =
  (countryCode: CountryCode): Task<Currency> =>
  async () => {
    if (countryCode === 'US') {
      return 'DOLLAR';
    }
    return 'EUR';
  };

// Let's simulate a request to the user to provide a country name
// Let's consider that it cannot fail and let's add the possibility to set
// user's response as a parameter for easier testing
// `getCountryNameFromUser: (countryName: string) => Task<string>`
export const getCountryNameFromUser = (countryName: string) =>
  task.of(countryName);

// Here's a function to retrieve the countryCode from a country name if it is
// matching a country we support. This method returns an `option` as we cannot
// return anything if the given string is not matching a country name we know
// `getCountryCode: (countryName: string) => Option<CountryCode>`
export const getCountryCode = (countryName: string) =>
  readonlyRecord.lookup(countryName)(countryNameToCountryCode);

///////////////////////////////////////////////////////////////////////////////
//                            TRAVERSING OPTIONS                             //
///////////////////////////////////////////////////////////////////////////////

// With all these functions, we can simulate a program that would ask for a
// country name and return its currency if it knows the country.
// A naive implementation would be mapping on each `task` and `option` to call the
// correct method:
export const naiveGiveCurrencyOfCountryToUser = (
  countryNameFromUserMock: string,
) =>
  pipe(
    getCountryNameFromUser(countryNameFromUserMock),
    task.map(getCountryCode),
    task.map(option.map(getCountryCurrency)),
  );
// The result type of this method is: `Task<Option<Task<Currency>>>`
// Not ideal, right? We would need to await the first `task`, then check if it's
// `Some` to get the `task` inside and finally await the `task` to retrieve the
// currency.

// Use traverse to implement giveCurrencyOfCountryToUser below which returns
// a Task<Option<Currency>>.
//
// HINT: Take a look at `option.traverse` to transform an `Option<Task>` to
// a `Task<Option>`
// HINT: you can find an applicative functor of `Task` in `task.ApplicativePar`

export const giveCurrencyOfCountryToUser: (
  countryNameFromUserMock: string,
) => Task<Option<Currency>> = () => unimplementedAsync();

// BONUS: We don't necessarily need traverse to do this. Try implementing
// `giveCurrencyOfCountryToUser` by lifting all the functions' results to
// `TaskOption`

///////////////////////////////////////////////////////////////////////////////
//                             TRAVERSING ARRAYS                             //
///////////////////////////////////////////////////////////////////////////////

// Let's say we want to ask multiple countries to the user. We'll have an array
// of country names as string and we want to retrieve the country code of each.
// Looks pretty easy:
export const getCountryCodeOfCountryNames = (
  countryNames: ReadonlyArray<string>,
) => countryNames.map(getCountryCode);
// As expected, we end up with an array of `Option<CountryCode>`. We know for each
// item of the array if we have been able to find the corresponding country code
// or not.
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

// Let's write a method that gets the country code of each element of a country
// name array and returns an option of an array of country codes.
//
// HINT: while `readonlyArray.traverse` exists, you have a shortcut in the `option`
// module: `option.traverseArray`

export const getValidCountryCodeOfCountryNames: (
  countryNames: ReadonlyArray<string>,
) => Option<ReadonlyArray<CountryCode>> = unimplemented();
