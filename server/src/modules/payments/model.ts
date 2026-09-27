import { Schema, model, InferSchemaType } from 'mongoose';

const paymentSchema = new Schema({
  userId: { type: String, required: true, index: true },
  purpose: { type: String, enum: ['court', 'daypass', 'club'], required: true },
  title: { type: String, required: true },
  brand: { type: String, required: true },
  priceLabel: { type: String, required: true },
  code: { type: String, required: true },
  refType: { type: String },
  refId: { type: String },
  fixedTime: { type: String },
  status: { type: String, enum: ['pending', 'confirmed'], default: 'pending', index: true },
}, { timestamps: true });

export type Payment = InferSchemaType<typeof paymentSchema>;
export const PaymentModel = model('Payment', paymentSchema);
