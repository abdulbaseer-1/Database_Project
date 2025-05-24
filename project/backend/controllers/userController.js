// import User from "../Models/User.model.js";
import bcrypt, {compare} from 'bcrypt';
import getIdFromJWT from "./getIdFromJWT.js";
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import dotenv from 'dotenv';
import pool from '../config/db.js'; // Assuming you have a db.js file for database connection

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file    

dotenv.config({ path: path.join(__dirname, "../../config/.env") });


const createUser = async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
const insertResult = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [req.body.username, req.body.email, hashedPassword]
        );
          const user = insertResult.rows[0];
        console.log("User created successfully: ", user);

        res.status(201).json({ message: "User created", user });
    } catch (error) {
        console.error("Error occurred while creating user: ", error); 
        res.status(500).json({ message: error.message });
    }
};
//         const user = await User.create({
//             username: req.body.username,
//             email: req.body.email,
//             password: hashedPassword,
//         });

//         res.status(201).json({message: "user created", user});
        
//     }catch (error) {
//         console.error("Error occurred while creating user: ", error); 
//         res.status(500).json({message: error.message});
//     }
// };

const deleteUser = async (req, res) => {
        const id = getIdFromJWT(req);
        // const user = await User.findById(id);
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = userResult.rows[0];
        console.log("in delete user: user ", user);
        
        if (!user) {    
            return res.status(404).json({ message: 'User not found' });
        }

        // await User.findByIdAndDelete(user._id);
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        console.log("in delete user: user deleted ", user);
        res.status(200).json({ message: 'User deleted successfully' });
};


const loginUser = async (req, res) => {     
    try {
        console.log("in login user");
        const { state, password } = req.body;
        const searchField = state === "username" ? "username" : "email";
        const searchValue = req.body[searchField];

        console.log("in login user");


        // const user = await User.findOne({ [searchField]: searchValue });
        const userResult = await pool.query(`SELECT * FROM users WHERE ${searchField} = $1`, [searchValue]);
        const user = userResult.rows[0];
        
        if (!user || !(await compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("in login user: user ", user);

        const token = jwt.sign( 
            { id: user.id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h', algorithm: 'HS256' }
        );

        console.log("in login user: token ", token);

        // token to be sent in response.
        res.status(200).json({ 
            message: "Login successful",
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const logoutUser = (req, res) => { // this is so easy, sessions were relly tiresome
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

export default { createUser, deleteUser, loginUser, logoutUser };