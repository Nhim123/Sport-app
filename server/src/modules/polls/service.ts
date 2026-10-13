import { ApiError } from '../../middleware/errorHandler.js';
import { PollModel, PollVoteModel } from './model.js';
import type { CreatePollBody, VoteBody } from './schema.js';

export async function listByClub(clubId: string) {
  const items = await PollModel.find({ clubId }).sort({ pinned: -1, createdAt: -1 }).lean();
  return { items };
}

export async function getById(id: string) {
  const p = await PollModel.findById(id).lean().catch(() => null);
  if (!p) throw new ApiError(404, 'Khong tim thay binh chon');
  return p;
}

// TODO(G1/clubs): chi owner/admin cua CLB moi duoc tao — enforce khi tach service/gateway.
export async function create(userId: string, data: CreatePollBody) {
  const options = data.options.map((label, i) => ({ id: 'p' + (i + 1), label, votes: 0 }));
  const doc = await PollModel.create({
    clubId: data.clubId, title: data.title, note: data.note, dayKey: data.dayKey,
    options,
    allowMultiple: data.allowMultiple ?? false,
    allowAddOption: data.allowAddOption ?? false,
    anonymous: data.anonymous ?? false,
    hideResults: data.hideResults ?? false,
    createdBy: userId,
  });
  return doc.toObject();
}

export async function vote(userId: string, pollId: string, body: VoteBody) {
  const poll = await PollModel.findById(pollId).catch(() => null);
  if (!poll) throw new ApiError(404, 'Khong tim thay binh chon');

  const valid = new Set(poll.options.map((o) => o.id));
  let chosen = body.optionIds.filter((id) => valid.has(id));
  if (!chosen.length) throw new ApiError(400, 'Phuong an khong hop le');
  if (!poll.allowMultiple) chosen = [chosen[0]];

  const prev = await PollVoteModel.findOne({ pollId, userId });
  if (prev) {
    for (const o of poll.options) if (prev.optionIds.includes(o.id)) o.votes = Math.max(0, o.votes - 1);
    prev.optionIds = chosen;
    await prev.save();
  } else {
    await PollVoteModel.create({ pollId, userId, optionIds: chosen });
  }
  for (const o of poll.options) if (chosen.includes(o.id)) o.votes += 1;
  await poll.save();

  return { ...poll.toObject(), myVotes: chosen };
}
