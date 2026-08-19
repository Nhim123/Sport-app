import { createApp } from './app.js';
import { connectMongo } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { env } from './config/env.js';

async function bootstrap(): Promise<void> {
  await connectMongo();
  await connectRedis();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[server] listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });
}

bootstrap().catch((err) => {
  console.error('[server] failed to start:', err);
  process.exit(1);
});
