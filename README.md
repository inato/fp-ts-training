# Inato `fp-ts` training

Training material to onboard people on using `fp-ts` efficiently.

The exercises consist of unimplemented functions and their associated failing tests.

But first, it is essential to understand why we are using `fp-ts`. We suggest you to read this [article](https://medium.com/inato/our-journey-to-functional-programing-36854a370de1) and then start the exercises.

After cloning the repository, setup the project by running

```sh
$ yarn
```

To run the tests, simply run

```sh
$ yarn test
```

You can also run them in watch mode:

```sh
$ yarn test:watch
```

Finally, if you wish to only run the tests for a given exercise `exoN`, you can run the following:

```sh
$ yarn test[:watch] exoN
```

The exercises are organized into `exoN` folders and most of what is required to complete each is detailed in the comments.

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
      () => triggerGlobalEmailCampaign({ to: user.email, emailSettings }),
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
  return triggerGlobalEmailCampaign({ to: user.email, emailSettings });
```

- Avoid nested pipes
  > Why? They lower global understanding of the code. We allow ourselves 2 levels of piping maximum per function and tend to do atomic functions instead

```typescript
// Bad
export const convertDollarAmountInCountryCurrency = ({
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
          option.map(
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

// Good
export const convertDollarAmountInCountryCurrency = (amountInDollar: number) =>
  flow(
    getCountryCode,
    either.map(convertDollarAmountToCountryCodeCurrency(amountInDollar)),
  );

const convertDollarAmountToCountryCodeCurrency =
  (amountInDollar: number) => (countryCode: CountryCode) =>
    pipe(
      getCountryCurrency(countryCode),
      option.map(convertFromDollarAmount(amountInDollar)),
      option.map(convertedAmount =>
        console.log(
          `converted amount for country ${countryCode} is ${convertedAmount}`,
        ),
      ),
    );
```
