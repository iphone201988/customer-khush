export const errorMiddleware = async (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal server error";
  
    if (error.message === "jwt expired") {
      error.message = "Please login again.";
      error.statusCode = 401;
    }

    if (error?.code === 11000) {
        error.message = "user Already exist";
        error.statusCode = 401;
      }

    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  };    