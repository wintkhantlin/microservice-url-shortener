import { serve } from '@hono/node-server';
import { app } from './app.js';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

console.log(`Redirect service is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
