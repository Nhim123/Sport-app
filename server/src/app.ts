import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './modules/users/routes.js';
import venuesRoutes from './modules/venues/routes.js';
import bookingsRoutes from './modules/bookings/routes.js';
import gymRoutes from './modules/gym/routes.js';
import clubsRoutes from './modules/clubs/routes.js';
import pollsRoutes from './modules/polls/routes.js';
import paymentsRoutes from './modules/payments/routes.js';
import matchesRoutes from './modules/matches/routes.js';
import scheduleRoutes from './modules/schedule/routes.js';
import identityRoutes from './modules/identity/routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

/**
 * Composition root: dựng app + mount router theo từng module dưới /api/v1/<domain>.
 * Mỗi module tự đóng gói routes/controller/service/model/schema (modular monolith,
 * sẵn sàng tách microservice sau này).
 */
export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Health hạ tầng + JWKS công khai (Identity)
  app.use('/api/health', healthRoutes);
  app.use(identityRoutes); // GET /.well-known/jwks.json

  // API v1 — mount theo module
  const V1 = '/api/v1';
  app.use(`${V1}/auth`, authRoutes);          // auth thật hiện có (sẽ migrate vào modules/auth sau)
  app.use(`${V1}/users`, usersRoutes);
  app.use(`${V1}/venues`, venuesRoutes);
  app.use(`${V1}/bookings`, bookingsRoutes);
  app.use(`${V1}/gym`, gymRoutes);
  app.use(`${V1}/clubs`, clubsRoutes);
  app.use(`${V1}/polls`, pollsRoutes);
  app.use(`${V1}/payments`, paymentsRoutes);
  app.use(`${V1}/matches`, matchesRoutes);
  app.use(`${V1}/schedule`, scheduleRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
