const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const TABLE_NAME = 'admin_founders';

// Storage configuration for Founders images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './public/founders';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'founder-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// GET all active founders
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM ${TABLE_NAME} WHERE is_active = TRUE ORDER BY display_order ASC, id ASC`);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching founders:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve founders.', error: error.message });
    }
});

// GET a specific founder by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Founder not found.' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching founder:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve founder.', error: error.message });
    }
});

// POST a new founder
router.post('/', upload.single('image'), async (req, res) => {
    const { name, designation, description, image_quote, contact_info, display_order, is_active } = req.body;
    let imageUrl = null;

    if (req.file) {
        imageUrl = `/public/founders/${req.file.filename}`;
    }

    if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO ${TABLE_NAME} (name, designation, description, image_quote, contact_info, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, designation || '', description || '', image_quote || '', contact_info || '', imageUrl || '', display_order || 0, is_active !== 'false']
        );
        res.status(201).json({ success: true, message: 'Founder added successfully.', id: result.insertId });
    } catch (error) {
        console.error('Error adding founder:', error);
        res.status(500).json({ success: false, message: 'Failed to add founder.', error: error.message });
    }
});

// PUT update an existing founder
router.put('/:id', upload.single('image'), async (req, res) => {
    const { name, designation, description, image_quote, contact_info, display_order, is_active } = req.body;
    let imageUrl = null;

    if (req.file) {
        imageUrl = `/public/founders/${req.file.filename}`;
    }

    try {
        const [existing] = await db.query(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`, [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Founder not found.' });
        }

        const finalImageUrl = imageUrl || existing[0].image_url;

        await db.query(
            `UPDATE ${TABLE_NAME} SET name = ?, designation = ?, description = ?, image_quote = ?, contact_info = ?, image_url = ?, display_order = ?, is_active = ? WHERE id = ?`,
            [name || existing[0].name, designation || existing[0].designation, description || existing[0].description, image_quote || existing[0].image_quote, contact_info || existing[0].contact_info, finalImageUrl, display_order || existing[0].display_order, is_active !== undefined ? is_active !== 'false' : existing[0].is_active, req.params.id]
        );

        res.status(200).json({ success: true, message: 'Founder updated successfully.' });
    } catch (error) {
        console.error('Error updating founder:', error);
        res.status(500).json({ success: false, message: 'Failed to update founder.', error: error.message });
    }
});

// DELETE a founder
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Founder not found.' });
        }
        res.status(200).json({ success: true, message: 'Founder deleted successfully.' });
    } catch (error) {
        console.error('Error deleting founder:', error);
        res.status(500).json({ success: false, message: 'Failed to delete founder.', error: error.message });
    }
});

module.exports = router;
