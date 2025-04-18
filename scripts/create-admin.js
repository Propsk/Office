// scripts/create-admin.js
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  image: String,
  isAdmin: Boolean,
  bookmarks: [mongoose.Schema.Types.ObjectId],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Hash password
    const password = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const admin = new User({
      email: 'admin@example.com',
      username: 'Admin',
      password,
      isAdmin: true,
    });
    
    await admin.save();
    console.log('Admin user created successfully');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();