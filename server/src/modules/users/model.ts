import { Schema, model } from 'mongoose';

// Mongoose model cho "users" — điền field theo docs/database.md.
const usersSchema = new Schema({}, { timestamps: true });

export const UsersModel = model('Users', usersSchema);
