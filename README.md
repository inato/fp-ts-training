# Inato `fp-ts` training

This repo is a work in progress toward having a comprehensive training material
to onboard people on using `fp-ts` efficiently.

The exercices consist of unimplemented functions and their associated failing
tests.

To run the tests, simply run

```sh
$ yarn test
```

You can also run them in watch mode:

```sh
$ yarn test:watch
```

Finally, if you wish to only run the tests for a given exercice `exoN`, you can
run the following:

```sh
$ yarn test[:watch] exoN
```

The exercices are organized into `exoN` folders and most of what is required to
complete each is detailed in the comments.

## code style guide

For readability purpose, we replace `ReaderTaskEither` by `rte`

- Use `flow` instead of `pipe` when possible
  > Why? Using flow reduces the amount of variables to declare in a method, hence the visibility and readability of the code

```typescript
// Bad
const formatUserPhoneNumber = (user: User) =>
  pipe(user, User.phoneNumber, User.formatPhoneNumber);

// Good
const formatUserPhoneNumber = flow(User.phoneNumber, User.formatPhoneNumber);
```

- Avoid using `boolean` method `match` when unecessary
  > Why? boolean.match can lower the global understanding of a method and enforce nested pipes. Using classic `if/else` is often the best option

```typescript
// Bad
const triggerEmailCampaign = ({
  user,
  ...emailSettings
}: {
  user: User} & EmailSettings) =>
  pipe(
    user.nationality === 'FR',
    boolean.match(
      () => triggerGlobalEmailCampain({ to: user.email, emailSettings }),
      () => triggerFrenchEmailCampaign({ to: user.email, emailSettings }),
    ),
  );

// Good
const triggerEmailCampaign = ({
  user,
  ...emailSettings
}: { user: User } & EmailSettings) => {
  if (user.nationality === 'FR') {
    return triggerFrenchEmailCampaign({ to: user.email, emailSettings });
  }
  return triggerGlobalEmailCampain({ to: user.email, emailSettings });
```

- Avoid nested pipes
  > Why? They lower global understanding of the code. We allow ourselves 2 levels of piping maximum per function and tend to do atomic functions instead

```typescript
// Bad
const convertDollarAmountInCountryCurrency = ({
  countryName,
  amountInDollar,
}: {
  countryName: CountryName;
  amountInDollar: number;
}) =>
  pipe(
    getCountryCode(countryName),
    either.map(
      countryCode =>
        pipe(
          getCountryCurrency(countryCode),
          option.map(currency =>
            pipe(
              amountInDollar,
              converFromDollar(currency),
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

// Good
const convertDollarAmountInCountryCodeCurrency = ({
  amountInDollar,
  countryCode,
}: {
  amountInDollar: number;
  countryCode: CountryCode;
}) =>
  pipe(
    getCurrencyFromCountryCode(countryCode),
    option.map(currency => {
      const convertedDollarAmount = convertFromDollar(currency)(currency);
      console.log(
        `converted amount for country ${countryCode} is ${convertedAmount}`,
      );
    }),
  );

const convertDollarAmountInCountryCurrency = ({
  amountInDollar,
  countryName,
}: {
  amountInDollar: number;
  countryName: CountryName;
}) =>
  pipe(
    getCountryCode(countryName),
    either.map(countryCode =>
      convertDollarAmountToCountryCodeCurrency({ amountInDollar, countryCode }),
    ),
  );

```
