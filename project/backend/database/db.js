import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: "../config/.env" });

let pool;

function createPool(dbName) {
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

pool = createPool(process.env.DB_NAME); // Default pool with the provided database

export default{ createPool, pool };
