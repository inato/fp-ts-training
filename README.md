# Inato `Effect` training

Training material to onboard people on using `Effect` efficiently.

The exercises consist of unimplemented functions and their associated failing tests.

If needed, you can always refer to the `exoN.solution.ts` file where you will find the solution of the exercise.

But first, it is essential to understand why we are using functional programming in the first place. We suggest you to read this [article](https://medium.com/inato/our-journey-to-functional-programing-36854a370de1) and then start the exercises.

After cloning the repository, setup the project by running

```sh
$ pnpm install
```

To run the tests, simply run

```sh
$ pnpm test
```

You can also run them in watch mode:

```sh
$ pnpm test:watch
```

Finally, if you wish to only run the tests for a given exercise `exoN`, you can run the following:

```sh
$ pnpm test[:watch] exoN
```

The exercises are organized into `exoN` folders and most of what is required to complete each is detailed in the comments.

## Code Style Guide

- Use `flow` instead of `pipe` when possible
  > Why? Using flow reduces the amount of variables to declare in a method, hence the visibility and readability of the code

```typescript
// Bad
import { pipe } from 'effect';

const formatUserPhoneNumber = (user: User) =>
  pipe(user, User.phoneNumber, User.formatPhoneNumber);

// Good
import { flow } from 'effect';

const formatUserPhoneNumber = flow(User.phoneNumber, User.formatPhoneNumber);
```

- Avoid complex conditionals when simple if/else is clearer
  > Why? Complex conditionals can lower the global understanding of a method and enforce nested pipes. Using classic `if/else` is often the best option

```typescript
// Bad
import { pipe } from 'effect';

const triggerEmailCampaign = ({
  user,
  ...emailSettings
}: {
  user: User;
} & EmailSettings) =>
  pipe(
    user.nationality === 'FR',
    match({
      onTrue: () =>
        triggerFrenchEmailCampaign({ to: user.email, emailSettings }),
      onFalse: () =>
        triggerGlobalEmailCampaign({ to: user.email, emailSettings }),
    }),
  );

// Good
const triggerEmailCampaign = ({
  user,
  ...emailSettings
}: { user: User } & EmailSettings) => {
  if (user.nationality === 'FR') {
    return triggerFrenchEmailCampaign({ to: user.email, emailSettings });
  }
  return triggerGlobalEmailCampaign({ to: user.email, emailSettings });
};
```

- Avoid nested pipes
  > Why? They lower global understanding of the code. We allow ourselves 2 levels of piping maximum per function and tend to do atomic functions instead. For complex operations, consider using Effect.gen with yield syntax.

```typescript
// Bad
import { Effect, Either, Option, pipe } from "effect";

export const convertDollarAmountInCountryCurrency = ({
  countryName,
  amountInDollar,
}: {
  countryName: CountryName;
  amountInDollar: number;
}) =>
  pipe(
    getCountryCode(countryName),
    Either.map(
      countryCode =>
        pipe(
          getCountryCurrency(countryCode),
          Option.map(
            flow(
              convertFromDollarAmount(amountInDollar),
              convertedAmount =>
                console.log(
                  `converted amount for country ${countryCode} is ${convertedAmount}`,
                ),
              ),
            ),
          ),
        ),
    ),
  );

// Good - Using Effect.gen for complex operations
import { Effect, Either, Option, pipe, flow } from "effect";

export const convertDollarAmountInCountryCurrency = ({
  countryName,
  amountInDollar,
}: {
  countryName: CountryName;
  amountInDollar: number;
}) => Effect.gen(function* (_) {
  const countryCodeEither = yield* _(getCountryCode(countryName));
  const countryCode = yield* _(Either.getOrThrowWith(
    () => new Error(`Invalid country name: ${countryName}`)
  )(countryCodeEither));

  const currencyOption = yield* _(getCountryCurrency(countryCode));
  const currency = yield* _(Option.getOrThrowWith(
    () => new Error(`No currency found for country code: ${countryCode}`)
  )(currencyOption));

  const convertedAmount = convertFromDollarAmount(amountInDollar)(currency);
  console.log(`converted amount for country ${countryCode} is ${convertedAmount}`);

  return convertedAmount;
});

// Good - Decomposing into smaller functions
export const convertDollarAmountInCountryCurrency = (amountInDollar: number) =>
  flow(
    getCountryCode,
    Either.map(convertDollarAmountToCountryCodeCurrency(amountInDollar)),
  );

const convertDollarAmountToCountryCodeCurrency =
  (amountInDollar: number) => (countryCode: CountryCode) =>
    pipe(
      getCountryCurrency(countryCode),
      Option.map(convertFromDollarAmount(amountInDollar)),
      Option.map(convertedAmount =>
        console.log(
          `converted amount for country ${countryCode} is ${convertedAmount}`,
        ),
      ),
    );
```
