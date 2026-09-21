const express = require('path');
const router = require('express').Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'public/specialities/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'speciality-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// GET /api/specialities -> Get the active speciality (usually just 1)
router.get('/', async (req, res) => {
  try {
    const [specialities] = await db.query('SELECT * FROM admin_specialities WHERE is_active = true ORDER BY id DESC LIMIT 1');
    res.json({ success: true, data: specialities[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/specialities/admin -> Get all for admin panel
router.get('/admin', async (req, res) => {
  try {
    const [specialities] = await db.query('SELECT * FROM admin_specialities ORDER BY id DESC');
    res.json({ success: true, data: specialities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/specialities/admin/update/:id -> Update speciality
router.put('/admin/update/:id', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, is_active } = req.body;

    let updateFields = [];
    let updateValues = [];

    if (title) { updateFields.push('title = ?'); updateValues.push(title); }
    if (description) { updateFields.push('description = ?'); updateValues.push(description); }
    if (is_active !== undefined) { updateFields.push('is_active = ?'); updateValues.push(is_active === 'true' || is_active === true); }

    if (req.files) {
      if (req.files['image1'] && req.files['image1'][0]) {
        updateFields.push('image1_url = ?');
        updateValues.push(`/public/specialities/${req.files['image1'][0].filename}`);
      }
      if (req.files['image2'] && req.files['image2'][0]) {
        updateFields.push('image2_url = ?');
        updateValues.push(`/public/specialities/${req.files['image2'][0].filename}`);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    updateValues.push(id);
    const query = `UPDATE admin_specialities SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.query(query, updateValues);

    res.json({ success: true, message: 'Speciality updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
