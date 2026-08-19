import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectMongo(): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  console.log('[mongo] connected');

  mongoose.connection.on('error', (err) => {
    console.error('[mongo] connection error:', err);
  });
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
}
