import pool from '../database/db.js';

async function setupDatabase() {
  try {
    const dbName = 'my_db'; // Your desired database name

    // 1. Create the database if it doesn't exist
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' is ready.`);

    // 2. Use the new database
    await pool.query(`USE \`${dbName}\`;`);
    console.log(`Using database '${dbName}'.`);

    // 3. Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        contact VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL
      ) ENGINE=InnoDB;
    `);
    console.log('Table users created or already exists.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS buses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bus_name VARCHAR(255) NOT NULL,
        bus_number VARCHAR(50) UNIQUE NOT NULL,
        image_url VARCHAR(255),
        total_seats INT NOT NULL
      ) ENGINE=InnoDB;
    `);
    console.log('Table buses created or already exists.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        source VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        departure_time DATETIME NOT NULL,
        arrival_time DATETIME NOT NULL,
        bus_id INT,
        FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('Table routes created or already exists.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        route_id INT,
        seat_number INT NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('Table bookings created or already exists.');

    // Add remaining table creation queries...

    // 4. Insert sample data
    const [existingBus] = await pool.query(
      'SELECT * FROM buses WHERE bus_number = ?',
      ['EXP1234']
    );

    if (existingBus.length === 0) {
      await pool.query(
        'INSERT INTO buses (bus_name, bus_number, image_url, total_seats) VALUES (?, ?, ?, ?)',
        ['City Express', 'EXP1234', 'https://example.com/bus.jpg', 50]
      );
      console.log('Sample bus inserted.');
    } else {
      console.log('Sample bus already exists, skipping creation.');
    }

    // Add other sample data insertions...

    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up the database:', error);
  }
}

export default setupDatabase;
