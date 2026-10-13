import { Schema, model, InferSchemaType } from 'mongoose';

const matchSchema = new Schema({
  title: { type: String, required: true },
  venue: { type: String, required: true },
  gradient: { type: [String], default: [] },
  level: { type: String, enum: ['Trung cap', 'Moi trinh do', 'Nang cao'], required: true },
  joined: { type: Number, default: 1 },
  capacity: { type: Number, required: true },
  note: { type: String },
  createdBy: { type: String, required: true, index: true },
}, { timestamps: true });

export type Match = InferSchemaType<typeof matchSchema>;
export const MatchModel = model('Match', matchSchema);
