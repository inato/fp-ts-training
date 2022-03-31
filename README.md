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

## fp-ts typescript style guide

- Use `flow` instead of `pipe` when possible

```typescript
// Bad
const myFunc = (user: User) => pipe(user, getUserName, formatUserName);

// Good
const myFunc = flow(getUserName, formatUserName);
```

- Avoid using `boolean` method `match` when unecessary
  > Why? boolean.match can reduce the global understanding of a method and enforce nested pipes. Using classic `if/else` is often the best option

```typescript
// Bad
const myFunc = (condition: boolean) => pipe(
  condition === true,
  boolean.match(
    () => doSomethingOnFalse(...),
    () => doSomethingOnTrue(...)
  )
);

// Good
const myFunc = (condition: boolean) => {
  if (condition === true) {
    return doSomethingOnTrue(...);
  }
  return doSomethingOnFalse(...);
};
```

- Split piping from logical actions
  > Why? Mixing them makes it harder to understand and read the code. We want to favor the usage of atomic methods that do not know anything about the piping

```typescript
// Bad
const myFunc = () => pipe(
  rte.Do,
  rte.bind('aggregate', () => getAggregateById(...)),
  rte.bindW(...),
  ...,
  rte.chainW(({ aggregate }) => pipe(
    aggregate.something,
    doSomething,
    doSomethingElse,
    ...
    )
  ),
  rte.chainW(storeAggregate),
);

// Good
const myFunc = () => pipe(
  rte.Do,
  rte.bind('aggregate', () => getAggregateById(...)),
  rte.bindW(...),
  ...,
  rte.chainW(doEverything),
  rte.chainW(storeAggregate),
);

// Best
const buildProps = (...) => pipe(
  rte.Do,
  rte.bind('aggregate', () => getAggregateById(...)),
  rte.bindW(...),
  ...
);
const myFunc = () => pipe(
  buildProps(...),
  rte.chainW(doEverything),
  rte.chainW(storeAggregate),
);
```
