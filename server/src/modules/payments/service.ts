import { ApiError } from '../../middleware/errorHandler.js';
import { publish } from '../../events/bus.js';
import { PaymentModel } from './model.js';
import type { CreatePaymentBody } from './schema.js';

export async function create(userId: string, data: CreatePaymentBody) {
  const code = 'PM' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const doc = await PaymentModel.create({ ...data, userId, code, status: 'pending' });
  return doc.toObject();
}

export async function getById(userId: string, id: string) {
  const p = await PaymentModel.findOne({ _id: id, userId }).lean().catch(() => null);
  if (!p) throw new ApiError(404, 'Khong tim thay don thanh toan');
  return p;
}

export async function confirm(userId: string, id: string) {
  const p = await PaymentModel.findOneAndUpdate(
    { _id: id, userId }, { status: 'confirmed' }, { new: true },
  ).lean().catch(() => null);
  if (!p) throw new ApiError(404, 'Khong tim thay don thanh toan');
  // Phat su kien cho cac domain khac (vd booking.activated) qua event bus.
  await publish('payment.confirmed', { paymentId: id, userId, purpose: p.purpose, refType: p.refType, refId: p.refId });
  return p;
}
