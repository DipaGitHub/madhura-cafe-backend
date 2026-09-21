const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'madhura-cafe'
  });

  try {
    console.log("Dropping old table...");
    await pool.query(`DROP TABLE IF EXISTS admin_banners`);

    console.log("Creating new table...");
    await pool.query(`
      CREATE TABLE admin_banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title1 VARCHAR(255) NOT NULL,
        title2 VARCHAR(255),
        description TEXT,
        image_url VARCHAR(255) NOT NULL,
        is_mobile_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Seeding data...");
    await pool.query(`
      INSERT INTO admin_banners (title1, title2, description, image_url, is_mobile_enabled)
      VALUES 
      ('Madhura''s Cafe', '100% Ayurvedic Wellness', 'Experience the healing power of authentic Vedic traditions.', '/public/banners/banner1.jpg', true),
      ('Sattvic Pure Thali', 'Traditional Dining Experience', 'Nourish your soul with our organic, seasonal, and balancing recipes.', '/public/banners/banner2.jpg', false)
    `);
    
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
