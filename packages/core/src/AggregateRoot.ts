import { nanoid } from 'nanoid';

import { IEvent } from './interfaces/IEvent';

export abstract class AggregateRoot {
  public guid: string;
  private __version = 0;
  private __changes: IEvent[] = [];

  get version() {
    return this.__version;
  }

  constructor(guid?: string) {
    this.guid = guid || nanoid();
  }

  public getUncommittedEvents(): IEvent[] {
    return [...this.__changes];
  }

  public markChangesAsCommitted(): void {
    this.__changes = [];
  }

  protected applyChange(event: IEvent): void {
    this.applyEvent(event, true);
  }

  private applyEvent(event: IEvent, isNew = false): void {
    const handlerMethod = `apply${event.eventName}`;

    if (typeof (this as any)[handlerMethod] === 'function') {
      (this as any)[handlerMethod](event);
    } else {
      throw new Error(`Handler method ${handlerMethod} not implemented`);
    }

    if (isNew) {
      this.__changes.push(event);
    }
  }

  public loadFromHistory(events: IEvent[]): void {
    for (const event of events) {
      this.applyEvent(event);
      this.__version++;
    }
  }
}
