/**
 * Testimonial API Routes (Express.js with MySQL and Multer)
 *
 * This file implements CRUD operations for the 'admin_testimonials' table
 * using MySQL queries and includes Multer for handling the image_url field.
 */

const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming Promise-based MySQL connection
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- UTILITIES ---

// Utility function for Express error handling (consistent with your service routes)
const asyncWrapper = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Helper to remove files on error
const cleanupFile = (filePath) => {
    if (!filePath || !fs.existsSync(filePath)) return;
    try {
        fs.unlinkSync(filePath);
    } catch (e) {
        console.error('Failed to cleanup file:', e.message);
    }
};

// --- MULTER SETUP (Handles single 'imageUpload' field) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // NOTE: Ensure this directory exists relative to your server root
        const uploadDir = 'public/testimonials/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'testimonial-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for the testimonial image
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, GIF, WEBP) are allowed.'));
        }
    }
});

const uploadSingleImage = upload.single('imageUpload'); // Field name for the file input

// ====================================================================
// PUBLIC ROUTES (Fetch Active Testimonials)
// ====================================================================

// @route   GET /api/testimonials
// @desc    Get all active testimonials, ordered by display_order
// @access  Public
router.get('/', asyncWrapper(async (req, res) => {
    const query = `
        SELECT comment, review_stars, client_name, client_position, client_company, image_url 
        FROM admin_testimonials 
        WHERE is_active = 1 
        ORDER BY display_order ASC, id DESC
    `;
    const [testimonials] = await db.query(query);

    res.status(200).json({ 
        status: 200, 
        message: 'Active testimonials fetched successfully', 
        data: testimonials 
    });
}));


// ====================================================================
// ADMIN ROUTES (CRUD Operations)
// ====================================================================

// @route   GET /api/testimonials/admin
// @desc    Get all testimonials (active and inactive) for admin panel
// @access  Private (Admin) - Placeholder route, authentication needed in a real app
router.get('/admin', asyncWrapper(async (req, res) => {
    const query = `
        SELECT id, comment, review_stars, client_name, client_position, client_company, image_url, is_active, display_order 
        FROM admin_testimonials 
        ORDER BY display_order ASC, id DESC
    `;
    const [testimonials] = await db.query(query);

    res.status(200).json({ 
        status: 200, 
        message: 'All testimonials fetched successfully', 
        data: testimonials 
    });
}));

// @route   GET /api/testimonials/admin/:id
// @desc    Get a single testimonial by ID
// @access  Private (Admin)
router.get('/admin/:id', asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM admin_testimonials WHERE id = ?';
    const [testimonial] = await db.query(query, [id]);

    if (testimonial.length === 0) {
        return res.status(404).json({ status: 404, error: `Testimonial with id ${id} not found` });
    }

    res.status(200).json({ status: 200, data: testimonial[0] });
}));


