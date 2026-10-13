import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import { env } from './config/env.js';

/**
 * API Gateway (modular monolith): 1 diem vao duy nhat.
 * - Verify JWT tap trung (tru auth/health), chuyen `x-user-id` xuong backend.
 * - Rewrite path docs-style -> path module cua backend.
 * - Proxy bang fetch (Node 22) toi GATEWAY_TARGET (mac dinh backend :4000).
 */
const TARGET = process.env.GATEWAY_TARGET ?? 'http://localhost:4000';
const PORT = Number(process.env.GATEWAY_PORT ?? 8080);

const PUBLIC: RegExp[] = [
  /^\/api\/health/,
  /^\/api\/v1\/auth\/(register|login|google)$/,
];
const isPublic = (path: string) => PUBLIC.some((re) => re.test(path));

// docs-style -> backend module path. Tra path (co the kem query).
function rewrite(pathname: string, method: string): string {
  let p = pathname;
  p = p.replace(/^\/api\/v1\/day-passes/, '/api/v1/gym/day-passes');
  p = p.replace(/^\/api\/v1\/memberships\/me/, '/api/v1/gym/membership');
  p = p.replace(/^\/api\/v1\/me\/schedule/, '/api/v1/schedule');
  p = p.replace(/^\/api\/v1\/me\/clubs/, '/api/v1/clubs/me');
  // GET /clubs/:id/polls -> /polls?clubId=:id (POST create dung thang /polls voi clubId trong body)
  const m = p.match(/^\/api\/v1\/clubs\/([^/]+)\/polls$/);
  if (m && method === 'GET') p = '/api/v1/polls?clubId=' + m[1];
  return p;
}

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use((req, res) => {
  const [pathname, query] = req.originalUrl.split('?');

  let userId: string | undefined;
  if (!isPublic(pathname)) {
    const h = req.headers.authorization;
    if (!h?.startsWith('Bearer ')) { res.status(401).json({ error: 'Missing token' }); return; }
    try {
      const payload = jwt.verify(h.slice(7), env.jwtSecret) as { sub: string };
      userId = payload.sub;
    } catch {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
  }

  let target = rewrite(pathname, req.method);
  if (query) target += (target.includes('?') ? '&' : '?') + query;

  const chunks: Buffer[] = [];
  req.on('data', (c: Buffer) => chunks.push(c));
  req.on('end', () => {
    void (async () => {
      const body = Buffer.concat(chunks);
      const skip = new Set(['host', 'content-length', 'accept-encoding', 'connection']);
      const headers: Record<string, string> = {};
      for (const [k, v] of Object.entries(req.headers)) {
        if (typeof v === 'string' && !skip.has(k)) headers[k] = v;
      }
      if (userId) headers['x-user-id'] = userId;

      try {
        const upstream = await fetch(TARGET + target, {
          method: req.method,
          headers,
          body: req.method === 'GET' || req.method === 'HEAD' ? undefined : (body.length ? body : undefined),
        });
        res.status(upstream.status);
        upstream.headers.forEach((val, key) => {
          if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key)) res.setHeader(key, val);
        });
        res.send(Buffer.from(await upstream.arrayBuffer()));
      } catch {
        res.status(502).json({ error: 'Gateway upstream error' });
      }
    })();
  });
});

app.listen(PORT, () => {
  console.log('[gateway] http://localhost:' + PORT + ' -> ' + TARGET);
});
