// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log to console for development
  console.error(err.stack.red);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, token failed'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Session expired, please log in again'
    });
  }

  // Default to 500 server error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

export default errorHandler;
