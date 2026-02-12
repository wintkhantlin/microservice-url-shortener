import { Hono } from 'hono';
import { redis } from './redis.js';
import { fetchAliasFromManagement } from './managementClient';

export const app = new Hono();

app.get('/health', (c) => c.json({ status: 'ok' }));

app.get('/:code', async (c) => {
  const code = c.req.param('code');

  try {
    const cachedTarget = await redis.get(`alias:${code}`);
    if (cachedTarget) {
      console.log(`Cache hit for ${code}: ${cachedTarget}`);
      return c.redirect(cachedTarget);
    }

    console.log(`Cache miss for ${code}, fetching from management service...`);
    const target = await fetchAliasFromManagement(code);

    if (target) {
      await redis.set(`alias:${code}`, target, 'EX', 3600);
      return c.redirect(target);
    }

    return c.json({ error: 'Not found' }, 404);
  } catch (error) {
    console.error('Redirection error:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export default app;
