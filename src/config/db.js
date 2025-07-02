const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("MONGODB_URI not set in environment variables.");
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Do not crash app, just log and continue
    console.error("MongoDB connection error:", error.message);
  }
};

module.exports = connectDB;
