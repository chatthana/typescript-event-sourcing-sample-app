import { inject, injectable, named } from 'inversify';

import { NAMES, TYPES } from '@constants/types';
import { IEventStore } from '@core/IEventStore';
import { Book } from '@domain/book/Book';
import { IBookRepository } from '@domain/book/IBookRepository';

import { Repository } from './Repository';

@injectable()
export class BookRepository extends Repository<Book> implements IBookRepository {
  constructor(@inject(TYPES.EventStore) @named(NAMES.BookEventStore) private readonly eventstore: IEventStore) {
    super(eventstore, Book);
  }
}
