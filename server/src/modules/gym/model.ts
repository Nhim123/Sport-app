import { Schema, model, InferSchemaType } from 'mongoose';

const membershipSchema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  brand: { type: String, required: true },
  plan: { type: String, required: true },
  memberName: { type: String, required: true },
  memberCode: { type: String, required: true },
  daysLeft: { type: Number, default: 0 },
  expiry: { type: String },
  active: { type: Boolean, default: true },
  packageType: { type: String },
  checkinsThisMonth: { type: Number, default: 0 },
  branch: { type: String },
}, { timestamps: true });

const dayPassSchema = new Schema({
  userId: { type: String, required: true, index: true },
  kind: { type: String, enum: ['personal', 'club'], default: 'personal' },
  brand: { type: String, required: true },
  passCode: { type: String, required: true },
  priceLabel: { type: String, required: true },
  validDate: { type: String, required: true },
  branch: { type: String },
  venue: { type: String },
  address: { type: String },
  entriesLeft: { type: Number, default: 1 },
  status: { type: String, enum: ['booking', 'active'], default: 'active' },
}, { timestamps: true });

export type Membership = InferSchemaType<typeof membershipSchema>;
export type DayPass = InferSchemaType<typeof dayPassSchema>;
export const MembershipModel = model('Membership', membershipSchema);
export const DayPassModel = model('DayPass', dayPassSchema);
