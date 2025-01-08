import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// Local File
import { connectDB } from "./lib/connectDB.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json()); // allows us to parse incoming request requests: req.body
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.info(`SERVER IS RUNNING ${PORT}`);
});
