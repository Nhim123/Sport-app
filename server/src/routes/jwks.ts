import { Router } from 'express';
import { jwks } from '../config/keys.js';

// GET /.well-known/jwks.json — public keys de verify JWT (RS256).
const router = Router();
router.get('/', (_req, res) => {
  res.json(jwks());
});
export default router;
