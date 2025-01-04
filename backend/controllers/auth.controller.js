import { User } from "../models/User.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  try {
    // 유저로부터 정보 받아오기
    const { email, password, name } = req.body;
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
    return res.status(400).json({
      success: false,
      message: `Failed to Sign up : ${error?.message}`,
    });
  }
};

export const login = async () => {};

export const logout = async () => {};
