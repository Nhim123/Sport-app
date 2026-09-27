import { generateKeyPairSync, createPublicKey, type JsonWebKey } from 'crypto';

// Cap khoa RS256 cho Identity/JWKS. Uu tien PEM tu env (JWT_PRIVATE_KEY/JWT_PUBLIC_KEY);
// khong co thi tao tam khi khoi dong (chi dung cho dev — production phai cap qua env/secret).
function loadOrGenerate(): { privateKey: string; publicKey: string } {
  const priv = process.env.JWT_PRIVATE_KEY;
  const pub = process.env.JWT_PUBLIC_KEY;
  if (priv && pub) return { privateKey: priv, publicKey: pub };
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { privateKey, publicKey };
}

const keys = loadOrGenerate();
export const KEY_ID = process.env.JWT_KID ?? 'sportapp-key-1';
export const rsaPrivateKey = keys.privateKey;
export const rsaPublicKey = keys.publicKey;

export function publicJwk(): JsonWebKey & { kid: string; use: string; alg: string } {
  const jwk = createPublicKey(rsaPublicKey).export({ format: 'jwk' }) as JsonWebKey;
  return { ...jwk, kid: KEY_ID, use: 'sig', alg: 'RS256' };
}

// JWKS document cong khai (dung cho routes/jwks.ts va modules/identity).
export function jwks(): { keys: Array<ReturnType<typeof publicJwk>> } {
  return { keys: [publicJwk()] };
}
