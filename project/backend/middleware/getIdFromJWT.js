import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url';
import path,{ dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../config/.env") });

const getUserIdFromToken = (req) => {
  try {

    console.log("inside get id from jwt");

      const authHeader = req.headers.authorization;
      if (!authHeader) {
          throw new Error("No authorization header");
      }

      // Make sure to handle 'Bearer ' prefix
      const token = authHeader.startsWith('Bearer ') 
          ? authHeader.slice(7) 
          : authHeader;

          console.log("inside get id from jwt, token", token);

      if (!token) {
          throw new Error("No token provided");
      }

      console.log("inside get id from jwt, token", token);

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
      console.log("inside get id from jwt, decoded", decoded);
      return decoded.id;
  } catch (error) {
      console.error("Token verification error:", error);
      throw error;
  }
};

export default getUserIdFromToken;