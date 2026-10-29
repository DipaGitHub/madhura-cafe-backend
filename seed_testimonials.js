const pool = require('./db');
require('dotenv').config();

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

async function seedTestimonials() {
  try {
    for (let i = 0; i < googleReviews.length; i++) {
      const item = googleReviews[i];
      const [existing] = await pool.query(
        'SELECT id FROM admin_testimonials WHERE client_name = ?',
        [item.name]
      );
      if (existing.length === 0) {
        await pool.query(
          `INSERT INTO admin_testimonials (client_name, client_position, comment, image_url, review_stars, is_active, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [item.name, item.role, item.quote, item.img, item.stars, true, i + 1]
        );
      } else {
        if (item.img === null) {
          await pool.query(
            'UPDATE admin_testimonials SET image_url = NULL WHERE id = ?',
            [existing[0].id]
          );
        }
      }
    }
    console.log('✅ Google Reviews seeded into admin_testimonials successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    process.exit(1);
  }
}

seedTestimonials();
