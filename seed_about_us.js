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
    console.log("Truncating admin_about_us table...");
    await pool.query(`TRUNCATE TABLE admin_about_us`);

    console.log("Seeding default About Us data...");
    await pool.query(`
      INSERT INTO admin_about_us (title, description, image_url)
      VALUES 
      (
        'Our Ayurvedic Heritage',
        'Welcome to Madhura''s Cafe, where ancient Vedic wisdom meets modern culinary artistry. We believe that food is not just nourishment for the body, but medicine for the soul.\n\nRooted in deep Ayurvedic traditions, our kitchen exclusively uses pristine sattvic ingredients, stone-ground heritage millets, and therapeutic botanicals to restore your inner balance and vitality.',
        'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=85'
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
