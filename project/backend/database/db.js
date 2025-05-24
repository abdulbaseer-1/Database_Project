
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({path:"../config/"});

let pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log('Database connection pool created successfully.');
} catch (error) {
  console.error('Error creating database connection pool:', error.message);
  process.exit(1); // Exit if pool creation fails
}

export default pool;