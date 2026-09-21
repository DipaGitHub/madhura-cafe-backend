const express = require('express');
const router = express.Router();
const pool = require('../db');

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
router.post('/categories', async (req, res) => {
  const { name, description, sort_order, image_url } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO admin_menu_categories (name, description, sort_order, image_url) VALUES (?, ?, ?, ?)',
      [name, description, sort_order || 0, image_url || null]
    );
    res.json({ success: true, message: 'Category added successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update category
router.put('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, sort_order, image_url } = req.body;
  try {
    await pool.query(
      'UPDATE admin_menu_categories SET name=?, description=?, sort_order=?, image_url=? WHERE id=?',
      [name, description, sort_order, image_url || null, id]
    );
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
router.post('/', async (req, res) => {
  const { id, category_id, title, short_description, benefit, price, image_url, ingredients, long_description, is_featured, is_popular } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO admin_menu_items 
       (id, category_id, title, short_description, benefit, price, image_url, ingredients, long_description, is_featured, is_popular) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, category_id, title, short_description, benefit, price, image_url, JSON.stringify(ingredients), long_description, is_featured ? 1 : 0, is_popular ? 1 : 0]
    );
    res.json({ success: true, message: 'Menu item added successfully', id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update menu item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { category_id, title, short_description, benefit, price, image_url, ingredients, long_description, is_featured, is_popular } = req.body;
  try {
    await pool.query(
      `UPDATE admin_menu_items 
       SET category_id=?, title=?, short_description=?, benefit=?, price=?, image_url=?, ingredients=?, long_description=?, is_featured=?, is_popular=? 
       WHERE id=?`,
      [category_id, title, short_description, benefit, price, image_url, JSON.stringify(ingredients), long_description, is_featured ? 1 : 0, is_popular ? 1 : 0, id]
    );
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
