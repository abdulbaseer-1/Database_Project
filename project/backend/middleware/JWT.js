import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../config/.env") });

export const generateJWT = (req, res, next) => {
    try {
        console.log("in generate jwt");
        const user = req.body;

        console.log("in generate jwt", req.body);

        console.log("in generate jwt", user);

        if (!user || !user.state || (!user.email && !user.username)) {
            return res.status(400).json({ message: 'Invalid user data' });
        }
        console.log("in generate jwt");

        req.token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '1h',
                algorithm: 'HS256',
            }
        );

        console.log('Generated token:', req.token); // Debugging log
        next(); // Pass control to the next middleware
    } catch (error) {
        console.error('Error generating token:', error.message);
        res.status(500).json({ message: 'Error generating token' });
    }
};
