const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for gallery uploads
const UPLOAD_DIR = 'public/gallery/'; 
const ABSOLUTE_UPLOAD_DIR = path.join(__dirname, '..', UPLOAD_DIR);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(ABSOLUTE_UPLOAD_DIR)) {
            fs.mkdirSync(ABSOLUTE_UPLOAD_DIR, { recursive: true });
        }
        cb(null, ABSOLUTE_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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

const deleteFile = (filePath) => {
    // If it's a full URL or starts with http, we can't delete it (seeded remote images)
    if (filePath.startsWith('http')) return true;
    
    // Otherwise try deleting local file
    const basename = path.basename(filePath);
    const fullPath = path.join(ABSOLUTE_UPLOAD_DIR, basename);
    if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
            if (err) console.error('Error deleting file:', fullPath, err);
        });
    }
    return true;
};

// @route   GET /api/gallery
// @desc    Get gallery images
router.get('/', async (req, res) => {
    try {
        let query = 'SELECT * FROM admin_gallery';
        let params = [];

        if (req.query.featured === 'true') {
            query += ' WHERE is_featured = ?';
            params.push(true);
        }

        query += ' ORDER BY uploaded_at DESC';

        const [rows] = await db.query(query, params);
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/gallery
// @desc    Add new gallery image
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { image_title, image_type } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        const imagePath = `/${UPLOAD_DIR}${req.file.filename}`;

        const [result] = await db.query(
            'INSERT INTO admin_gallery (image, image_title, image_type, is_featured) VALUES (?, ?, ?, ?)',
            [imagePath, image_title || '', image_type || 'interior', true]
        );

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                id: result.insertId,
                image: imagePath,
                image_title,
                image_type,
                is_featured: true
            }
        });
    } catch (error) {
        console.error('Error uploading gallery image:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery image
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query('SELECT image FROM admin_gallery WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        const imagePath = rows[0].image;
        deleteFile(imagePath);

        await db.query('DELETE FROM admin_gallery WHERE id = ?', [id]);

        res.status(200).json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/gallery/:id/toggle-featured
// @desc    Toggle is_featured status
router.put('/:id/toggle-featured', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_featured } = req.body;

        await db.query('UPDATE admin_gallery SET is_featured = ? WHERE id = ?', [is_featured, id]);

        res.status(200).json({ success: true, message: 'Featured status updated' });
    } catch (error) {
        console.error('Error toggling featured status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
