import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectToDb from "./config/db.js";

// cache DB connection across requests (VERY IMPORTANT)
let isConnected = false;

const handler = async (req, res) => {
  try {
    // connect DB only once
    if (!isConnected) {
      await connectToDb();
      isConnected = true;
    }

    // pass request to express app
    return app(req, res);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;