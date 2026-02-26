// Global error handler middleware
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Database errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        return res.status(409).json({
          error: 'Duplicate entry',
          message: 'This record already exists'
        });

      case '23503': // Foreign key violation
        return res.status(400).json({
          error: 'Invalid reference',
          message: 'Referenced record does not exist'
        });

      case '22P02': // Invalid text representation
        return res.status(400).json({
          error: 'Invalid data format',
          message: 'The provided data format is invalid'
        });

      default:
        return res.status(500).json({
          error: 'Database error',
          message: process.env.NODE_ENV === 'production'
            ? 'An error occurred while processing your request'
            : err.message
        });
    }
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

// 404 handler
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not found',
    message: `Cannot ${req.method} ${req.path}`
  });
}
