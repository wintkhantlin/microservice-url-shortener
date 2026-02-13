import { serve } from '@hono/node-server';
import { app } from './app.js';
import { connectProducer } from './kafka.js';
import logger from './logger.js';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

connectProducer().catch(err => {
  logger.error({ err }, 'Failed to connect Kafka producer');
});

logger.info({ port }, 'Redirect service is running');

serve({
  fetch: app.fetch,
  port,
});
