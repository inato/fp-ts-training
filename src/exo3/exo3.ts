// `fp-ts` training Exercice 3
// Sort things out with `Ord`

import * as Option from 'fp-ts/lib/Option';

import { unimplemented } from '../utils';

///////////////////////////////////////////////////////////////////////////////
//                          SORT PRIMITIVE TYPES                             //
///////////////////////////////////////////////////////////////////////////////

export const sortStrings: (
  strings: ReadonlyArray<string>,
) => ReadonlyArray<string> = unimplemented;

export const sortNumbers: (
  numbers: ReadonlyArray<number>,
) => ReadonlyArray<number> = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                                REVERSE SORT                               //
///////////////////////////////////////////////////////////////////////////////

export const sortNumbersDescending: (
  numbers: ReadonlyArray<number>,
) => ReadonlyArray<number> = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                            SORT OPTIONAL VALUES                           //
///////////////////////////////////////////////////////////////////////////////

export const sortOptionalNumbers: (
  optionalNumbers: ReadonlyArray<Option.Option<number>>,
) => ReadonlyArray<Option.Option<number>> = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                           SORT COMPLEX OBJECTS                            //
///////////////////////////////////////////////////////////////////////////////

export interface Person {
  readonly name: string;
  readonly age: Option.Option<number>;
}

export const sortPersonsByName: (
  person: ReadonlyArray<Person>,
) => ReadonlyArray<Person> = unimplemented;

export const sortPersonsByAge: (
  person: ReadonlyArray<Person>,
) => ReadonlyArray<Person> = unimplemented;

///////////////////////////////////////////////////////////////////////////////
//                          COMBINE SORTING SCHEMES                          //
///////////////////////////////////////////////////////////////////////////////

export const sortPersonsByAgeThenByName: (
  person: ReadonlyArray<Person>,
) => ReadonlyArray<Person> = unimplemented;
