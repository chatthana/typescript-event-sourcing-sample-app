import config from '@config/main';
import { IEventBus } from '@cqrs-es/core';
import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import { Consumer } from 'kafkajs';

import { initialise } from '../startup';
import { TYPES } from '../types';

(async () => {
  const container = await initialise();
  const kafkaConsumer = container.get<Consumer>(TYPES.KafkaConsumer);
  kafkaConsumer.connect();

  for (const topic of config.KAFKA_TOPICS_TO_SUBSCRIBE.split(',')) {
    await kafkaConsumer.subscribe({ topic });
  }

  const baseEventHandler = container.get<IEventBus>(TYPES.EventBus);
  baseEventHandler.subscribeEvents();
})();
