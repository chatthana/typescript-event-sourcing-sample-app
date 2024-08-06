import { Event } from '@core/Event';

export class JobCreated extends Event {
  eventName = JobCreated.name;
  aggregateName = 'job';

  constructor(public guid: string, public title: string, public description: string) {
    super(guid);
  }
}
