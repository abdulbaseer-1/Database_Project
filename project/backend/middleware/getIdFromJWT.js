import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";

// Set up __filename and __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../config/.env") });

const getUserIdFromToken = (req) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error("Authorization header is missing");
        }

        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

        if (!token) {
            throw new Error("Token is empty");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded || !decoded.id) {
            throw new Error("Invalid token payload");
        }

        return decoded.id;
    } catch (error) {
        console.error("Error in getUserIdFromToken:", error.message);
        throw error;
    }
};

export default getUserIdFromToken;
