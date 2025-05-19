const colors = require('colors');

// Global error handler middleware
function errorHandler(err, req, res, next) {
  // Log the error to the console with color
  console.error('Error:'.red, err.message || err);
  if (err.stack) {
    console.error('Stack Trace:'.yellow, err.stack);
  }

  // Send a JSON response with the error details
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = errorHandler;