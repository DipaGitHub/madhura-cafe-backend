const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'madhura-cafe',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title1 VARCHAR(255) NOT NULL,
        title2 VARCHAR(255),
        description TEXT,
        image_url VARCHAR(255) NOT NULL,
        is_mobile_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        slug VARCHAR(255) UNIQUE,
        description TEXT,
        scope_title VARCHAR(255),
        scope_content TEXT,
        meta_title VARCHAR(255),
        meta_keyword VARCHAR(255),
        meta_description TEXT,
        image_url VARCHAR(255),
        service_image_url VARCHAR(255),
        banner_image_url VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        publish_date DATE,
        tags VARCHAR(255),
        banner_image VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        short_description TEXT,
        author VARCHAR(255) DEFAULT 'Madhura Cafe Team',
        full_content LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_latest_updates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        update_date DATE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_about_us (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        comment TEXT,
        review_stars INT DEFAULT 5,
        client_name VARCHAR(255),
        client_position VARCHAR(255),
        client_company VARCHAR(255),
        image_url VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_faq (
        id INT AUTO_INCREMENT PRIMARY KEY,
        qus TEXT NOT NULL,
        answers TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logo_carousel (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS service_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone_number VARCHAR(50) NOT NULL,
        service_type VARCHAR(255),
        comments TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_menu_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        sort_order INT DEFAULT 0
      )
    `);
    // Safely add image_url column if upgrading from older schema
    try {
      await pool.query(`ALTER TABLE admin_menu_categories ADD COLUMN image_url VARCHAR(500)`);
    } catch (alterErr) {
      // Column likely already exists — ignore
    }
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_menu_items (
        id VARCHAR(255) PRIMARY KEY,
        category_id INT,
        title VARCHAR(255) NOT NULL,
        short_description TEXT,
        benefit VARCHAR(255),
        price VARCHAR(50),
        image_url VARCHAR(255),
        ingredients JSON,
        long_description TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        is_popular BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES admin_menu_categories(id) ON DELETE CASCADE
      )
    `);
    try {
      await pool.query(`ALTER TABLE admin_menu_items ADD COLUMN is_popular BOOLEAN DEFAULT FALSE`);
    } catch (alterErr) {
      // Column likely already exists — ignore
    }
    
    // Safely rename content column to full_content if upgrading from older schema
    try {
      await pool.query(`ALTER TABLE admin_blogs CHANGE content full_content LONGTEXT`);
    } catch (alterErr) {
      // Column likely already renamed or doesn't exist — ignore
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_blog_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        blog_id INT,
        author_name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (blog_id) REFERENCES admin_blogs(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image VARCHAR(255) NOT NULL,
        image_title VARCHAR(255),
        image_type VARCHAR(50), 
        is_featured BOOLEAN DEFAULT TRUE,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    try {
      await pool.query(`ALTER TABLE admin_gallery ADD COLUMN is_featured BOOLEAN DEFAULT TRUE`);
    } catch (alterErr) {
      // Column likely already exists — ignore
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        comment TEXT NOT NULL,
        review_stars INT DEFAULT 5,
        client_name VARCHAR(255) NOT NULL,
        client_position VARCHAR(255),
        client_company VARCHAR(255),
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_specialities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image1_url VARCHAR(500),
        image2_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_opening_hours (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        hours_1 VARCHAR(255) NOT NULL,
        hours_2 VARCHAR(255),
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_contact_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        location_text TEXT NOT NULL,
        phone_text TEXT NOT NULL,
        email_text TEXT NOT NULL,
        working_hours_text TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ MySQL tables for madhura-cafe verified and ready.');
  } catch (err) {
    console.error('Table init notice:', err.message);
  }
};

initTables();

module.exports = pool;
