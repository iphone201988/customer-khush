import express from "express";
import { validation } from "../middleware/validation.js";
import { registerUserSchema,loginUserSchema,verifyOtpSchema,forgetPasswordSchema,resetPasswordSchema } from "../schema/user.schema.js";
import { forgetPassword, loginUser, registerUser, resetPassword, verifyOtp } from "../controllers/user.js";
import { upload } from "../middleware/multer.js";

const userRouter = express.Router()

userRouter.post('/registerUser',upload.single("image"),validation(registerUserSchema),registerUser)
userRouter.get('/loginUser',validation(loginUserSchema),loginUser)
userRouter.post('/forgetPassword',validation(forgetPasswordSchema),forgetPassword)
userRouter.post('/verifyOtp',validation(verifyOtpSchema),verifyOtp)
userRouter.post('/resetPassword',validation(resetPasswordSchema),resetPassword)

export default userRouter