// @route   POST /api/testimonials/admin/create
// @desc    Create a new testimonial with an optional image upload
// @access  Private (Admin)
router.post('/admin/create', uploadSingleImage, async (req, res) => {
    try {
        const { 
            comment, review_stars, client_name, 
            client_position, client_company, is_active, display_order 
        } = req.body;

        // Basic validation
        if (!comment || !client_name) {
            cleanupFile(req.file?.path);
            return res.status(400).json({ status: 400, error: 'Comment and Client Name are required.' });
        }

        const imageUrl = req.file ? `/public/testimonials/${req.file.filename}` : null;
        const isActive = is_active === 'true' || is_active === true;

        const query = `
            INSERT INTO admin_testimonials 
            (comment, review_stars, client_name, client_position, client_company, image_url, is_active, display_order) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            comment, review_stars || 5, client_name, 
            client_position || null, client_company || null, imageUrl, 
            isActive, display_order || null
        ];

        const [result] = await db.query(query, values);

        res.status(201).json({ 
            status: 201, 
            message: 'Testimonial created successfully', 
            id: result.insertId 
        });

    } catch (error) {
        console.error('Error creating testimonial:', error);
        cleanupFile(req.file?.path);
        res.status(500).json({ status: 500, error: 'Failed to create testimonial.', details: error.message });
    }
});

// @route   PUT /api/testimonials/admin/update/:id
// @desc    Update an existing testimonial with an optional image upload
// @access  Private (Admin)
router.put('/admin/update/:id', uploadSingleImage, async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            comment, review_stars, client_name, 
            client_position, client_company, is_active, display_order, 
            keep_existing_image // Flag to indicate if existing image should be kept if no new file is uploaded
        } = req.body;

        // 1. Fetch existing testimonial details
        const [existingTestimonials] = await db.query('SELECT image_url FROM admin_testimonials WHERE id = ?', [id]);
        if (existingTestimonials.length === 0) {
            cleanupFile(req.file?.path);
            return res.status(404).json({ status: 404, error: 'Testimonial not found.' });
        }
        const existingImageUrl = existingTestimonials[0].image_url;
        let newImageUrl = existingImageUrl;

        // 2. Handle image update and cleanup old file
        if (req.file) {
            // A new image was uploaded
            newImageUrl = `/public/testimonials/${req.file.filename}`;
            // Delete old file if it exists and is not the new one
            if (existingImageUrl) {
                const oldAbsolutePath = path.join(__dirname, '..', existingImageUrl);
                fs.unlink(oldAbsolutePath, (err) => {}); // Use async unlink
            }
        } else if (keep_existing_image === 'false' || keep_existing_image === false) {
             // User explicitly requested to remove the image but didn't upload a new one
             newImageUrl = null;
             if (existingImageUrl) {
                const oldAbsolutePath = path.join(__dirname, '..', existingImageUrl);
                fs.unlink(oldAbsolutePath, (err) => {});
             }
        } else {
             // Keep the existing image URL if no new file was uploaded
             newImageUrl = existingImageUrl;
        }

        // 3. Construct and execute SQL UPDATE
        const updateFields = {
            comment,
            review_stars: review_stars || 5,
            client_name,
            client_position: client_position || null,
            client_company: client_company || null,
            image_url: newImageUrl,
            is_active: is_active === undefined ? undefined : (is_active === 'true' || is_active === true),
            display_order: display_order || null
        };
        
        // Filter out undefined values (which were not provided in the request body)
        const fieldsToUpdate = [];
        const values = [];
        
        for (const key in updateFields) {
            if (updateFields[key] !== undefined) {
                fieldsToUpdate.push(`${key} = ?`);
                values.push(updateFields[key]);
            }
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(200).json({ status: 200, message: 'No fields provided for update.' });
        }

        const sql = `UPDATE admin_testimonials SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
        const [result] = await db.query(sql, [...values, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 404, error: 'Testimonial not found or no changes made.' });
        }

        res.status(200).json({ status: 200, message: 'Testimonial updated successfully!' });

    } catch (error) {
        console.error('Error updating testimonial:', error);
        cleanupFile(req.file?.path);
        res.status(500).json({ status: 500, error: 'Failed to update testimonial.', details: error.message });
    }
});

// @route   DELETE /api/testimonials/admin/delete/:id
// @desc    Delete a testimonial and its associated image
// @access  Private (Admin)
router.delete('/admin/delete/:id', asyncWrapper(async (req, res) => {
    const { id } = req.params;

    // 1. Fetch image URL before deleting
    const [testimonials] = await db.query('SELECT image_url FROM admin_testimonials WHERE id = ?', [id]);
    if (testimonials.length === 0) {
        return res.status(404).json({ status: 404, error: 'Testimonial not found.' });
    }
    const imageUrl = testimonials[0].image_url;

    // 2. Delete from database
    const [result] = await db.query('DELETE FROM admin_testimonials WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ status: 404, error: 'Testimonial not found.' });
    }

    // 3. Delete image file
    if (imageUrl) {
        const absolutePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(absolutePath)) {
            fs.unlink(absolutePath, (err) => {
                if (err) console.error('Failed to delete image file:', err.message);
            });
        }
    }

    res.status(200).json({ status: 200, message: 'Testimonial deleted successfully' });
}));

