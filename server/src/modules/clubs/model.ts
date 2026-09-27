import { Schema, model, InferSchemaType } from 'mongoose';

const clubSchema = new Schema({
  name: { type: String, required: true },
  sports: { type: [String], enum: ['pickle', 'gym', 'football'], default: [] },
  gradient: { type: [String], default: [] },
  members: { type: Number, default: 1 },
  note: { type: String },
  code: { type: String, required: true, unique: true, index: true },
}, { timestamps: true });

const clubMembershipSchema = new Schema({
  clubId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
}, { timestamps: true });

export type Club = InferSchemaType<typeof clubSchema>;
export type ClubMembership = InferSchemaType<typeof clubMembershipSchema>;
export const ClubModel = model('Club', clubSchema);
export const ClubMembershipModel = model('ClubMembership', clubMembershipSchema);
