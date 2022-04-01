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
  user: User & EmailSettings;
}) =>
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
  ...otherProps
}: {
  user: User & OtherProps;
}) => {
  if (user.nationality === 'FR') {
    return triggerFrenchEmailCampaign({ to: user.email, emailSettings });
  }
  return triggerGlobalEmailCampain({ to: user.email, emailSettings });
};
```

- Avoid nested pipes
  > Why? They lower global understanding of the code. We allow ourselves 2 levels of piping maximum per function and tend to do atomic functions instead

```typescript
// Bad
const renewUserToken = (user: User) =>
  pipe(
    user.token,
    option.match(
      () => AuthClient.createToken(user),
      (token) =>
        flow(
          AuthClient.renewToken(user),
          rte.chainW(({ newToken }) =>
            pipe(newToken.hash, user.updateToken, rte.chainEitherKW(storeUser)),
          ),
        ),
    ),
  );

// Good
const updateUserToken = (user: User) => (newToken: Token) =>
  pipe(newToken.hash, user.updateToken, rte.chainEitherKW(storeUser));

const renewAndUpdateUserToken = (user: User) =>
  flow(
    AuthClient.renewToken(user),
    rte.chainW(({ newToken }) => updateUserToken(user)),
  );

const renewUserToken = (user: User) =>
  pipe(
    user.token,
    option.match(
      () => AuthClient.createToken(user),
      renewAndUpdateUserToken(user),
    ),
  );
```
