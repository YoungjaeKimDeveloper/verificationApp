import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
// Local Package
import { User } from "../models/User.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendSuccessEmail,
  sendResetPasswordCode,
} from "../mailtrap/emails.js";

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("FAILE TO check AUTH", error.message);
    return res.status(500).json({
      success: false,
      message: `FAILED TO CHECKAUTH ${error.message}`,
    });
  }
};

export const signup = async (req, res) => {
  console.log("요청받은 데이터");
  console.log(req.body);
  try {
    // 유저로부터 정보 받아오기
    const { email, name, password } = req.body;
    if (!email || !password || !name) {
      throw new Error("PLEASE FILL UP THE ALL FORMS ❌");
    }
    // 현재 이메일과 중복되는지 확인하기
    const existedUser = await User.findOne({ email: email });
    if (existedUser) {
      throw new Error("Email Existed ❌");
    }
    // DB에 저장하기전에 Password 해싱해주기
    const hashedPassword = await bcrypt.hash(password, 10);
    // 1회용 MFA CODE
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = await User.create({
      email: email,
      name: name,
      password: hashedPassword,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // JWT(쿠키에 JWT 발행해주기)
    generateTokenAndSetCookie(res, newUser._id);
    // E-mail verification
    await sendVerificationEmail(newUser.email, verificationToken);

    // 응답으로 보낼때는 Password 가리고 보내주기
    return res.status(201).json({
      message: "New User has been created",
      newUser: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error(`FAILED TO SIGN UP: ❌${error?.message}`);
    return res.status(500).json({
      success: false,
      message: `Failed to Sign up : ${error?.message}`,
    });
  }
};

export const verifyEmail = async (req, res) => {
  console.error("=====VERIFY EMAIL CALLED======");
  const { verificaionCode } = req.body;
  console.error("요청받은 데이터", req.body);
  console.error("VERIFY EMAIL CALLED");
  // Verify with sent code

  console.info("VERIFY CODE IN BACKEND", verificaionCode);
  // 이 code를 가진 User를 찾으면 그걸로 verify되는거임
  try {
    const user = await User.findOne({
      verificationToken: verificaionCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
    // After update the uesr;s verification
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    // Save the data base
    await user.save();
    // Send Welcome Email
    // await sendWelcomeEmail(user.email, user.name);
    return res
      .status(200)
      .json({ success: true, message: "Succeed in verifying Email Token" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to verify Email Token ${error.message}`,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  // SEND THE RESPONSE TO THE FRONT-END
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "PLEASE FILL UP THE ALL FORMS" });
  }
  // FIND THE USER
  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "CANNOT FIND THE USER" });
  }
  // Compare(PlainText,hashedPassword)
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ success: false, message: "INVALID ACCESS" });
  }
  generateTokenAndSetCookie(res, user._id);
  user.lastLogin = Date.now();
  await user.save();
  return res.status(200).json({
    success: true,
    message: `WELCOME ${user.name}`,
    user: {
      ...user.doc,
      password: undefined,
    },
  });
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "NO USER TO LOGOUT" });
    }
    res.clearCookie("token");
    return res.status(200).json({ succesS: true, message: "User Logout ✅" });
  } catch (error) {
    console.error("FAILED TO LOGOUT ❌", error.message);
    return res.status(500).json({
      success: false,
      message: `FAILED TO LOGOUT ❌ ${error.message}`,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "PLEASE WRITE THE EMAIL" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "CANNOT FIND THE USER" });
    }
    // Generate reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpireAt = Date.now() + 1000 * 60 * 60 * 1; // 1hour
    await user.save();
    // Send Email
    const localAddress = process.env.Local_URL;
    await sendResetPasswordCode(
      user.email,
      `${localAddress}/reset-password/${resetToken}`
    );
    return res
      .status(200)
      .json({ success: true, message: "SENDING ForgotPassword ✅" });
  } catch (error) {
    console.error("FAILED TO SEND ForotPassword Code ❌");
    return res.status(400).json({
      success: false,
      message: `Failed To send ForgotPassword ❌  ${error.message}`,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpireAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "CANNOT FIND THE USER" });
    }
    // update Password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;
    await user.save();
    await sendSuccessEmail(user.email);

    return res
      .status(200)
      .json({ success: true, message: "USER PASSWORD HAS BEEN UPDATED" });
  } catch (error) {
    console.error("FAILED TO UPDATED PASSWORD", error.message);
    return res.status(500).json({
      success: false,
      message: `FAILED TO UPDATE PROFILE : ${error.message}`,
    });
  }
};
