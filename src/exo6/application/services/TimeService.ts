import { getReaderMethod } from '../../../utils';

export interface TimeService {
  thisYear: () => number;
}

export interface Access {
  timeService: TimeService;
}

export const thisYear = getReaderMethod(
  ({ timeService }: Access) => timeService.thisYear,
);
