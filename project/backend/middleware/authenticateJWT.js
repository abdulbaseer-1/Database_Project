// middleware/authenticateJWT.js
import jwt from 'jsonwebtoken';
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";

// Set up __filename and __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../config/.env") });


function authenticateJWT(req, res, next) {
  console.log('authenticateJWT middleware running');
  // 1. Grab token from Authorization header or cookie
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  console.log('authenticateJWT middleware running', token);
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Authentication token missing. Please log in.' });
  }

  // 2. Verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      // Token expired or malformed
      console.log("inside verify");
      const message =
        err.name === 'TokenExpiredError'
          ? 'Session expired. Please log in again.'
          : 'Invalid authentication token.';
          console.log("message : ", message);
      return res.status(403).json({ message });
    }

    // 3. Attach payload to req.user
    req.user = payload;
    next();
  });
}

export default authenticateJWT;
