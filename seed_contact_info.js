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

async function seedContactInfo() {
  try {
    const locationText = "Madhura Herbal Heritage Cafe\nCivil Lines, Jaipur, India";
    const phoneText = "+91 (800) 915-6271\n+91 (800) 915-6272";
    const emailText = "info@madhuracafe.com\nnamaste@madhuracafe.com";
    const workingHoursText = "Mon - Sun: 10:00 AM - 11:00 PM\nKitchen Closes at 10:30 PM";

    await pool.query(
      `INSERT INTO admin_contact_info (location_text, phone_text, email_text, working_hours_text, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [locationText, phoneText, emailText, workingHoursText, true]
    );

    console.log('✅ Contact Info seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding contact info:', error);
    process.exit(1);
  }
}

seedContactInfo();
