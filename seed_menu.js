const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'madhura-cafe',
  port: process.env.DB_PORT || 3306,
});

const menuCategories = [
  { 
    id: 1, name: 'Beverages', description: 'Healing Elixirs & Traditional Drinks', sort_order: 1,
    image_url: '/images/parallax/kanji_sherbet_1789821913031.jpg'
  },
  { 
    id: 2, name: 'Appetizers', description: 'Crisp & Wholesome Starters', sort_order: 2,
    image_url: '/images/parallax/indian_appetizers_1789821998310.jpg'
  },
  { 
    id: 3, name: 'Main Course', description: 'Sattvic & Nourishing Meals', sort_order: 3,
    image_url: '/images/parallax/indian_thali_main_1789822013314.jpg'
  },
  { 
    id: 4, name: 'Desserts', description: 'Guilt-Free Sweet Indulgence', sort_order: 4,
    image_url: '/images/parallax/indian_desserts_1789822033184.jpg'
  },
  { 
    id: 5, name: 'Immunity & Rejuvenation', description: 'Boost vitality and calmness', sort_order: 5,
    image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1400&q=80'
  },
  { 
    id: 6, name: 'Detox & Digestive Health', description: 'Restores gut flora', sort_order: 6,
    image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80'
  },
  { 
    id: 7, name: 'Gut Vitality & Balance', description: 'Rich in prebiotics', sort_order: 7,
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1400&q=80'
  },
  { 
    id: 8, name: 'Cognitive Harmony & Vitality', description: 'Enhances memory and focus', sort_order: 8,
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1400&q=80'
  },
  { 
    id: 9, name: 'Respiratory Wellness', description: 'Soothes throat and builds immunity', sort_order: 9,
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80'
  },
  { 
    id: 10, name: 'Detox & Skin Health', description: 'Purifies blood and cools system', sort_order: 10,
    image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1400&q=80'
  },
  { 
    id: 11, name: 'Protein & Gut Health', description: 'Easily digestible protein', sort_order: 11,
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1400&q=80'
  },
  { 
    id: 12, name: 'Energy & Calm Mind', description: 'Promotes peaceful sleep', sort_order: 12,
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80'
  }
];

