import { Schema, model, InferSchemaType } from 'mongoose';

// Mongoose model cho "venues" — field theo docs/database.md + kiểu Venue của mobile.
const venueSchema = new Schema(
  {
    name: { type: String, required: true },
    sport: { type: String, enum: ['pickle', 'gym', 'football'], required: true, index: true },
    district: { type: String, required: true, index: true },
    distanceKm: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    priceLabel: { type: String, required: true },
    heroTag: { type: String },
    pricePerHour: { type: Number },
    courts: { type: Number },
    openTime: { type: String },
    closeTime: { type: String, default: '22:00' },
    amenities: { type: [String], default: [] },
    about: { type: String },
    gradient: { type: [String], default: [] },
  },
  { timestamps: true },
);

export type Venue = InferSchemaType<typeof venueSchema>;
export const VenueModel = model('Venue', venueSchema);
