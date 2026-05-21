import mongoose from 'mongoose';

export async function connectMongo() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/storyverse_ai';
  mongoose.set('strictQuery', true);


  // Log a safe hint about the connection (no credentials).
  try {
    const host = uri.replace(/\/\/.*?:.*?@/, '//***:***@').split('/')[2];
    console.log('Using MongoDB host:', host || 'unknown');
  } catch {
    // ignore
  }

  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err?.message || err);
    err.isMongoUnavailable = true;
    throw err;
  }
}




