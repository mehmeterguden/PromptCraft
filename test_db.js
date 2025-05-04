import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('Trying to connect to:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connection successful!');
    
    // Test user schema
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      username: String,
      score: Number,
      currentLevel: Number,
      completedLevels: [Number]
    }));

    // Create test user
    const testUser = await User.create({
      username: 'test_user',
      score: 100,
      currentLevel: 5,
      completedLevels: [1, 2, 3, 4]
    });

    console.log('Test user created:', testUser);

    // Find the test user
    const foundUser = await User.findOne({ username: 'test_user' });
    console.log('Found test user:', foundUser);

    // Delete test user
    await User.deleteOne({ username: 'test_user' });
    console.log('Test user deleted');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection(); 