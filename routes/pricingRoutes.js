const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @route POST /api/pricing/create
 * @desc Create a new pricing plan
 */
router.post('/create', async (req, res) => {
    try {
        const { category, plan_name, price, features, is_featured } = req.body;

        if (!category || !plan_name || !price) {
            return res.status(400).json({ status: 400, error: 'Category, plan name, and price are required.' });
        }

        // Ensure features is stored as a string if sent as an array
        const featuresData = Array.isArray(features) ? JSON.stringify(features) : features;

        const [result] = await db.query(
            `INSERT INTO admin_pricing (category, plan_name, price, features, is_featured) VALUES (?, ?, ?, ?, ?)`,
            [category, plan_name, price, featuresData, is_featured ? 1 : 0]
        );

        res.status(201).json({
            status: 201,
            message: 'Pricing plan created successfully',
            planId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Failed to create pricing plan.' });
    }
});

/**
 * @route GET /api/pricing
 * @desc Get all pricing plans
 */
router.get('/', async (req, res) => {
    try {
        const [plans] = await db.query('SELECT * FROM admin_pricing ORDER BY price ASC');
        
        // Parse JSON features back to arrays for the frontend
        const formattedPlans = plans.map(plan => ({
            ...plan,
            features: JSON.parse(plan.features || "[]")
        }));

        res.status(200).json({
            status: 200,
            data: formattedPlans
        });
    } catch (error) {
        res.status(500).json({ status: 500, error: 'Failed to fetch pricing.' });
    }
});

/**
 * @route PUT /api/pricing/update/:id
 * @desc Update a pricing plan
 */
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { category, plan_name, price, features, is_featured } = req.body;

        const featuresData = Array.isArray(features) ? JSON.stringify(features) : features;

        const [result] = await db.query(
            `UPDATE admin_pricing SET category = ?, plan_name = ?, price = ?, features = ?, is_featured = ? WHERE id = ?`,
            [category, plan_name, price, featuresData, is_featured ? 1 : 0, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 404, error: 'Plan not found.' });
        }

        res.status(200).json({ status: 200, message: 'Pricing plan updated successfully' });
    } catch (error) {
        res.status(500).json({ status: 500, error: 'Failed to update plan.' });
    }
});

/**
 * @route DELETE /api/pricing/delete/:id
 * @desc Delete a pricing plan
 */
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM admin_pricing WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 404, error: 'Plan not found.' });
        }

        res.status(200).json({ status: 200, message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 500, error: 'Failed to delete plan.' });
    }
});

module.exports = router;