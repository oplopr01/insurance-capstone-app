import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000
    });

    await mongoose.connection.db.admin().ping(); // 🔥 FORCE FULL READY

    console.log("MongoDB Connected:", mongoose.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectToDb;