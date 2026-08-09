import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      console.warn('[MongoDB] MONGODB_URI not provided. Server will run in instant fallback mode.');
      return;
    }
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn('[MongoDB] Connection failed. Application running in instant fallback mode:', (error as any).message);
  }
};
