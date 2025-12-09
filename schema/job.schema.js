import Joi from "joi";

export const createJobSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.base": "Title must be a text",
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters",
    "any.required": "Title is required",
  }),

  pickup: Joi.string().required().messages({
    "string.empty": "Pickup location is required",
    "any.required": "Pickup location is required",
  }),

  drop: Joi.string().required().messages({
    "string.empty": "Drop location is required",
    "any.required": "Drop location is required",
  }),

  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be greater than 0",
    "any.required": "Amount is required",
  }),
});

export const applyJobParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    "string.length": "Invalid job id",
    "string.hex": "Invalid job id format",
    "any.required": "Job id is required",
  }),
});

export const selectDriverQuerySchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    "string.length": "Invalid job id",
    "string.hex": "Invalid job id format",
    "any.required": "Job id is required",
  }),

  driverId: Joi.string().length(24).hex().required().messages({
    "string.length": "Invalid driver id",
    "string.hex": "Invalid driver id format",
    "any.required": "Driver id is required",
  }),
});

export const taskCompleteQuerySchema = Joi.object({
  id: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.base": "Job ID must be a string",
      "string.length": "Invalid Job ID",
      "string.hex": "Job ID format is invalid",
      "any.required": "Job ID is required"
    })
});
