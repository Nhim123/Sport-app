import { subscribe, type DomainEvent } from './bus.js';

// Consumer cheo domain (modular monolith): 1 nhom worker doc Redis Streams.
// Khi tach microservice, moi service co worker rieng cua no.
export async function startWorkers(): Promise<void> {
  await subscribe('sportapp-workers', 'worker-1', async (evt: DomainEvent) => {
    switch (evt.type) {
      case 'payment.confirmed':
        // TODO: kich hoat booking/ve tuong ung -> phat 'booking.activated'
        console.log('[worker] payment.confirmed', evt.data);
        break;
      default:
        break;
    }
  });
  console.log('[worker] event consumer started');
}
