import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectToDb from "./config/db.js";

const startServer = async () => {
  try {
    await connectToDb(); // ✅ MUST succeed first

    app.listen(process.env.PORT, () => {
      console.log("Server running on port", process.env.PORT);
    });

  } catch (error) {
    console.error("Server failed:", error);
  }
};

startServer();