// @route   POST /api/testimonials/admin/sync-google-reviews
// @desc    Sync or re-import the authentic Google Reviews into admin_testimonials
// @access  Private (Admin)
router.post('/admin/sync-google-reviews', asyncWrapper(async (req, res) => {
    const googleReviews = [
        {
            name: 'Aakansha Tamang',
            role: 'Local Guide • Google Review',
            quote: 'Water of India, a unit of Madhuras Cafe, Siliguri .A perfect spot for natural and cooling traditional drinks. Very refreshing and hygienic, highly recommended. Do visit!',
            stars: 5,
            img: null
        },
        {
            name: 'Yhulsang Tamang',
            role: 'Google Review',
            quote: 'Water of India, a unit of Madhuras Cafe in Siliguri is amazing. If you love traditional drinks, this is the place. So refreshing, natural and hygienic must visit.',
            stars: 5,
            img: null
        },
        {
            name: 'Rai Trishi',
            role: 'Local Guide • Google Review',
            quote: 'Loved the concept of Water of India! All desi summer drinks like Panakam, Solkadhi, Jaljeera, Chaas at one place. Very refreshing, natural and budget-friendly. Must try if you want something different from regular soft drinks.',
            stars: 5,
            img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        },
        {
            name: 'Subhankar Sen',
            role: 'Google Review',
            quote: 'Wonderful experience.. Healthy products and authentic traditional taste. Highly recommend to everyone visiting Siliguri.',
            stars: 5,
            img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
        },
        {
            name: 'Debagni Dam',
            role: 'Google Review',
            quote: 'Lovely experience with refreshing and cooling drinks. The ambiance is pleasant and the traditional preparation is truly authentic.',
            stars: 5,
            img: null
        },
        {
            name: 'Pranap Rai',
            role: 'Google Review',
            quote: 'It was such a nice place to visit while we got tired and the service was also good and fast. The ambiance was peaceful and drinks were truly rejuvenating.',
            stars: 5,
            img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
        },
        {
            name: 'Prabit Nagesia',
            role: 'Google Review',
            quote: 'The Madhura\'s Cafe is so good for drinks 🌟 Their drinks are so delicious 😋 This place is very very good 👍 Love the place ❤️',
            stars: 5,
            img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
        },
        {
            name: 'Santosh Darjee',
            role: 'Google Review',
            quote: 'The service was very good, hygiene maintained properly and natural ingredients used in every preparation. You should definitely visit!',
            stars: 5,
            img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80'
        },
        {
            name: 'Maya Chettri',
            role: 'Local Guide • Google Review',
            quote: 'If you are looking for a spot with a chilling atmosphere and great energy, this is it. The drinks are expertly crafted and delicious. What really stands out, though, is the friendly nature of the staff - they make you feel right at home the moment you walk in. Highly recommend!',
            stars: 5,
            img: null
        }
    ];

    let insertedCount = 0;
    for (let i = 0; i < googleReviews.length; i++) {
        const item = googleReviews[i];
        const [existing] = await db.query(
            'SELECT id FROM admin_testimonials WHERE client_name = ?',
            [item.name]
        );
        if (existing.length === 0) {
            await db.query(
                `INSERT INTO admin_testimonials (client_name, client_position, comment, image_url, review_stars, is_active, display_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [item.name, item.role, item.quote, item.img, item.stars, true, i + 1]
            );
            insertedCount++;
        } else {
            // Update image_url to null if reviewer does not have photo
            if (item.img === null) {
                await db.query(
                    'UPDATE admin_testimonials SET image_url = NULL WHERE id = ?',
                    [existing[0].id]
                );
            }
        }
    }

    res.status(200).json({
        status: 200,
        success: true,
        message: `Google reviews synchronized successfully! (${insertedCount} new reviews imported)`
    });
}));

module.exports = router;