import { Schema, model, InferSchemaType } from 'mongoose';

const bookingSchema = new Schema({
  userId: { type: String, required: true, index: true },
  code: { type: String, required: true },
  sport: { type: String, enum: ['pickle', 'gym', 'football'], required: true },
  venueName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  priceLabel: { type: String },
  coach: { type: String },
  status: { type: String, enum: ['upcoming', 'past'], default: 'upcoming', index: true },
}, { timestamps: true });

export type Booking = InferSchemaType<typeof bookingSchema>;
export const BookingModel = model('Booking', bookingSchema);
