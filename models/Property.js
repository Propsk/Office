import { Schema, model, models } from 'mongoose';

// Allowed workspace categories
export const WORKSPACE_TYPES = [
  'Private Office',
  'Coworking Desk',
  'Meeting Room',
  'Event Space',
];

const PropertySchema = new Schema(
  {
    // ----- Ownership -----
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    // ----- Core details -----
    name: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: WORKSPACE_TYPES,
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
      min: 0,
    },

    rooms: {
      type: Number,
      min: 0,
    },

    square_feet: {
      type: Number,
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

    // Add approval status
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    
    // Add approval notes
    approvalNotes: {
      type: String,
      default: ''
    },

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