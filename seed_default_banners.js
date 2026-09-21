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
    console.log("Truncating admin_banners table...");
    await pool.query(`TRUNCATE TABLE admin_banners`);

    console.log("Seeding default hero slides...");
    await pool.query(`
      INSERT INTO admin_banners (title1, title2, description, image_url, is_mobile_enabled)
      VALUES 
      (
        'Traditional Indian Wellness',
        'Madhura''s Cafe Offers You',
        'Ancient Vedic culinary wisdom crafted with immunity-boosting Ayurvedic herbs and pure desi ghee in a tranquil ambience.',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80',
        false
      ),
      (
        'Fresh & Authentic Meals',
        'Pure & Wholesome Delicacies',
        'Wholesome Sattvic delicacies and stone-ground millet preparations freshly made for optimal vitality and taste.',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80',
        false
      ),
      (
        'Crafted With Pure Devotion',
        'Artisanal Cafe Experience',
        'Authentic Indian recipes free from artificial additives, enriched with therapeutic botanicals and heritage traditions.',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80',
        false
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
