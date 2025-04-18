// models/User.js
import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists'],
    required: [true, 'Email is required']
  },
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  password: {
    type: String
  },
  image: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Property'
    }
  ]
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models.User || model('User', UserSchema);
export default User;