const menuItems = [
  // --- BEVERAGES (Category 1) ---
  {
    id: 'brahmi-infused-herbal-brew', category_id: 1, title: 'Brahmi Infused Herbal Brew', price: '₹180',
    short_description: 'Ancient Ayurvedic memory and focus enhancement herbal decoction brewed with fresh Brahmi and wildflower honey.',
    long_description: 'Crafted from wild-harvested Brahmi leaves simmered in pure spring water, this ancient Ayurvedic decoction is sweetened with raw wildflower honey sourced from the Nilgiri hills. Brahmi, known as Medhya Rasayana in classical texts, has been used for over 3,000 years to sharpen memory, reduce anxiety, and promote clarity of thought. Each cup is a mindful ritual — warming, grounding, and deeply nourishing for your nervous system.',
    benefit: 'Enhances cognitive clarity',
    ingredients: ['Brahmi Leaves', 'Wildflower Honey', 'Spring Water', 'Cardamom', 'Black Pepper'],
    image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    is_featured: false, is_popular: true
  },
  {
    id: 'ashwagandha-golden-milk', category_id: 1, title: 'Ashwagandha Golden Milk', price: '₹220',
    short_description: 'Slow-simmered farm-fresh A2 milk with organic turmeric root, black pepper extract, and restorative Ashwagandha.',
    long_description: 'Our Golden Milk is a time-honoured Vedic preparation that brings together the most powerful Ayurvedic roots in one warming cup. A2 milk from grass-fed Indian cows forms the nourishing base, carrying the medicinal properties of Ashwagandha deep into the body tissues (Dhatus). Organic turmeric — combined with black pepper to enhance curcumin absorption by 2000% — gives this elixir its radiant golden hue and potent anti-inflammatory action.',
    benefit: 'Deep stress relief',
    ingredients: ['A2 Milk', 'Ashwagandha Root Powder', 'Organic Turmeric', 'Black Pepper', 'Cardamom', 'Raw Jaggery'],
    image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    is_featured: false, is_popular: false
  },
  {
    id: 'traditional-kanji-sherbet', category_id: 1, title: 'Traditional Kanji Sherbet', price: '₹150',
    short_description: 'A fermented probiotic drink made from black carrots, mustard seeds, and Himalayan pink salt. Excellent for gut health.',
    long_description: 'Kanji is one of India\'s oldest probiotic traditions, fermented naturally over 2-3 days using the power of black carrots, yellow mustard seeds, and mineral-rich Himalayan pink salt. The natural lacto-fermentation process cultivates billions of beneficial bacteria that replenish your gut microbiome, improve digestion, and boost natural immunity. Slightly tangy and pleasantly warming, this is a living drink with every sip.',
    benefit: 'Probiotic & Digestive',
    ingredients: ['Black Carrots', 'Yellow Mustard Seeds', 'Himalayan Pink Salt', 'Spring Water', 'Red Chilli'],
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    is_featured: false, is_popular: false
  },

  // --- APPETIZERS (Category 2) ---
  {
    id: 'sprouted-moong-moringa-tikki', category_id: 2, title: 'Sprouted Moong & Moringa Tikki', price: '₹280',
    short_description: 'Crisp golden patties made with protein-rich sprouted lentils, drumstick leaves, and digestive cumin seeds.',
    long_description: 'These hand-formed patties are a celebration of plant-based nutrition at its finest. Organic green moong is soaked and sprouted for 48 hours to dramatically increase its protein bio-availability and vitamin content. Fresh Moringa (Drumstick) leaves — one of nature\'s most nutrient-dense superfoods — are folded in along with dry-roasted cumin, fresh coriander, and a touch of lime. Pan-seared in cold-pressed sesame oil until perfectly golden.',
    benefit: 'Rich in plant protein',
    ingredients: ['Sprouted Green Moong', 'Moringa Leaves', 'Roasted Cumin', 'Fresh Coriander', 'Lime', 'Sesame Oil'],
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    is_featured: false, is_popular: true
  },
  {
    id: 'beetroot-peanut-samosa', category_id: 2, title: 'Beetroot & Peanut Samosa', price: '₹240',
    short_description: 'Baked rustic samosas filled with earthy beetroot, crushed roasted peanuts, and tempered with mustard seeds.',
    long_description: 'A wholesome reinvention of the beloved Indian samosa — our version is baked, never fried, in a flaky whole-wheat crust. The filling combines slow-roasted beetroot for deep earthy sweetness, dry-roasted peanuts for hearty texture, and a tempering of black mustard seeds, curry leaves, and fresh ginger that awakens all five tastes. High in iron, folate, and healthy fats.',
    benefit: 'High in Iron',
    ingredients: ['Whole Wheat', 'Roasted Beetroot', 'Dry-roasted Peanuts', 'Black Mustard Seeds', 'Curry Leaves', 'Ginger'],
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    is_featured: false, is_popular: false
  },

  // --- MAIN COURSE (Category 3) ---
  {
    id: 'sattvic-ragi-vegetable-platter', category_id: 3, title: 'Sattvic Ragi & Vegetable Platter', price: '₹340',
    short_description: 'Nutritious finger millet dumplings served alongside freshly pressed coconut curry and organic farm greens.',
    long_description: 'Ragi (Finger Millet) is one of the most ancient grains in Indian agriculture, revered in Ayurveda as a tri-doshic food that pacifies all three constitutions. Our dumplings are stone-ground, leavened naturally, and steamed to soft perfection. Served alongside a freshly pressed coconut and green herb curry, seasonal organic vegetables from our farm partner, and a digestive cumin-lime rasam on the side.',
    benefit: 'High fiber, calcium-rich',
    ingredients: ['Finger Millet (Ragi)', 'Fresh Coconut', 'Seasonal Organic Vegetables', 'Curry Leaves', 'Mustard Seeds', 'Turmeric'],
    image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    is_featured: false, is_popular: false
  },
  {
    id: 'panchmel-dal-bajra-roti', category_id: 3, title: 'Panchmel Dal & Bajra Roti', price: '₹320',
    short_description: 'A slow-cooked blend of five lentils tempered with pure cow ghee, served with pearl millet flatbreads.',
    long_description: 'Panchmel Dal — the sacred five-lentil preparation from Rajasthan — is slow-cooked for over two hours in a clay pot over low heat, allowing each lentil to contribute its unique nutritional profile while creating a deeply complex, warming broth. A generous tadka of pure cow ghee (bilona method), hing, and whole spices is poured in at the final moment, releasing aromatic compounds that enhance digestion and flavour simultaneously.',
    benefit: 'Complete Protein, all amino acids',
    ingredients: ['Toor Dal', 'Chana Dal', 'Moong Dal', 'Masoor Dal', 'Urad Dal', 'Bilona Ghee', 'Bajra Flour'],
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    is_featured: false, is_popular: true
  },

  // --- DESSERTS (Category 4) ---
  {
    id: 'jaggery-cardamom-amla-halwa', category_id: 4, title: 'Jaggery & Cardamom Amla Halwa', price: '₹210',
    short_description: 'Slow-cooked Indian gooseberry compote sweetened with chemical-free palm jaggery and green cardamom.',
    long_description: 'Amla (Indian Gooseberry) is the highest natural source of Vitamin C on Earth — a single fruit contains 20 times the Vitamin C of an orange. Our halwa slow-cooks tender amla in pure cow ghee until perfectly soft, then sweetens it with unrefined palm jaggery that retains all its minerals and has a low glycemic impact. Aromatic green cardamom and a touch of saffron from Pampore make this dessert both a treat and a therapeutic tonic.',
    benefit: 'Vitamin C powerhouse, immune boost',
    ingredients: ['Fresh Amla (Indian Gooseberry)', 'Palm Jaggery', 'Green Cardamom', 'Saffron', 'Cow Ghee', 'Cashews'],
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    is_featured: false, is_popular: false
  },

  // --- FEATURED / AYURVEDIC SPECIALS ---
  {
    id: 'ashwagandha-latte', category_id: 5, title: 'Ashwagandha Golden Elixir', price: '₹250',
    short_description: 'Pure A2 organic milk brewed with therapeutic Ashwagandha, organic turmeric, cardamom, and wild forest honey.',
    long_description: 'This is our most beloved Ayurvedic tonic — a deeply nourishing elixir inspired by classical formulations from the Charaka Samhita. Pure A2 milk from ethically raised Gir cows forms the sattvik base, infused with premium Ashwagandha root powder known to reduce the stress hormone cortisol by up to 30% in clinical studies. Wild forest honey, sourced from tribal beekeepers in the Sahyadri mountains, lends natural sweetness and amplifies the adaptogenic properties.',
    benefit: 'Reduces cortisol, boosts vitality & natural calmness',
    ingredients: ['A2 Gir Cow Milk', 'Ashwagandha Root Powder', 'Organic Turmeric', 'Green Cardamom', 'Wild Forest Honey', 'Saffron'],
    image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    is_featured: true, is_popular: true
  },
  {
    id: 'moringa-khichdi', category_id: 6, title: 'Moringa & Millet Khichdi', price: '₹300',
    short_description: 'Ancient foxtail millet and sprouted moong slow-cooked with drumstick leaves, cumin, and fragrant desi ghee.',
    long_description: 'Khichdi is celebrated in Ayurveda as the ultimate healing food — balancing all three doshas, easy on the digestive fire, and deeply nourishing for the tissues. Our version elevates this classic with mineral-rich foxtail millet (Kangni) instead of rice, and adds freshly harvested Moringa leaves that contain 92 nutrients and 46 antioxidants. A generous finishing of bilona-method desi ghee, cumin seeds, and fresh curry leaves unlocks the full spectrum of flavour and healing.',
    benefit: 'Nutrient-dense superfood, eases digestion & restores gut flora',
    ingredients: ['Foxtail Millet (Kangni)', 'Sprouted Green Moong', 'Fresh Moringa Leaves', 'Bilona Desi Ghee', 'Cumin Seeds', 'Curry Leaves', 'Turmeric'],
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    is_featured: true, is_popular: false
  },
  {
    id: 'triphala-dosa', category_id: 7, title: 'Triphala Fermented Dosa', price: '₹220',
    short_description: 'Stone-ground heritage millet crepe crisped in cold-pressed sesame oil, served with digestive herbal chutneys.',
    long_description: 'The batter for our Triphala Dosa is stone-ground from heritage Kodo millet and naturally fermented for 18 hours — this process cultivates beneficial bacteria that transform complex carbohydrates into easily digestible forms and produce natural B vitamins. A whisper of Triphala powder (Amla, Haritaki, Bibhitaki) is folded in — the most revered digestive tonic in Ayurveda. Served with three sacred chutneys: raw coconut, roasted red pepper, and a detoxifying curry leaf rasam.',
    benefit: 'Tri-doshic balance, rich in prebiotics and bio-available iron',
    ingredients: ['Kodo Millet', 'Urad Dal', 'Triphala Powder', 'Cold-Pressed Sesame Oil', 'Fresh Coconut', 'Curry Leaves', 'Red Pepper'],
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    is_featured: true, is_popular: false
  },
  {
    id: 'brahmi-sattvic-thali', category_id: 8, title: 'Brahmi Sattvic Platter', price: '₹380',
    short_description: 'Brahmi herb infusions with seasonal organic vegetables, hand-churned Vedic butter, and steamed red rice.',
    long_description: 'Our most complete meal — the Brahmi Sattvic Platter is a full Ayurvedic thali curated to nourish body, mind, and spirit simultaneously. At its heart is heirloom Navara red rice (Kerala\'s medicinal rice) that is lower in glycemic index and higher in antioxidants than white rice. Paired with Brahmi-infused ghee (prepared with the ancient siddha method), a rotating seasonal sabzi from our organic farm, lentil soup, and a small clay cup of digestive mukhwas.',
    benefit: 'Enhances memory, cognitive focus & cell rejuvenation',
    ingredients: ['Navara Red Rice', 'Brahmi-Infused Ghee', 'Seasonal Organic Vegetables', 'Toor Dal', 'Digestive Mukhwas', 'Rock Salt'],
    image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    is_featured: true, is_popular: true
  },
  {
    id: 'tulsi-ginger-rasam', category_id: 9, title: 'Tulsi & Ginger Rasam', price: '₹180',
    short_description: 'A healing South Indian broth infused with Holy Basil, freshly crushed black pepper, and cold-pressed tamarind.',
    long_description: 'Rasam — the ancient South Indian healing broth — has been prescribed by Ayurvedic physicians for centuries as the first food during illness, recovery, and seasonal transitions. Our Tulsi Rasam is made with fresh Holy Basil leaves (considered sacred in India and proven to have adaptogenic, anti-viral, and anti-bacterial properties), freshly grated ginger root, hand-crushed black pepper, and cold-pressed tamarind water. Simmered low and slow to preserve all medicinal volatile oils.',
    benefit: 'Soothes throat, builds immunity & aids digestion',
    ingredients: ['Fresh Tulsi (Holy Basil)', 'Fresh Ginger Root', 'Black Pepper', 'Cold-Pressed Tamarind', 'Curry Leaves', 'Mustard Seeds', 'Rock Salt'],
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    is_featured: true, is_popular: false
  },
  {
    id: 'amla-cumin-cooler', category_id: 10, title: 'Amla Cumin Cooler', price: '₹150',
    short_description: 'Fresh Indian gooseberry extract blended with roasted cumin, mint, and a touch of black salt.',
    long_description: 'This refreshing cooler draws on the purifying power of fresh Amla — pressed to order for maximum Vitamin C potency — combined with the carminative properties of dry-roasted cumin that soothes the digestive tract and reduces bloating. Fresh garden mint adds a cooling, pitta-pacifying energy, while a pinch of black salt (Kala Namak) provides essential trace minerals and a distinctive mineral depth that makes this drink instantly addictive.',
    benefit: 'Rich in Vitamin C, purifies blood & cools the system',
    ingredients: ['Fresh Amla (Indian Gooseberry)', 'Dry-Roasted Cumin', 'Fresh Mint', 'Black Salt', 'Rock Sugar', 'Spring Water'],
    image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    is_featured: true, is_popular: false
  },
  {
    id: 'sattvic-paneer-tikka', category_id: 11, title: 'Sattvic Paneer Tikka', price: '₹320',
    short_description: 'Fresh farm cottage cheese marinated in hung curd, turmeric, and gentle aromatic spices, grilled to perfection.',
    long_description: 'Our paneer is made fresh every morning from A2 milk sourced from a small family farm in Pune district. The warm, freshly pressed paneer is marinated for 4 hours in thick hung curd, organic turmeric, mild sattvic spices (avoiding tamasic ingredients like onion and garlic), and a touch of lime. Grilled over a slow coal fire until the outside develops a golden char while the inside remains pillowy and moist.',
    benefit: 'Easily digestible protein, balances all doshas',
    ingredients: ['A2 Paneer', 'Hung Curd', 'Organic Turmeric', 'Mild Sattvic Spices', 'Lime', 'Cold-Pressed Mustard Oil', 'Fresh Coriander'],
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    is_featured: true, is_popular: true
  },
  {
    id: 'makhana-almond-kheer', category_id: 12, title: 'Makhana & Almond Kheer', price: '₹260',
    short_description: 'Fox nuts and crushed almonds slow-cooked in A2 milk, sweetened lightly with natural jaggery and saffron strands.',
    long_description: 'Makhana (Lotus Seeds / Fox Nuts) are revered in Ayurveda as a Medhya Rasayana — a tonic that builds Ojas, the subtle vital essence that governs immunity, vitality, and reproductive health. Our kheer is slow-cooked for 45 minutes, allowing the Makhana to absorb the A2 milk fully and become luxuriously creamy. Blanched and peeled almonds are added for heart-healthy fats and a satisfying richness. Sweetened only with date jaggery and perfumed with authentic Kashmiri saffron.',
    benefit: 'Builds Ojas, promotes peaceful sleep & sustained energy',
    ingredients: ['Makhana (Lotus Seeds)', 'Blanched Almonds', 'A2 Milk', 'Date Jaggery', 'Kashmiri Saffron', 'Green Cardamom', 'Rose Petals'],
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    is_featured: true, is_popular: false
  }
];

async function seed() {
  try {
    console.log('Clearing old data...');
    await pool.query('DELETE FROM admin_menu_items');
    await pool.query('DELETE FROM admin_menu_categories');

    console.log('Inserting categories...');
    for (const cat of menuCategories) {
      await pool.query(
        'INSERT INTO admin_menu_categories (id, name, description, sort_order, image_url) VALUES (?, ?, ?, ?, ?)',
        [cat.id, cat.name, cat.description, cat.sort_order, cat.image_url]
      );
    }

    console.log('Inserting menu items...');
    for (const item of menuItems) {
      await pool.query(
        'INSERT INTO admin_menu_items (id, category_id, title, short_description, benefit, price, image_url, ingredients, long_description, is_featured, is_popular) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [item.id, item.category_id, item.title, item.short_description, item.benefit, item.price, item.image_url, JSON.stringify(item.ingredients || []), item.long_description || null, item.is_featured ? 1 : 0, item.is_popular ? 1 : 0]
      );
    }

    console.log('Menu seeded successfully!');
  } catch (error) {
    console.error('Error seeding menu:', error);
  } finally {
    pool.end();
  }
}

seed();
