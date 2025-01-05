import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ success: false, message: "NO TOKEN" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "FAILED TO DECODED" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("FAILED TO VERIFY TOKEN ❌", error.message);
    return res
      .status(500)
      .json({ success: false, message: `FAILED TO VERIFY ${error.message}` });
  }
};
