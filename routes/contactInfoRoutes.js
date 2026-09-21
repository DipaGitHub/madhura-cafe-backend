const router = require('express').Router();
const db = require('../db');

// GET /api/contactInfo -> Get the active contact info
router.get('/', async (req, res) => {
  try {
    const [info] = await db.query('SELECT * FROM admin_contact_info WHERE is_active = true ORDER BY id DESC LIMIT 1');
    res.json({ success: true, data: info[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/contactInfo/admin -> Get all for admin panel
router.get('/admin', async (req, res) => {
  try {
    const [info] = await db.query('SELECT * FROM admin_contact_info ORDER BY id DESC');
    res.json({ success: true, data: info });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/contactInfo/admin/update/:id -> Update contact info
router.put('/admin/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { location_text, phone_text, email_text, working_hours_text, is_active } = req.body;

    let updateFields = [];
    let updateValues = [];

    if (location_text !== undefined) { updateFields.push('location_text = ?'); updateValues.push(location_text); }
    if (phone_text !== undefined) { updateFields.push('phone_text = ?'); updateValues.push(phone_text); }
    if (email_text !== undefined) { updateFields.push('email_text = ?'); updateValues.push(email_text); }
    if (working_hours_text !== undefined) { updateFields.push('working_hours_text = ?'); updateValues.push(working_hours_text); }
    if (is_active !== undefined) { updateFields.push('is_active = ?'); updateValues.push(is_active === 'true' || is_active === true); }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    updateValues.push(id);
    const query = `UPDATE admin_contact_info SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.query(query, updateValues);

    res.json({ success: true, message: 'Contact info updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
