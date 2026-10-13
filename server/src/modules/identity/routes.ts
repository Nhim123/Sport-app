import { Router } from 'express';
import * as controller from './controller.js';

// Mount o goc app: GET /.well-known/jwks.json
const router = Router();
router.get('/.well-known/jwks.json', controller.jwks);
export default router;
