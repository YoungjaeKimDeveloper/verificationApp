import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = async (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true, //XSS
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // token
    return token;
  } catch (error) {
    console.error("FAILED TO GENERATE TOKEN", error.message);
    return res.status(400).json({
      success: false,
      message: `Failed to generate a Token ${error.message}`,
    });
  }
};
