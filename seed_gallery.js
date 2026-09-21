const db = require('./db');

const galleryItems = [
  {
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    title: 'Therapeutic Food Delicacy',
    type: 'food'
  },
  {
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    title: 'Moringa & Millet Khichdi',
    type: 'food'
  },
  {
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    title: 'Cafe Ambience',
    type: 'interior'
  },
  {
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    title: 'Traditional Seating',
    type: 'interior'
  },
  {
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    title: 'Ashwagandha Golden Elixir',
    type: 'food'
  },
  {
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    title: 'Warm Welcome',
    type: 'interior'
  },
  {
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    title: 'Turmeric Superfood',
    type: 'food'
  },
  {
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
    title: 'Private Dining Area',
    type: 'interior'
  },
  {
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    title: 'Ayurvedic Preparation',
    type: 'food'
  }
];

async function seed() {
    console.log("Seeding gallery...");
    for (const item of galleryItems) {
        try {
            await db.query(
                `INSERT INTO admin_gallery (image, image_title, image_type) VALUES (?, ?, ?)`,
                [item.image, item.title, item.type]
            );
            console.log(`Seeded gallery item: ${item.title}`);
        } catch (error) {
            console.error(`Failed to seed ${item.title}:`, error);
        }
    }
    console.log("Seeding complete.");
    process.exit(0);
}

// Give db.js time to init tables if they don't exist
setTimeout(seed, 1000);
