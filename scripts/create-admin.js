const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  // Your MongoDB URI
  const uri = "mongodb+srv://Propsk:123@cluster0.4iahnnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db();
    const users = db.collection('users');
    
    // Check if admin exists
    const adminExists = await users.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin already exists');
      return;
    }
    
    // Hash password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin user
    await users.insertOne({
      email: 'admin@example.com',
      username: 'Admin',
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Admin user created successfully with email: admin@example.com and password: admin123');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

createAdmin();