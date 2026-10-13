import { redis } from '../config/redis.js';

// Event bus dung Redis Streams (XADD/XREADGROUP) cho su kien cheo domain.
export const EVENTS_STREAM = 'sportapp:events';

export interface DomainEvent<T = unknown> { id: string; type: string; data: T }

export async function publish(type: string, data: unknown, stream: string = EVENTS_STREAM): Promise<string | null> {
  return redis.xadd(stream, '*', 'type', type, 'data', JSON.stringify(data ?? null));
}

function fieldsToObj(fields: string[]): Record<string, string> {
  const obj: Record<string, string> = {};
  for (let i = 0; i + 1 < fields.length; i += 2) obj[fields[i]] = fields[i + 1];
  return obj;
}
function parse(s: string | undefined): unknown {
  if (!s) return null;
  try { return JSON.parse(s); } catch { return s; }
}
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Dang ky consumer group, doc lien tuc (BLOCK) va xu ly tung su kien.
export async function subscribe(
  group: string,
  consumer: string,
  handler: (evt: DomainEvent) => Promise<void> | void,
  stream: string = EVENTS_STREAM,
): Promise<void> {
  const sub = redis.duplicate();
  try { await sub.connect(); } catch { /* co the da connect */ }
  try { await sub.xgroup('CREATE', stream, group, '$', 'MKSTREAM'); } catch { /* BUSYGROUP: group da ton tai */ }

  void (async () => {
    for (;;) {
      try {
        const res = (await sub.xreadgroup(
          'GROUP', group, consumer, 'COUNT', 10, 'BLOCK', 5000, 'STREAMS', stream, '>',
        )) as [string, [string, string[]][]][] | null;
        if (!res) continue;
        for (const [, entries] of res) {
          for (const [id, fields] of entries) {
            const obj = fieldsToObj(fields);
            const evt: DomainEvent = { id, type: obj.type, data: parse(obj.data) };
            try { await handler(evt); await sub.xack(stream, group, id); }
            catch (err) { console.error('[eventbus] handler error:', evt.type, err); }
          }
        }
      } catch (err) {
        console.error('[eventbus] read error:', err);
        await delay(1000);
      }
    }
  })();
}
