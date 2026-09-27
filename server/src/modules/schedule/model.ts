import { Schema, model, InferSchemaType } from 'mongoose';

const weekEventSchema = new Schema({
  userId: { type: String, required: true, index: true },
  dayKey: { type: String, required: true },
  time: { type: String, required: true },
  title: { type: String, required: true },
  place: { type: String, required: true },
  sport: { type: String, enum: ['pickle', 'gym', 'football'], required: true },
  status: { type: String, enum: ['done', 'planned'], default: 'planned' },
  forClub: { type: String },
}, { timestamps: true });

export type WeekEvent = InferSchemaType<typeof weekEventSchema>;
export const WeekEventModel = model('WeekEvent', weekEventSchema);
