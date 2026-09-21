const db = require('./db');

const blogPosts = [
  {
    title: 'The Ancient Science of Food as Medicine in Ayurvedic Cafes',
    date: '2026-10-14',
    author: 'Vaidya Dr. Sharma',
    summary: 'Discover how traditional herbs like Brahmi, Ashwagandha, and Shatavari transform everyday meals into therapeutic nourishment for the mind and body.',
    img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    tag: 'Ayurveda & Health'
  },
  {
    title: 'Why Golden Milk with Turmeric and Black Pepper is a Daily Superfood',
    date: '2026-10-08',
    author: 'Chef Ananya Rao',
    summary: 'The bio-enhancing synergy of piperine with organic curcumin creates the ultimate cellular shield against oxidative stress and inflammation.',
    img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    tag: 'Nutrition'
  },
  {
    title: 'Balancing Your Tridosha (Vata, Pitta, Kapha) Through Seasonal Diet',
    date: '2026-09-28',
    author: 'Madhura Wellness Team',
    summary: 'Learn how aligning your culinary choices with natural seasonal cycles promotes restorative vitality and glowing longevity.',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    tag: 'Holistic Living'
  }
];

const fullContent = `
<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>
<blockquote>"The culinary arts of Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."</blockquote>
<h3>A Symphony of Flavors</h3>
<p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>
`;

async function seed() {
    console.log("Seeding blogs...");
    for (const post of blogPosts) {
        try {
            await db.query(
                `INSERT INTO admin_blogs (publish_date, tags, banner_image, title, short_description, full_content, author) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [post.date, post.tag, post.img, post.title, post.summary, fullContent, post.author]
            );
            console.log(`Seeded: ${post.title}`);
        } catch (error) {
            console.error(`Failed to seed ${post.title}:`, error);
        }
    }
    console.log("Seeding complete.");
    process.exit(0);
}

// Give db.js time to init tables if they don't exist
setTimeout(seed, 1000);
