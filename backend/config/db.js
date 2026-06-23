const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

/**
 * Connect to an in-memory MongoDB instance.
 * No external database setup required — data lives in memory
 * and resets when the server restarts.
 */
const connectDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);

    console.log(`✅ MongoDB connected (in-memory): ${uri}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

/**
 * Gracefully stop the in-memory MongoDB server.
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error("Error disconnecting from database:", error.message);
  }
};

module.exports = { connectDB, disconnectDB };
