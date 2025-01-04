import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.info("MONGO CONNECTED ✅");
  } catch (error) {
    console.error("FAILED TO CONNECT DB ❌", error.message);
    // failure  status code is success
    // failure status code 0 means failure
    process.exit(1);
  }
};
