// Import dependencies
import bcrypt, { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
import pool from '../database/db.js'; // Database connection

// Utility for path management
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../config/.env") });

const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const sql = `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`;
        const [result] = await pool.query(sql, [username, email, passwordHash]);

        // Fetch the newly created user
        const [user] = await pool.query(`SELECT * FROM users WHERE id = ?`, [result.insertId]);

        res.status(201).json({ user });
    } catch (error) {
        console.error("Error occurred while creating user: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteUser = async (req, res) => {
    console.log("delete called");

    const id = getIdFromJWT(req);

    try {
        // Fetch the user
        const [userResult] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { state, password } = req.body;
        const searchField = state === "username" ? "name" : "email";
        const searchValue = req.body[searchField];

        // Fetch the user
        const [userResult] = await pool.query(`SELECT * FROM users WHERE ${searchField} = ?`, [searchValue]);

        if (userResult.length === 0) {
            console.log("No user found for: ", searchValue);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userResult[0];

        if (!user.password_hash) {
            console.error("Password hash missing in database for user: ", user.id);
            return res.status(500).json({ message: "Server error: User password missing in database" });
        }

        // Compare the entered password with the stored hash
        const isPasswordValid = await compare(password, user.password_hash);
        if (!isPasswordValid) {
            console.log("Invalid password for user: ", user.id);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h', algorithm: 'HS256' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error("Error during login: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};


const logoutUser = (req, res) => {
    
    console.log("logout called");

    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

const getUserRole = async (req, res) => {
    try {
        console.log("in user role");
        const userId = getUserIdFromToken(req);

        const [userResult] = await pool.query('SELECT role FROM users WHERE id = ?', [userId]);

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("in user role");
        console.log("user role :" , userResult[0].role);
        res.json({ role: userResult[0].role });
    } catch (error) {
        console.error('Error fetching user role:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch the user profile
        const [userProfile] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (userProfile.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(userProfile[0]);
    } catch (error) {
        console.error("Error fetching profile: ", error);
        res.status(500).json({ message: 'Error fetching user profile', error });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;

        // Update the user profile
        await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error("Error updating profile: ", error);
        res.status(500).json({ message: 'Error updating user profile', error });
    }
};



// Export controllers
export default {
    createUser,
    deleteUser,
    loginUser,
    logoutUser,
    getUserRole,
    getProfile,
    updateProfile,
};
