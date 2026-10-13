import { Schema, model, InferSchemaType } from 'mongoose';

const optionSchema = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  votes: { type: Number, default: 0 },
}, { _id: false });

const pollSchema = new Schema({
  clubId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  note: { type: String },
  dayKey: { type: String },
  closesLabel: { type: String },
  options: { type: [optionSchema], default: [] },
  allowMultiple: { type: Boolean, default: false },
  allowAddOption: { type: Boolean, default: false },
  anonymous: { type: Boolean, default: false },
  hideResults: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  createdBy: { type: String, required: true },
}, { timestamps: true });

const pollVoteSchema = new Schema({
  pollId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  optionIds: { type: [String], default: [] },
}, { timestamps: true });

export type Poll = InferSchemaType<typeof pollSchema>;
export const PollModel = model('Poll', pollSchema);
export const PollVoteModel = model('PollVote', pollVoteSchema);
