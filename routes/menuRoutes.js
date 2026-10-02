const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for menu item images
const UPLOAD_DIR = 'public/menu_items/';
const ABSOLUTE_UPLOAD_DIR = path.join(__dirname, '..', UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(ABSOLUTE_UPLOAD_DIR)) {
      fs.mkdirSync(ABSOLUTE_UPLOAD_DIR, { recursive: true });
    }
    cb(null, ABSOLUTE_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, PNG, GIF, and WebP image files are allowed.'));
  }
});

// Configure Multer for category images
const CATEGORY_UPLOAD_DIR = 'public/menu_categories/';
const ABSOLUTE_CATEGORY_UPLOAD_DIR = path.join(__dirname, '..', CATEGORY_UPLOAD_DIR);

const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(ABSOLUTE_CATEGORY_UPLOAD_DIR)) {
      fs.mkdirSync(ABSOLUTE_CATEGORY_UPLOAD_DIR, { recursive: true });
    }
    cb(null, ABSOLUTE_CATEGORY_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const categoryUpload = multer({
  storage: categoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, PNG, GIF, and WebP image files are allowed.'));
  }
});

// --- CATEGORIES ---

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_menu_categories ORDER BY sort_order ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create category
router.post('/categories', categoryUpload.single('image'), async (req, res) => {
  const { name, description, sort_order } = req.body;
  let image_url = req.body.image_url || null;

  if (req.file) {
    image_url = `/${CATEGORY_UPLOAD_DIR}${req.file.filename}`;
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO admin_menu_categories (name, description, sort_order, image_url) VALUES (?, ?, ?, ?)',
      [name, description, sort_order || 0, image_url]
    );
    res.json({ success: true, message: 'Category added successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update category
router.put('/categories/:id', categoryUpload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, sort_order } = req.body;
  let image_url = req.body.image_url;

  if (req.file) {
    image_url = `/${CATEGORY_UPLOAD_DIR}${req.file.filename}`;
  }

  try {
    let updateQuery = 'UPDATE admin_menu_categories SET name=?, description=?, sort_order=?';
    const params = [name, description, sort_order || 0];

    if (image_url !== undefined) {
      updateQuery += ', image_url=?';
      params.push(image_url);
    }

    updateQuery += ' WHERE id=?';
    params.push(id);

    await pool.query(updateQuery, params);
    res.json({ success: true, message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM admin_menu_categories WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- MENU ITEMS ---

// Get all menu items
router.get('/', async (req, res) => {
  const { featured, popular, category } = req.query;
  try {
    let query = `
      SELECT i.*, c.name as category_name 
      FROM admin_menu_items i 
      LEFT JOIN admin_menu_categories c ON i.category_id = c.id
    `;
    const params = [];
    
    if (featured === 'true') {
      query += ' WHERE i.is_featured = true';
    } else if (popular === 'true') {
      query += ' WHERE i.is_popular = true';
    } else if (category) {
      query += ' WHERE i.category_id = ?';
      params.push(category);
    }
    
    query += ' ORDER BY c.sort_order ASC, i.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get a single menu item
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.*, c.name as category_name 
      FROM admin_menu_items i 
      LEFT JOIN admin_menu_categories c ON i.category_id = c.id
      WHERE i.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create menu item
router.post('/', upload.single('image'), async (req, res) => {
  const { id, category_id, title, short_description, benefit, price, ingredients, long_description, is_featured, is_popular } = req.body;
  let image_url = req.body.image_url || null;

  if (req.file) {
    image_url = `/${UPLOAD_DIR}${req.file.filename}`;
  }

  let parsedIngredients = ingredients;
  if (typeof ingredients === 'string') {
    try {
      parsedIngredients = JSON.parse(ingredients);
    } catch {
      parsedIngredients = ingredients.split(',').map(i => i.trim()).filter(Boolean);
    }
  }

  const isFeaturedVal = is_featured === true || is_featured === 'true' || is_featured === 1 || is_featured === '1' ? 1 : 0;
  const isPopularVal = is_popular === true || is_popular === 'true' || is_popular === 1 || is_popular === '1' ? 1 : 0;

  try {
    const [result] = await pool.query(
      `INSERT INTO admin_menu_items 
       (id, category_id, title, short_description, benefit, price, image_url, ingredients, long_description, is_featured, is_popular) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        category_id ? parseInt(category_id) : null,
        title,
        short_description || '',
        benefit || '',
        price || '',
        image_url,
        JSON.stringify(Array.isArray(parsedIngredients) ? parsedIngredients : []),
        long_description || '',
        isFeaturedVal,
        isPopularVal
      ]
    );
    res.json({ success: true, message: 'Menu item added successfully', id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update menu item
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { category_id, title, short_description, benefit, price, ingredients, long_description, is_featured, is_popular } = req.body;
  let image_url = req.body.image_url;

  if (req.file) {
    image_url = `/${UPLOAD_DIR}${req.file.filename}`;
  }

  let parsedIngredients = ingredients;
  if (typeof ingredients === 'string') {
    try {
      parsedIngredients = JSON.parse(ingredients);
    } catch {
      parsedIngredients = ingredients.split(',').map(i => i.trim()).filter(Boolean);
    }
  }

  const isFeaturedVal = is_featured === true || is_featured === 'true' || is_featured === 1 || is_featured === '1' ? 1 : 0;
  const isPopularVal = is_popular === true || is_popular === 'true' || is_popular === 1 || is_popular === '1' ? 1 : 0;

  try {
    let updateQuery = `UPDATE admin_menu_items 
       SET category_id=?, title=?, short_description=?, benefit=?, price=?, ingredients=?, long_description=?, is_featured=?, is_popular=?`;
    const params = [
      category_id ? parseInt(category_id) : null,
      title,
      short_description || '',
      benefit || '',
      price || '',
      JSON.stringify(Array.isArray(parsedIngredients) ? parsedIngredients : []),
      long_description || '',
      isFeaturedVal,
      isPopularVal
    ];

    if (image_url !== undefined) {
      updateQuery += `, image_url=?`;
      params.push(image_url);
    }

    updateQuery += ` WHERE id=?`;
    params.push(id);

    await pool.query(updateQuery, params);
    res.json({ success: true, message: 'Menu item updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM admin_menu_items WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
