import { Schema, model, models } from 'mongoose';

// Allowed workspace categories
export const WORKSPACE_TYPES = [
  'Hot Desk',
  'Dedicated Desk',
  'Private Office',
  'Meeting Room',
  'Whole Office',
];

const PropertySchema = new Schema(
  {
    // ----- Ownership -----
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ----- Core details -----
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: WORKSPACE_TYPES,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // ----- Location -----
    location: {
      street: String,
      city: { type: String, required: true },
      state: String,
      zipcode: String,
    },

    // ----- Capacity & size -----
    desk_capacity: {
      type: Number,
      required: true,
      min: 0,
    },
    rooms: {
      type: Number,
      required: true,
      min: 0,
    },
    square_feet: {
      type: Number,
      required: true,
      min: 0,
    },

    // ----- Amenities -----
    amenities: [String],

    // ----- Rates -----
    rates: {
      daily: { type: Number, min: 0 },
      weekly: { type: Number, min: 0 },
      monthly: { type: Number, min: 0 },
    },

    // ----- Contact -----
    contact: {
      name: String,
      email: String,
      phone: String,
    },

    // ----- Media -----
    images: [String],

    // ----- Flags -----
    is_featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Property = models.Property || model('Property', PropertySchema);

export default Property;