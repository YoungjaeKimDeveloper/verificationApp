import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/connectDB.js";
import authRoutes from "./routes/auth.route.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT;
//
app.use(express.json()); // allows us to parse incoming request requests: req.body
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.info(`SERVER IS RUNNING ${PORT}`);
});
