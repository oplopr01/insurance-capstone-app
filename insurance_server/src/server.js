import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectToDb from "./config/db.js";
connectToDb();

app.listen(process.env.PORT, () => {
    console.log("Server running");
})

app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));