import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { db } from './config/db.js';
import { requireAdminAuth } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Root & Health
app.get('/', (req, res) => {
  res.json({
    name: "Madhura's Cafe API",
    tagline: 'Authentic Indian Traditional Food & Ayurvedic Wellness Cafe',
    status: 'Operational',
    version: '1.0.0',
    endpoints: [
      '/api/menu',
      '/api/categories',
      '/api/reservations',
      '/api/inquiries',
      '/api/stats',
      '/api/auth/login'
    ]
  });
});

/* ========================================================
   AUTHENTICATION ROUTES
   ======================================================== */
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@madhuracafe.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'madhura123';

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET || 'madhura_cafe_ayurvedic_secret_key_2026',
      { expiresIn: '7d' }
    );
    return res.json({
      success: true,
      token,
      admin: { email, name: "Madhura's Cafe Admin", role: 'admin' }
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
});

app.get('/api/auth/me', requireAdminAuth, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

/* ========================================================
   BANNERS ROUTES
   ======================================================== */
app.get('/api/banners', (req, res) => {
  const banners = db.getBanners();
  res.json({ success: true, count: banners.length, data: banners });
});

app.post('/api/banners', requireAdminAuth, (req, res) => {
  const { title1, image } = req.body;
  if (!title1 || !image) {
    return res.status(400).json({ success: false, message: 'Title1 and image are required' });
  }
  const newBanner = db.createBanner(req.body);
  res.status(201).json({ success: true, message: 'Banner added successfully', data: newBanner });
});

app.put('/api/banners/:id', requireAdminAuth, (req, res) => {
  const updated = db.updateBanner(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Banner not found' });
  res.json({ success: true, message: 'Banner updated successfully', data: updated });
});

app.delete('/api/banners/:id', requireAdminAuth, (req, res) => {
  const deleted = db.deleteBanner(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Banner not found' });
  res.json({ success: true, message: 'Banner deleted successfully' });
});

/* ========================================================
   MENU ITEMS ROUTES
   ======================================================== */
app.get('/api/menu', (req, res) => {
  const items = db.getMenuItems({
    category: req.query.category,
    search: req.query.search
  });
  res.json({ success: true, count: items.length, data: items });
});

app.get('/api/menu/:id', (req, res) => {
  const item = db.getMenuItemById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Dish not found' });
  res.json({ success: true, data: item });
});

app.post('/api/menu', requireAdminAuth, (req, res) => {
  const { name, category, price, description } = req.body;
  if (!name || !price) {
    return res.status(400).json({ success: false, message: 'Dish name and price are required' });
  }
  const newItem = db.createMenuItem(req.body);
  res.status(201).json({ success: true, message: 'Dish added successfully', data: newItem });
});

app.put('/api/menu/:id', requireAdminAuth, (req, res) => {
  const updated = db.updateMenuItem(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Dish not found' });
  res.json({ success: true, message: 'Dish updated successfully', data: updated });
});

app.delete('/api/menu/:id', requireAdminAuth, (req, res) => {
  const deleted = db.deleteMenuItem(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Dish not found' });
  res.json({ success: true, message: 'Dish deleted successfully' });
});

/* ========================================================
   CATEGORIES ROUTES
   ======================================================== */
app.get('/api/categories', (req, res) => {
  const categories = db.getCategories();
  res.json({ success: true, count: categories.length, data: categories });
});

app.post('/api/categories', requireAdminAuth, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });
  const newCat = db.createCategory(req.body);
  res.status(201).json({ success: true, message: 'Category created', data: newCat });
});

app.delete('/api/categories/:id', requireAdminAuth, (req, res) => {
  const deleted = db.deleteCategory(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, message: 'Category deleted' });
});

/* ========================================================
   RESERVATIONS ROUTES
   ======================================================== */
app.get('/api/reservations', requireAdminAuth, (req, res) => {
  const reservations = db.getReservations();
  res.json({ success: true, count: reservations.length, data: reservations });
});

app.post('/api/reservations', (req, res) => {
  const { name, phone, date, time, guests } = req.body;
  if (!name || !phone || !date || !time) {
    return res.status(400).json({ success: false, message: 'Name, phone, date and time are required.' });
  }
  const reservation = db.createReservation(req.body);
  res.status(201).json({
    success: true,
    message: 'Table reservation submitted successfully! We look forward to welcoming you.',
    data: reservation
  });
});

app.patch('/api/reservations/:id/status', requireAdminAuth, (req, res) => {
  const { status } = req.body;
  const updated = db.updateReservationStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ success: false, message: 'Reservation not found' });
  res.json({ success: true, message: `Reservation status updated to ${status}`, data: updated });
});

app.delete('/api/reservations/:id', requireAdminAuth, (req, res) => {
  const deleted = db.deleteReservation(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Reservation not found' });
  res.json({ success: true, message: 'Reservation deleted' });
});

/* ========================================================
   CONTACT INQUIRIES ROUTES
   ======================================================== */
app.get('/api/inquiries', requireAdminAuth, (req, res) => {
  const inquiries = db.getInquiries();
  res.json({ success: true, count: inquiries.length, data: inquiries });
});

app.post('/api/inquiries', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }
  const inquiry = db.createInquiry(req.body);
  res.status(201).json({ success: true, message: 'Thank you for reaching out to Madhura Cafe! We will get back to you shortly.', data: inquiry });
});

/* ========================================================
   STATS DASHBOARD ROUTE
   ======================================================== */
app.get('/api/stats', requireAdminAuth, (req, res) => {
  res.json({ success: true, data: db.getStats() });
});

app.listen(PORT, () => {
  console.log(`🌿 Madhura's Cafe Backend Server running on http://localhost:${PORT}`);
});
