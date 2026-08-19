import { Redis } from 'ioredis';
import { env } from './env.js';

export const redis = new Redis(env.redisUrl, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

export async function connectRedis(): Promise<void> {
  await redis.connect();
  console.log('[redis] connected');

  redis.on('error', (err) => {
    console.error('[redis] error:', err);
  });
}
