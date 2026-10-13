import { Schema, model } from 'mongoose';

// Mongoose model cho "auth" — điền field theo docs/database.md.
const authSchema = new Schema({}, { timestamps: true });

export const AuthModel = model('Auth', authSchema);
