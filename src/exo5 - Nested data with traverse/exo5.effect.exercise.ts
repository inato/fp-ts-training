// Effect training Exercise 5
// Managing nested effectful data with Effect's data transformation capabilities

import { Effect, Option, Array, pipe } from 'effect';

// When using many different effect types in a complex application, we can easily
// get to a point when we have many nested types that we would like to 'merge',
// like nested effects or arrays of effects.
// Effect provides powerful data transformation capabilities to handle these scenarios.

///////////////////////////////////////////////////////////////////////////////
//                                 SETUP                                     //
///////////////////////////////////////////////////////////////////////////////

// Let's consider a small range of countries (here, France, Spain and the USA)
// with a mapping from their name to their code:
type CountryCode = 'FR' | 'SP' | 'US';
export const countryNameToCountryCode: Record<string, CountryCode> = {
  France: 'FR',
  Spain: 'SP',
  USA: 'US',
};

// Let's simulate the call to an api which would return the currency when
// providing a country code. For the sake of simplicity, let's consider that it
// cannot fail.
type Currency = 'EUR' | 'DOLLAR';
export const getCountryCurrency = (countryCode: CountryCode): Effect.Effect<Currency> =>
  Effect.gen(function* () {
    if (countryCode === 'US') {
      return 'DOLLAR';
    }
    return 'EUR';
  });

// Let's simulate a way for the user to provide a country name.
// Let's consider that it cannot fail and let's add the possibility to set
// the user's response as a parameter for easier testing.
export const getCountryNameFromUser = (countryName: string): Effect.Effect<string> =>
  Effect.succeed(countryName);

// Here's a function to retrieve the countryCode from a country name if it is
// matching a country we support. This method returns an `Option` as we cannot
// return anything if the given string is not matching a country name we know
export const getCountryCode = (countryName: string): Option.Option<CountryCode> =>
  Option.fromNullable(countryNameToCountryCode[countryName]);

///////////////////////////////////////////////////////////////////////////////
//                            TRAVERSING OPTIONS                             //
///////////////////////////////////////////////////////////////////////////////

// With all these functions, we can simulate a program that would ask for a
// country name and return its currency if it knows the country.
// A naive implementation would be mapping on each `Effect` and `Option` to call
// the correct method:
export const naiveGiveCurrencyOfCountryToUser = (countryNameFromUserMock: string) =>
  pipe(
    getCountryNameFromUser(countryNameFromUserMock),
    Effect.map(getCountryCode),
    Effect.map(Option.map(getCountryCurrency))
  );

// The result type of this method is: `Effect<Option<Effect<Currency>>>`
// Not ideal, right? We would need to run the first `Effect`, then check if it's
// `Some` to get the `Effect` inside and finally run the `Effect` to retrieve the
// currency.
// Let's do better than that!

// First we need a way to transform our `Option<Effect<Currency>>` to
// `Effect<Option<Currency>>`
// That's precisely what `Effect.flatMapOption` is about.
// Use `Option.traverse` to implement `getCountryCurrencyOfOptionalCountryCode`
// below. This function takes an `Option<CountryCode>`, should apply
// `getCountryCurrency` to the `CountryCode` and make it so that the result
// is `Effect<Option<Currency>>`

export const getCountryCurrencyOfOptionalCountryCode = (
  optionalCountryCode: Option.Option<CountryCode>
): Effect.Effect<Option.Option<Currency>> =>
  // Implement this function using Effect's APIs
  pipe(
    optionalCountryCode,
    Option.match({
      onNone: () => Effect.succeed(Option.none()),
      onSome: code => pipe(
        getCountryCurrency(code),
        Effect.map(Option.some)
      )
    })
  );

// Let's now use this function in our naive implementation's pipe to see how it
// improves it.
// Implement `giveCurrencyOfCountryToUser` below so that it returns a
// `Effect<Option<Currency>>`

export const giveCurrencyOfCountryToUser = (
  countryNameFromUserMock: string
): Effect.Effect<Option.Option<Currency>> =>
  pipe(
    getCountryNameFromUser(countryNameFromUserMock),
    Effect.map(getCountryCode),
    Effect.flatMap(getCountryCurrencyOfOptionalCountryCode)
  );

///////////////////////////////////////////////////////////////////////////////
//                             TRAVERSING ARRAYS                             //
///////////////////////////////////////////////////////////////////////////////

// Let's say we want to ask the user to provide multiple countries. We'll have an array
// of country names as `string` and we want to retrieve the country code of each.
// Looks pretty easy:
export const getCountryCodeOfCountryNames = (
  countryNames: ReadonlyArray<string>
): ReadonlyArray<Option.Option<CountryCode>> =>
  countryNames.map(getCountryCode);

