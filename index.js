const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// Strip '/backend' prefix from the URL to support cPanel Passenger
app.use((req, res, next) => {
    if (req.url.startsWith('/backend')) {
        req.url = req.url.substring(8); // Remove '/backend'
    }
    next();
});
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// --- Routes ---
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/page-banners', require('./routes/pageBannerRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/services', require('./routes/servicesRoutes'));
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/latestUpdates', require('./routes/latestUpdatesRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/resources', require('./routes/resourcesRoutes'));
app.use('/api/serviceApplications', require('./routes/serviceApplications'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/pricing', require('./routes/pricingRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/logo-carousel', require('./routes/logoCarousel'));
app.use('/api/aboutUs', require('./routes/aboutUsRoutes'));
app.use('/api/menus', require('./routes/menuRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/specialities', require('./routes/specialityRoutes'));
app.use('/api/openingHours', require('./routes/openingHoursRoutes'));
app.use('/api/contactInfo', require('./routes/contactInfoRoutes'));
app.use('/api/founders', require('./routes/founderRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
// --- Root Route / Health Check ---
app.get('/', (req, res) => {
    res.status(200).json({
        message: "🚀 Server is running successfully!",
        status: "OK",
        version: "1.0.0"
    });
});

// --- Serve Static Public Assets ---
app.use('/public', express.static(path.join(__dirname, 'public')));

// --- Fallback 404 ---
app.use((req, res) => {
    res.status(404).send("Endpoint Not Found.");
});

// --- Global Error Handler (Multer & General Errors) ---
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
            success: false, 
            message: 'File is too large. Maximum allowed size is 50MB.' 
        });
    }
    if (err.message && err.message.includes('Only image files')) {
        return res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    }
    console.error('Unhandled server error:', err);
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});