const express = require('path');
const router = require('express').Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'public/opening_hours/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'opening-hours-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// GET /api/openingHours -> Get the active opening hours (usually just 1)
router.get('/', async (req, res) => {
  try {
    const [hours] = await db.query('SELECT * FROM admin_opening_hours WHERE is_active = true ORDER BY id DESC LIMIT 1');
    res.json({ success: true, data: hours[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/openingHours/admin -> Get all for admin panel
router.get('/admin', async (req, res) => {
  try {
    const [hours] = await db.query('SELECT * FROM admin_opening_hours ORDER BY id DESC');
    res.json({ success: true, data: hours });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/openingHours/admin/update/:id -> Update opening hours
router.put('/admin/update/:id', upload.single('image'), async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, hours_1, hours_2, is_active } = req.body;

    let updateFields = [];
    let updateValues = [];

    if (title !== undefined) { updateFields.push('title = ?'); updateValues.push(title); }
    if (description !== undefined) { updateFields.push('description = ?'); updateValues.push(description); }
    if (hours_1 !== undefined) { updateFields.push('hours_1 = ?'); updateValues.push(hours_1); }
    if (hours_2 !== undefined) { updateFields.push('hours_2 = ?'); updateValues.push(hours_2); }
    if (is_active !== undefined) { updateFields.push('is_active = ?'); updateValues.push(is_active === 'true' || is_active === true); }

    if (req.file) {
      updateFields.push('image_url = ?');
      updateValues.push(`/public/opening_hours/${req.file.filename}`);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    updateValues.push(id);
    const query = `UPDATE admin_opening_hours SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.query(query, updateValues);

    res.json({ success: true, message: 'Opening hours updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
