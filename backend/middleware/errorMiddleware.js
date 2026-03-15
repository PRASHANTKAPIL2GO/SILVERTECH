/**
 * Error Handling Middleware
 *
 * Centralised error handler — must be registered LAST in Express middleware chain.
 * Handles Mongoose validation errors, duplicate key errors, JWT errors, and generic errors.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error (e.g. required field missing)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(', ');
  }

  // MongoDB duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `A user with this ${field} already exists.`;
  }

  // Mongoose bad ObjectId (e.g. malformed _id in URL)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  }

  // Log full error stack only in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * 404 Not Found handler — catches unmatched routes.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
