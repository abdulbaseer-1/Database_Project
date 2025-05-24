// middleware/authenticateJWT.js
import jwt from 'jsonwebtoken';

function authenticateJWT(req, res, next) {
  // 1. Grab token from Authorization header or cookie
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Authentication token missing. Please log in.' });
  }

  // 2. Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      // Token expired or malformed
      const message =
        err.name === 'TokenExpiredError'
          ? 'Session expired. Please log in again.'
          : 'Invalid authentication token.';
      return res.status(403).json({ message });
    }

    // 3. Attach payload to req.user
    req.user = payload;
    next();
  });
}

export default authenticateJWT;
