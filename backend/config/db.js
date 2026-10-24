const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hampertells';
  
  try {
    // Attempt standard connection with 3 sec timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Standard MongoDB connection failed (${error.message}).`);
    console.log('[Database] Starting embedded MongoMemoryServer for standalone zero-setup execution...');
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] Connected to MongoMemoryServer: ${conn.connection.host}`);
    } catch (memError) {
      console.error('[Database] MongoMemoryServer error:', memError);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
