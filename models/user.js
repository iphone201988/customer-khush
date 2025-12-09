import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Customer", "Driver"],
      default: "Driver",
    },
    profilePhoto:{
      type:String
    },
    otpForVerify: {
      type: String,
    },
    otpForVerifyExpires: {
      type: Date,
    },
    verifyOtp: {
      type: Boolean,
    },
    isVerified:{
      type:Boolean
    },
    verifyFor:{
      type:String,
      enum:["forRegister","forForgetPassword"],
      default:"forRegister"
    }
  },
  { timestamps: true }
);

export const User =  model("user", userSchema);
