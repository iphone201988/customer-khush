import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import OTP from "otp-generator";
import { sendMail } from "../utils/sendmail.js";

export async function registerUser(req, res) {
  console.log(req.body);
  try {
    const { name, email, password, role } = req.body;
    console.log("2");
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const otp = OTP.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      alphabets: false,
    });
    user.otpForVerify = otp;
    user.otpForVerifyExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const message = `Your Reset OTP is ${otp}\n It Will Expire in 15 min`;
    await sendMail({
      to: user.email,
      subject: "Reset Password OTP",
      text: message,
    });
    return res.status(200).json({
      message: "OTP sent to your mail please verify for Login",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    if(!user.isVerified){
      return res.status(400).json({
        message:"Verify First"
      })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }
    const token = JWT.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET
    );
    return res.status(200).json({
      message: "Successfully Login",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function forgetPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const otp = OTP.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      alphabets: false,
    });
    user.otpForVerify= otp;
    user.otpForVerifyExpires= Date.now() + 15 * 60 * 1000;
    await user.save();

    const message = `Your Reset OTP is ${otp}\n It Will Expire in 15 min`;
    await sendMail({
      to: user.email,
      subject: "Reset Password OTP",
      text: message,
    });
    return res.status(200).json({
      message: "OTP Sent to Mail",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    if (user.otpForVerifyExpires < Date.now()) {
      return res.status(400).json({
        message: "Otp expire",
      });
    }
    if (user.otpForVerify != otp) {
      return res.status(400).json({
        message: "Otp is incorrect",
      });
    }

    user.otpForVerify= undefined;
    user.otpForVerifyExpires= undefined;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ 
      message: "OTP is correct",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    if (!user.verifyOtp) {
      return res.status(400).json({
        message: "verify otp first",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "password reset successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function allDriver(req, res) {
  try {
    const role = req.user.role;
    const user = await User.find({ role: "Driver" });
    return res.status(200).json({
      message: "All Driver",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}
