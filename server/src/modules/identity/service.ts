import jwt, { type SignOptions } from 'jsonwebtoken';
import { rsaPrivateKey, rsaPublicKey, KEY_ID, publicJwk } from '../../config/keys.js';

// JWKS cong khai de service khac tu verify token RS256.
export function jwks() {
  return { keys: [publicJwk()] };
}

export function signRs256(payload: object, expiresIn: SignOptions['expiresIn'] = '7d'): string {
  return jwt.sign(payload, rsaPrivateKey, { algorithm: 'RS256', keyid: KEY_ID, expiresIn });
}

export function verifyRs256<T = unknown>(token: string): T {
  return jwt.verify(token, rsaPublicKey, { algorithms: ['RS256'] }) as T;
}
