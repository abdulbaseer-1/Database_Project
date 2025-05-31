import db from './db.js';
const  createPool = db.createPool;

async function setupDatabase() {
  try {
    console.log("Setting up the database...");

    const dbName = 'bus_management_system';
    const rootPool = createPool(null); // Temporary pool without specifying a database

    // 1. Create the database if it doesn't exist
    await rootPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' is ready.`);

    // 2. Create a pool with the newly created database
    const pool = createPool(dbName);

    // 3. Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
      ) ENGINE=InnoDB;
    `);
    console.log('Table "users" created or already exists.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS buses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bus_name VARCHAR(255) NOT NULL,
        bus_number VARCHAR(50) UNIQUE NOT NULL,
        total_seats INT NOT NULL
      ) ENGINE=InnoDB;
    `);
    console.log('Table "buses" created or already exists.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        _source VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        departure_time DATETIME NOT NULL,
        arrival_time DATETIME NOT NULL,
        bus_id INT,
        FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('Table "routes" created or already exists.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        route_id INT,
        seat_number INT NOT NULL,
        status ENUM('booked','cancelled') NOT NULL,
        date DATE NOT NULL,
        passenger_name VARCHAR(50) NOT NULL,
        passenger_contact VARCHAR(50) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('Table "bookings" created or already exists.');

    // 4. Insert sample data
    const [existingBus] = await pool.query(
      'SELECT * FROM buses WHERE bus_number = ?',
      ['EXP1234']
    );

    if (existingBus.length === 0) {
      await pool.query(
        'INSERT INTO buses (bus_name, bus_number, total_seats) VALUES (?, ?, ?)',
        ['City Express', 'EXP1234', 50]
      );
      console.log('Sample bus inserted.');
    } else {
      console.log('Sample bus already exists, skipping creation.');
    }

    console.log('Database setup complete.');
    await rootPool.end(); // Close the temporary pool
    await pool.end(); // Close the final pool
  } catch (error) {
    console.error('Error setting up the database:', error);
  }
}

export default { setupDatabase };
