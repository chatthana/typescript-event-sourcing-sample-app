import { Event } from '@core/Event';

export class ApplicationCreated extends Event {
  eventName = ApplicationCreated.name;
  aggregateName = 'application';

  constructor(
    public guid: string,
    public jobId: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public currentPosition: string
  ) {
    super();
  }
}
