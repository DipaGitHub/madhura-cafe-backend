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

async function seedSpecialities() {
  try {
    const title = "Our Specialties";
    const description = "Welcome to our restaurant, where culinary artistry meets exceptional dining experiences. At Madhura's Cafe, we strive to create a gastronomic haven that tantalizes your taste buds.";
    const img1 = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80";
    const img2 = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80";

    await pool.query(
      `INSERT INTO admin_specialities (title, description, image1_url, image2_url, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, img1, img2, true]
    );

    console.log('✅ Specialities seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding specialities:', error);
    process.exit(1);
  }
}

seedSpecialities();
