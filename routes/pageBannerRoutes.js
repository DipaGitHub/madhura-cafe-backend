const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/banners/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

/**
 * @route GET /api/page-banner
 * @desc Get all page banners
 */
router.get('/', async (req, res) => {
    try {
        const [banners] = await db.query('SELECT * FROM admin_page_banners ORDER BY created_at DESC');
        res.status(200).json({
            status: 200,
            message: 'Page banners fetched successfully',
            data: banners
        });
    } catch (error) {
        console.error('Error fetching page banners:', error);
        res.status(500).json({ status: 500, error: 'Failed to fetch page banners.' });
    }
});

/**
 * @route GET /api/page-banner/:pageTitle
 * @desc Get a specific page banner by title
 */
router.get('/:pageTitle', async (req, res) => {
    try {
        const { pageTitle } = req.params;
        const [banners] = await db.query('SELECT * FROM admin_page_banners WHERE page_title = ?', [pageTitle]);
        
        if (banners.length === 0) {
            return res.status(404).json({ status: 404, error: 'Banner not found.' });
        }

        res.status(200).json({
            status: 200,
            message: 'Page banner fetched successfully',
            data: banners[0]
        });
    } catch (error) {
        console.error('Error fetching page banner:', error);
        res.status(500).json({ status: 500, error: 'Failed to fetch page banner.' });
    }
});

/**
 * @route POST /api/page-banner/create
 * @desc Create or update a page banner
 */
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { pageTitle } = req.body;
        
        if (!pageTitle) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ status: 400, error: 'Page Title is required.' });
        }
        
        if (!req.file) {
            return res.status(400).json({ status: 400, error: 'Image file is required.' });
        }

        const imageUrl = `/public/banners/${req.file.filename}`;

        // Check if banner exists for this page to potentially delete old image
        const [existing] = await db.query('SELECT * FROM admin_page_banners WHERE page_title = ?', [pageTitle]);
        
        if (existing.length > 0 && existing[0].image_url) {
            const oldImagePath = path.join(__dirname, '..', existing[0].image_url);
            if (fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error(`Failed to delete old image: ${oldImagePath}`, err);
                });
            }
        }

        // Insert or update
        const [result] = await db.query(
            'INSERT INTO admin_page_banners (page_title, image_url) VALUES (?, ?) ON DUPLICATE KEY UPDATE image_url = VALUES(image_url)',
            [pageTitle, imageUrl]
        );

        res.status(201).json({ 
            status: 201,
            message: 'Page banner saved successfully',
            data: { pageTitle, imageUrl }
        });

    } catch (error) {
        console.error('Error saving page banner:', error);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ status: 500, error: 'Failed to save page banner.' });
    }
});

/**
 * @route DELETE /api/page-banner/delete/:id
 * @desc Delete a single page banner
 */
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [banners] = await db.query('SELECT image_url FROM admin_page_banners WHERE id = ?', [id]);
        
        if (banners.length === 0) {
            return res.status(404).json({ status: 404, error: 'Banner not found.' });
        }

        const [result] = await db.query('DELETE FROM admin_page_banners WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 404, error: 'Banner not found.' });
        }

        const imagePath = path.join(__dirname, '..', banners[0].image_url);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        res.status(200).json({ status: 200, message: 'Banner deleted successfully' });
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({ status: 500, error: 'Failed to delete banner.' });
    }
});

module.exports = router;
