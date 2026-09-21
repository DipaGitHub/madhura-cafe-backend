const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'madhura_cafe',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function seedOpeningHours() {
  try {
    const title = "Opening Hours";
    const description = "Experience the tranquility and warmth of traditional Indian wellness hospitality throughout our open hours.";
    const hours_1 = "SUNDAY - THURSDAY: 11:30AM - 11PM";
    const hours_2 = "FRIDAY & SATURDAY: 11:30AM - 12AM";
    const image_url = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85";

    await pool.query(
      `INSERT INTO admin_opening_hours (title, description, hours_1, hours_2, image_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, hours_1, hours_2, image_url, true]
    );

    console.log('✅ Opening Hours seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding opening hours:', error);
    process.exit(1);
  }
}

seedOpeningHours();
