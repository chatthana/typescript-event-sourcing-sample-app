import '@src/api/http/controllers';

import {
  ICommand,
  IQuery,
  ICommandHandler,
  ICommandBus,
  IQueryBus,
  IQueryHandler,
  IEventHandler,
  createWinstonLogger,
} from '@cqrs-es/core';
import { errorHandler } from '@src/api/http/middlewares/error-handler';
import { JobCreatedEventHandler } from '@src/application/events/handlers/job-created-handler';
import { TYPES } from '@src/types';
import { Application, urlencoded, json } from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import winston from 'winston';

import { JobCreated } from '@domain/events/job-created';
import { JobUpdated } from '@domain/events/job-updated';
import { CreateJobCommandHandler } from '@src/application/commands/handlers/create-job-handler';
import { UpdateJobCommandHandler } from '@src/application/commands/handlers/update-job-handler';
import { JobUpdatedEventHandler } from '@src/application/events/handlers/job-updated-handler';
import { GetAllJobsQueryHandler } from '@src/application/queries/handlers/get-all-jobs-query-handler';

import { ArchiveJobCommandHandler } from './application/commands/handlers/archive-job-handler';
import { JobArchivedEventHandler } from './application/events/handlers/job-archived-handler';
import { JobArchived } from './domain/events/job-archived';
import { infrastructureModule } from './infrastructure/module';

const initialise = async () => {
  const container = new Container();
  const logger = createWinstonLogger('cqrs-es-job');

  await container.loadAsync(infrastructureModule);

  container.bind<winston.Logger>(TYPES.Logger).toConstantValue(logger);
  container.bind<IEventHandler<JobCreated>>(TYPES.Event).to(JobCreatedEventHandler);
  container.bind<IEventHandler<JobUpdated>>(TYPES.Event).to(JobUpdatedEventHandler);
  container.bind<IEventHandler<JobArchived>>(TYPES.Event).to(JobArchivedEventHandler);
  container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateJobCommandHandler);
  container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdateJobCommandHandler);
  container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(ArchiveJobCommandHandler);
  container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllJobsQueryHandler);

  const commandBus = container.get<ICommandBus>(TYPES.CommandBus);

  container.getAll<ICommandHandler<ICommand>>(TYPES.CommandHandler).forEach((handler: ICommandHandler<ICommand>) => {
    commandBus.registerHandler(handler);
  });

  const queryBus = container.get<IQueryBus>(TYPES.QueryBus);
  container.getAll<IQueryHandler<IQuery>>(TYPES.QueryHandler).forEach((handler: IQueryHandler<IQuery>) => {
    queryBus.registerHandler(handler);
  });

  const server = new InversifyExpressServer(container);

  server.setConfig((app: Application) => {
    app.use(urlencoded({ extended: true }));
    app.use(json());
  });

  server.setErrorConfig((app: Application) => {
    app.use(errorHandler);
  });

  const apiServer = server.build();
  container.bind<Application>(TYPES.ApiServer).toConstantValue(apiServer);

  return container;
};

export { initialise };
