import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000
    });

    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:");
    console.error(error.message);

    process.exit(1); // stop server if DB fails
  }
};

export default connectToDb;