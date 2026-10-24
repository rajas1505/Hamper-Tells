const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const autoSeed = require('./utils/autoSeed');

const runSeed = async () => {
  try {
    await connectDB();
    await autoSeed();
    console.log('✅ [Seed] All collections initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed] Error:', error);
    process.exit(1);
  }
};

runSeed();
