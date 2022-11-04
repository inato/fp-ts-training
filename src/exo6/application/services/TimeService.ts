import { getReaderMethod } from '../../../utils';

export interface TimeService {
  thisYear: () => number;
}

export interface TimeServiceAccess {
  timeService: TimeService;
}

export const thisYear = getReaderMethod(
  ({ timeService }: TimeServiceAccess) => timeService.thisYear,
);
