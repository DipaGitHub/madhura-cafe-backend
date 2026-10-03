const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const TABLE_NAME = 'admin_about_us';

// Storage configuration for About Us images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './public/about_us';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'about-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// 1. GET About Us data
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM ${TABLE_NAME} LIMIT 1`);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'About Us data not found.' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching About Us:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve About Us.', error: error.message });
    }
});

// 2. PUT Update About Us data
router.put('/', upload.single('image'), async (req, res) => {
    const { title, description, short_description } = req.body;
    let imageUrl = null;

    if (req.file) {
        imageUrl = `/public/about_us/${req.file.filename}`;
    }

    if (!title || !description) {
        return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    try {
        // First check if a record exists
        const [existing] = await db.query(`SELECT * FROM ${TABLE_NAME} LIMIT 1`);
        
        if (existing.length === 0) {
             // Create it if it doesn't exist
             await db.query(
                 `INSERT INTO ${TABLE_NAME} (title, short_description, description, image_url) VALUES (?, ?, ?, ?)`,
                 [title, short_description || '', description, imageUrl || '']
             );
        } else {
             // Update the existing record
             const finalImageUrl = imageUrl || existing[0].image_url;
             await db.query(
                 `UPDATE ${TABLE_NAME} SET title = ?, short_description = ?, description = ?, image_url = ? WHERE id = ?`,
                 [title, short_description || existing[0].short_description, description, finalImageUrl, existing[0].id]
             );
        }

        res.status(200).json({ success: true, message: 'About Us updated successfully.' });

    } catch (error) {
        console.error('Error updating About Us:', error);
        res.status(500).json({ success: false, message: 'Failed to update About Us.', error: error.message });
    }
});

module.exports = router;
