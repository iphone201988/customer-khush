import Joi from "joi";

/* ---------------- REGISTER ---------------- */
export const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "Name must be a text",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must be less than 50 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).max(128).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must be less than 128 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),

  role: Joi.string().valid("Customer", "Driver").required().messages({
    "any.only": "Role must be Customer or Driver",
    "string.empty": "Role is required",
    "any.required": "Role is required",
  }),
});

/* ---------------- LOGIN ---------------- */
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

/* ---------------- FORGET PASSWORD ---------------- */
export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
});

/* ---------------- VERIFY OTP ---------------- */
export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "string.empty": "OTP is required",
      "any.required": "OTP is required",
    }),
});

/* ---------------- RESET PASSWORD ---------------- */
export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  newPassword: Joi.string().min(6).max(128).required().messages({
    "string.min": "New password must be at least 6 characters",
    "string.max": "New password must be less than 128 characters",
    "string.empty": "New password is required",
    "any.required": "New password is required",
  }),
});
