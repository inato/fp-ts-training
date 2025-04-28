import { Effect, Context } from 'effect';

export interface TimeService {
  thisYear: () => number;
}

export class TimeServiceTag extends Context.Tag('TimeServiceTag')<
  TimeServiceTag,
  TimeService
>() {}

export const thisYear = (): Effect.Effect<number, never, TimeServiceTag> =>
  Effect.map(TimeServiceTag, service => service.thisYear()); 