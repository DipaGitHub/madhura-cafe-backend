const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'madhura-cafe'
  });

  try {
    console.log("Truncating admin_latest_updates table...");
    await pool.query(`TRUNCATE TABLE admin_latest_updates`);

    console.log("Seeding default updates...");
    await pool.query(`
      INSERT INTO admin_latest_updates (update_date, title, description)
      VALUES 
      (
        CURDATE(),
        'Embark on a gastronomic adventure',
        'guided our by exquisite dishes'
      ),
      (
        CURDATE(),
        'Experience the healing power',
        'of authentic Vedic traditions'
      )
    `);
    
    console.log("Seeding successful!");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    process.exit(0);
  }
}

seed();