// As expected, we end up with a `ReadonlyArray<Option<CountryCode>>`. We know for
// each item of the array if we have been able to find the corresponding country
// code or not.
// While this can be useful, you need to handle the option anytime you want to
// perform any operation on each country code (let's say you want to get the
// currency of each)
// It would be easier to 'merge' all the options into one and have a `Some` only if
// all the country codes are `Some` and a `None` if at least one is `None`.
// Doing this allows you to stop the process if you have a `None` to tell the user
// that some countries are not valid or move on with a `ReadonlyArray<CountryCode>>`
// if all are valid.
// Type-wise, it means going from `ReadonlyArray<Option<CountryCode>>` to
// `Option<ReadonlyArray<CountryCode>>`
// This is what traversing array is about.

// Let's write a method that gets the country code for each element of an array
// of country names and returns an option of an array of country codes.

export const getValidCountryCodeOfCountryNames = (
  countryNames: ReadonlyArray<string>
): Option.Option<ReadonlyArray<CountryCode>> => {
  const optionArray = countryNames.map(getCountryCode);
  return pipe(
    optionArray,
    Array.reduce(Option.some([]) as Option.Option<Array<CountryCode>>, (acc, current) =>
      pipe(
        acc,
        Option.flatMap(arr =>
          pipe(
            current,
            Option.map(val => [...arr, val])
          )
        )
      )
    )
  );
};

///////////////////////////////////////////////////////////////////////////////
//                   TRAVERSING ARRAYS ASYNCHRONOUSLY                        //
///////////////////////////////////////////////////////////////////////////////

// We've seen how to traverse an `array` of `option`s but this is not something
// specific to `option`. We can traverse an `array` of any effect functor.
// When dealing with functors that perform asynchronous side effects, like
// `Effect`, comes the question of parallelization. Do we want to run the
// computation on each item of the array in parallel or one after the other?
// Both are equally feasible with Effect, let's discover it!

// Let's simulate a method that reads a number in a database, does some async
// computation with it, replaces this number in the database by the result of
// the computation and returns it
const createSimulatedAsyncMethod = (): ((toAdd: number) => Effect.Effect<number>) => {
  let number = 0;

  return (toAdd: number) => 
    Effect.gen(function* () {
      const currentValue = number;
      yield* Effect.sleep(100);
      number = currentValue + toAdd;
      return number;
    });
};

// Write a method to traverse an array by running the method
// `simulatedAsyncMethodForParallel: (toAdd: number) => Effect<number>`
// defined below on each item in parallel.

export const simulatedAsyncMethodForParallel = createSimulatedAsyncMethod();
export const performAsyncComputationInParallel = (
  numbers: ReadonlyArray<number>
): Effect.Effect<ReadonlyArray<number>> =>
  Effect.forEach(
    numbers,
    simulatedAsyncMethodForParallel,
    { concurrency: "unbounded" }
  );

// Write a method to traverse an array by running the method
// `simulatedAsyncMethodForSequence: (toAdd: number) => Effect<number>`
// defined below on each item in sequence.

export const simulatedAsyncMethodForSequence = createSimulatedAsyncMethod();
export const performAsyncComputationInSequence = (
  numbers: ReadonlyArray<number>
): Effect.Effect<ReadonlyArray<number>> =>
  Effect.forEach(
    numbers,
    simulatedAsyncMethodForSequence,
    { concurrency: 1 }
  );

///////////////////////////////////////////////////////////////////////////////
//                               SEQUENCE                                    //
///////////////////////////////////////////////////////////////////////////////

// `traverse` is nice when you need to get the value inside a container (let's
// say `Option`), apply a method to it that returns another container type (let's
// say `Effect`) and 'invert' the container (to get a `Effect<Option>` instead of a
// `Option<Effect>` in our example)
// Sometimes, you just have two nested containers that you want to 'invert'. It
// can be because the order of containers is meaningful or because you got them 
// from an external api, as in the examples.
// In that case, what you need is `sequence`, which is available in Effect for various 
// data types.

export const sequenceOptionTask = (
  optionOfTask: Option.Option<Effect.Effect<Currency>>
): Effect.Effect<Option.Option<Currency>> =>
  pipe(
    optionOfTask,
    Option.match({
      onNone: () => Effect.succeed(Option.none()),
      onSome: effect => pipe(
        effect,
        Effect.map(Option.some)
      )
    })
  );

export const sequenceOptionArray = (
  arrayOfOptions: ReadonlyArray<Option.Option<CountryCode>>
): Option.Option<ReadonlyArray<CountryCode>> => {
  return pipe(
    arrayOfOptions,
    Array.reduce(Option.some([]) as Option.Option<Array<CountryCode>>, (acc, current) =>
      pipe(
        acc,
        Option.flatMap(arr =>
          pipe(
            current,
            Option.map(val => [...arr, val])
          )
        )
      )
    )
  );
}; 