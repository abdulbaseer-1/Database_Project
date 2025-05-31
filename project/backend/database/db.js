import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: "../config/.env" });

let pool;

// Create a pool and assign it globally
function CreatePool(dbName) {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log(`Database connection pool created for database: ${dbName}`);
  return pool;   // <-- return the pool here
}


// Initialize the default pool with the database from .env
CreatePool(process.env.DB_NAME);


export default pool;
export { CreatePool };
