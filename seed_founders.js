require('dotenv').config();
const pool = require('./db');

const seedFounders = async () => {
    try {
        await pool.query('DELETE FROM admin_founders');
        console.log('Cleared existing founders.');

        const founders = [
            {
                name: 'Mr. Gourab Sanyal',
                designation: '7+ Global Experience | Digital Marketer',
                description: '<p>A dynamic and seasoned marketing professional, <strong>Gourab Sanyal</strong> has dedicated his career to building global brands and transforming business narratives. With over <em>7 years of international experience</em>, he brings a forward-thinking, data-driven approach to every project.</p><ul><li>Spearheaded successful global campaigns across 3 continents.</li><li>Specializes in bridging cultural gaps through <strong>innovative storytelling</strong>.</li><li>Believes that every brand has a soul waiting to be uncovered.</li></ul><p><span style="color: #FFD28D;">"Connecting the dots between strategy and creativity."</span></p>',
                image_quote: 'Beyond knowledge... partnership.',
                contact_info: '+91 98765 43210',
                image_url: '/public/founders/gourab.jpg', // Placeholder
                display_order: 1
            },
            {
                name: 'Mrs. Mousumi Sanyal',
                designation: 'Operations Director',
                description: '<p>With a keen eye for detail and an unwavering commitment to excellence, <strong>Mousumi Sanyal</strong> orchestrates the complex operational symphony that makes our vision possible. She believes that <span style="color: #FFD28D;">sustainable success</span> is built on a foundation of robust processes and genuine human connections.</p><p><br></p><h3>Key Focus Areas:</h3><ul><li>Operational Efficiency & Scalability</li><li>Team Leadership and Culture Building</li><li>Sustainable Business Practices</li></ul><p><br></p><p>Her leadership style is characterized by empathy, resilience, and a relentless pursuit of quality.</p>',
                image_quote: 'Energy and trust build real change partnership.',
                contact_info: '+91 98765 43211',
                image_url: '/public/founders/mousumi.jpg', // Placeholder
                display_order: 2
            }
        ];

        for (const f of founders) {
            await pool.query(
                `INSERT INTO admin_founders (name, designation, description, image_quote, contact_info, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [f.name, f.designation, f.description, f.image_quote, f.contact_info, f.image_url, f.display_order, true]
            );
        }

        console.log('Successfully seeded founders with rich text descriptions!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding founders:', err);
        process.exit(1);
    }
};

seedFounders();
