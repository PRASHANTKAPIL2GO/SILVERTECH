const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using the URI from environment variables.
 * Uses Mongoose's built-in connection pooling and exits the process on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure so the server does not start in a broken state
    process.exit(1);
  }
};

module.exports = connectDB;
