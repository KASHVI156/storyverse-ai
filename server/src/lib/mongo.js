import mongoose from 'mongoose';

function sanitizeMongoHost(uri) {
  try {
    return uri.replace(/\/\/.*?:.*?@/, '//***:***@').split('/')[2] || 'unknown';
  } catch {
    return 'unknown';
  }
}

export function getMongoConfig() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || '';
  const usingFallback = !uri && process.env.NODE_ENV !== 'production';
  const resolvedUri = uri || 'mongodb://127.0.0.1:27017/storyverse_ai';

  return {
    uri: resolvedUri,
    hasMongoDbUri: Boolean(process.env.MONGODB_URI),
    hasMongoUri: Boolean(process.env.MONGO_URI),
    usingFallback,
    host: sanitizeMongoHost(resolvedUri),
  };
}

export async function connectMongo() {
  const config = getMongoConfig();
  const uri = config.uri;
  mongoose.set('strictQuery', true);

  console.log('MongoDB env check:', {
    hasMONGODB_URI: config.hasMongoDbUri,
    hasMONGO_URI: config.hasMongoUri,
    usingFallback: config.usingFallback,
    host: config.host,
    nodeEnv: process.env.NODE_ENV || 'development',
  });

  if (!process.env.MONGODB_URI && !process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
    const err = new Error('MONGODB_URI or MONGO_URI is required in production');
    err.isMongoUnavailable = true;
    err.mongoStatus = {
      ok: false,
      host: null,
      hasMONGODB_URI: false,
      hasMONGO_URI: false,
      message: err.message,
    };
    throw err;
  }

  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    console.log('MongoDB connected:', { host: config.host });
    return {
      ok: true,
      host: config.host,
      hasMONGODB_URI: config.hasMongoDbUri,
      hasMONGO_URI: config.hasMongoUri,
      usingFallback: config.usingFallback,
      message: 'connected',
    };
  } catch (err) {
    console.error('MongoDB connection error:', {
      host: config.host,
      message: err?.message || String(err),
      name: err?.name,
      code: err?.code,
    });
    err.isMongoUnavailable = true;
    err.mongoStatus = {
      ok: false,
      host: config.host,
      hasMONGODB_URI: config.hasMongoDbUri,
      hasMONGO_URI: config.hasMongoUri,
      usingFallback: config.usingFallback,
      message: err?.message || 'MongoDB connection error',
      name: err?.name,
      code: err?.code,
    };
    throw err;
  }
}




