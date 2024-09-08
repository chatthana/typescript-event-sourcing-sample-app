import * as dotenv from 'dotenv';
import { Application } from 'express';
dotenv.config();
import 'reflect-metadata';
import { Producer } from 'kafkajs';

import config from '@config/main';

import { initialise } from '../startup';
import { TYPES } from '../types';

(async () => {
  const container = await initialise();
  const api: Application = container.get<Application>(TYPES.ApiServer);

  const kafkaProducer = container.get<Producer>(TYPES.KafkaProducer);
  kafkaProducer.connect();

  api.listen(config.API_PORT, () => console.log('The application is initialised on the port %s', config.API_PORT));
})();
