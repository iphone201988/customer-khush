import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import OTP from "otp-generator";
import { sendMail } from "../utils/sendmail.js";
import { ErroHandler } from "../utils/errorHandler.js";

export async function registerUser(req, res,next) {
  console.log("hiiiiii",req.file);
  try {
    const { name, email, password, role } = req.body;
    console.log("2");
    let profilePhoto = null
    if(req.file){
      profilePhoto =`image/${req.file.filename}`
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profilePhoto
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
    // return res.status(400).json({
    //   error: error.message,
    // });
    next(error)
  }
}

export async function loginUser(req, res,next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // return res.status(400).json({
      //   message: "User not found",
      // });
      return next(new ErroHandler("User Not Found", 400))
    }
    if(!user.isVerified){
      // Send otp here so that user can verify
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
      })
      return res.status(400).json({
        message:"otp sent to your mail please verify First"
      })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      // return res.status(400).json({
      //   message: "Password is incorrect",
      // });
      return next(new ErroHandler("Password is incorrect", 400))
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
    // return res.status(400).json({
    //   error: error.message,
    // });
    next(error)
  }
}

export async function forgetPassword(req, res,next) {
  try { 
    const { email } = req.body;
    const user = await User.findOne({ email });
    user.verifyFor ="forForgetPassword"
    if (!user) {
      // return res.status(400).json({
      //   message: "User not found",
      // });
      return next(new ErroHandler("User Not Found", 400))
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
    // return res.status(400).json({
    //   error: error.message,
    // });
    next(error)
  }
}

export async function verifyOtp(req, res ,next) {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // return res.status(400).json({
      //   message: "User not found",
      // });
      return next(new ErroHandler("User Not Found", 400))
    }
    if (user.otpForVerifyExpires < Date.now()) {
      // return res.status(400).json({
      //   message: "Otp expire",
      // });
      return next(new ErroHandler("OTP expire", 400))
    }
    if (user.otpForVerify != otp) {
      // return res.status(400).json({
      //   message: "Otp is incorrect",
      // });
      return next(new ErroHandler("Otp is incorrect", 400))
    }

    user.otpForVerify= undefined;
    user.otpForVerifyExpires= undefined;
    if(user.verifyFor === "forForgetPassword"){
      user.verifyOtp = true
    }else{
      user.isVerified = true;
    }
    await user.save();

    return res.status(200).json({ 
      message: "OTP is correct",
    });
  } catch (error) {
    // return res.status(400).json({
    //   error: error.message,
    // });
    next(error)
  }
}

export async function resetPassword(req, res,next) {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // return res.status(400).json({
      //   message: "User not found",
      // });
      return next(new ErroHandler("User Not Found", 400))
    }
    if (!user.verifyOtp) {
      // return res.status(400).json({
      //   message: "verify otp first",
      // });
      return next(new ErroHandler("Verify otp first", 400))
    }
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "password reset successfully",
    });
  } catch (error) {
  //   return res.status(400).json({
  //     error: error.message,
  //   });
  next(error)
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

