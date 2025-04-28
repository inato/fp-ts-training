import { TimeService } from './TimeService';

export class NodeTimeService implements TimeService {
  public thisYear(): number {
    return new Date().getFullYear();
  }
} 