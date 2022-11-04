import { TimeService } from './TimeService';

export class NodeTimeService implements TimeService {
  public thisYear() {
    return new Date().getFullYear();
  }
}
