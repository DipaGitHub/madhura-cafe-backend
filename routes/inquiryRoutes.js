const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'madhuracafe.co.in',
        port: parseInt(process.env.SMTP_PORT || '465', 10),
        secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER || 'info@madhuracafe.co.in',
            pass: process.env.SMTP_PASS || 'Cafe#de#mAdhura26'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// @route   POST /api/inquiries
// @desc    Receive customer contact/enquiry, save to DB, and send SMTP notification email
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required.'
            });
        }

        // 1. Insert into database
        const insertQuery = `
            INSERT INTO admin_inquiries (name, email, phone, subject, message)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(insertQuery, [
            name.trim(),
            email.trim(),
            phone ? phone.trim() : null,
            subject ? subject.trim() : 'Website Contact Enquiry',
            message.trim()
        ]);

        // 2. Send email via SMTP
        let emailSent = false;
        let emailError = null;
        try {
            const transporter = createTransporter();
            const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'info@madhuracafe.co.in';
            const mailFrom = process.env.SMTP_FROM || `"Madhura's Cafe" <${process.env.SMTP_USER || 'info@madhuracafe.co.in'}>`;

            const mailOptions = {
                from: mailFrom,
                to: receiverEmail,
                replyTo: email.trim(),
                subject: `[New Inquiry] ${subject || 'Website Contact Form'} - ${name.trim()}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0c080; border-radius: 8px; background-color: #faf8f5;">
                        <h2 style="color: #633918; border-bottom: 2px solid #e0c080; padding-bottom: 10px;">New Contact Inquiry Received</h2>
                        <p style="font-size: 14px; color: #555;">You have received a new customer inquiry from <strong>Madhura's Cafe Website</strong>:</p>
                        
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <tr>
                                <td style="padding: 8px 12px; font-weight: bold; width: 120px; color: #333;">Name:</td>
                                <td style="padding: 8px 12px; color: #222;">${name.trim()}</td>
                            </tr>
                            <tr style="background-color: #f2eee9;">
                                <td style="padding: 8px 12px; font-weight: bold; color: #333;">Email:</td>
                                <td style="padding: 8px 12px; color: #222;"><a href="mailto:${email.trim()}">${email.trim()}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 12px; font-weight: bold; color: #333;">Phone:</td>
                                <td style="padding: 8px 12px; color: #222;">${phone ? phone.trim() : 'N/A'}</td>
                            </tr>
                            <tr style="background-color: #f2eee9;">
                                <td style="padding: 8px 12px; font-weight: bold; color: #333;">Subject:</td>
                                <td style="padding: 8px 12px; color: #222;">${subject ? subject.trim() : 'Website Contact Enquiry'}</td>
                            </tr>
                        </table>

                        <div style="margin-top: 20px; padding: 15px; background: #ffffff; border-left: 4px solid #633918; border-radius: 4px;">
                            <strong style="color: #633918; display: block; margin-bottom: 8px;">Customer Message:</strong>
                            <p style="white-space: pre-line; color: #333; margin: 0; line-height: 1.6;">${message.trim()}</p>
                        </div>

                        <p style="margin-top: 25px; font-size: 12px; color: #888; text-align: center;">
                            This email was automatically generated from Madhura's Cafe Contact Form.
                        </p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            emailSent = true;
        } catch (mailErr) {
            console.error('SMTP Email Send Error:', mailErr);
            emailError = mailErr.message;
        }

        res.status(200).json({
            success: true,
            message: emailSent 
                ? 'Your inquiry has been sent successfully!' 
                : 'Inquiry saved successfully. (Email notification queued)',
            inquiryId: result.insertId,
            emailSent,
            ...(emailError ? { emailNotice: emailError } : {})
        });
    } catch (error) {
        console.error('Inquiry Submission Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit inquiry. Please try again later.',
            error: error.message
        });
    }
});

// @route   GET /api/inquiries
// @desc    Get all inquiries for admin panel
// @access  Admin
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT id, name, email, phone, subject, message, created_at AS createdAt 
            FROM admin_inquiries 
            ORDER BY id DESC
        `;
        const [inquiries] = await db.query(query);

        res.status(200).json({
            success: true,
            count: inquiries.length,
            data: inquiries
        });
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inquiries.',
            error: error.message
        });
    }
});

// @route   DELETE /api/inquiries/:id
// @desc    Delete an inquiry by ID
// @access  Admin
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM admin_inquiries WHERE id = ?', [id]);
        res.status(200).json({
            success: true,
            message: 'Inquiry deleted successfully.'
        });
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete inquiry.',
            error: error.message
        });
    }
});

module.exports = router;
