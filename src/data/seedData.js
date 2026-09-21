export const initialBanners = [
  {
    id: 'banner-1',
    title1: "Madhura's Cafe",
    title2: '100% Ayurvedic Wellness',
    description: 'Experience the healing power of authentic Vedic traditions.',
    image: 'https://images.unsplash.com/photo-1606214306354-95493037eb9e?auto=format&fit=crop&w=1600&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'banner-2',
    title1: 'Sattvic Pure Thali',
    title2: 'Traditional Dining Experience',
    description: 'Nourish your soul with our organic, seasonal, and balancing recipes.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1600&q=80',
    createdAt: new Date().toISOString()
  }
];

export const initialCategories = [
  { id: 'cat-1', name: 'Herbal Elixirs & Kashayam', slug: 'herbal-elixirs', icon: 'Leaf', description: 'Traditional Ayurvedic decoctions and immunity teas brewed with therapeutic herbs' },
  { id: 'cat-2', name: 'Millet & Ancient Grain Tiffins', slug: 'millet-tiffins', icon: 'Wheat', description: 'Stone-ground, naturally fermented dosas and idlis made with foxtail and ragi' },
  { id: 'cat-3', name: 'Sattvic Mahathali & Bowls', slug: 'sattvic-thalis', icon: 'Utensils', description: 'Wholesome balanced Indian meals prepared with cold-pressed oils and pure A2 cow ghee' },
  { id: 'cat-4', name: 'Ayurvedic Soups & Rasams', slug: 'soups-rasams', icon: 'Coffee', description: 'Digestive and warming infusions seasoned with fresh black pepper and curry leaves' },
  { id: 'cat-5', name: 'Natural Sweets & Heritage Bites', slug: 'natural-sweets', icon: 'Sparkles', description: 'Jaggery, dry-fruit, and wild-honey based nutritious confections' }
];

export const initialMenuItems = [
  {
    id: 'dish-1',
    name: 'Triphala & Tulsi Immunity Kashayam',
    category: 'cat-1',
    price: 140,
    rating: 4.9,
    description: 'A soothing hot infusion of Holy Basil (Tulsi), Triphala, black pepper, and dry ginger sweetened with organic raw honey.',
    healthBenefits: ['Boosts Cellular Immunity', 'Enhances Digestion', 'Relieves Respiratory Stress'],
    ingredients: ['Tulsi leaves', 'Triphala churnam', 'Black pepper', 'Sunthi', 'Raw Forest Honey'],
    dietary: ['Sattvic', 'Vegan', 'Ayurvedic', 'Sugar-Free'],
    isPopular: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dish-2',
    name: 'Ragi & Moringa Crisp Ghee Dosa',
    category: 'cat-2',
    price: 210,
    rating: 4.8,
    description: 'Crisp stone-ground finger millet crepe infused with fresh drumstick (moringa) leaves, roasted in pure A2 Gir cow ghee.',
    healthBenefits: ['Rich in Calcium & Iron', 'Low Glycemic Index', 'Strengthens Bones'],
    ingredients: ['Sprouted Ragi', 'Fresh Moringa', 'A2 Desi Ghee', 'Cumin', 'Rock Salt'],
    dietary: ['Gluten-Free', 'High-Fiber', 'Sattvic'],
    isPopular: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dish-3',
    name: 'Madhura Royal Sattvic Thali',
    category: 'cat-3',
    price: 360,
    rating: 5.0,
    description: 'A complete Ayurvedic balanced platter: red rice, sprouted moong curry, ash gourd kootu, digestive buttermilk, and amla pickle.',
    healthBenefits: ['Complete 6-Taste Balanced Meal', 'Gut Microbiome Health', 'Deep Nourishment (Ojas)'],
    ingredients: ['Kerala Red Rice', 'Sprouted Moong', 'Ash Gourd', 'Fresh Coconut', 'Amla', 'Curd'],
    dietary: ['Vegetarian', 'Sattvic', 'High-Protein'],
    isPopular: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dish-4',
    name: 'Pepper & Drumstick Digestive Rasam',
    category: 'cat-4',
    price: 120,
    rating: 4.7,
    description: 'Steaming hot herbal broth steeped with crushed black peppercorns, cumin seeds, garlic-free hing, and fresh coriander root.',
    healthBenefits: ['Ignites Digestive Fire (Agni)', 'Metabolism Booster', 'Clears Toxins (Ama)'],
    ingredients: ['Drumstick broth', 'Tellicherry Pepper', 'Jeera', 'Tamarind pulp', 'Curry Leaves'],
    dietary: ['Vegan', 'Gluten-Free', 'Low-Calorie'],
    isPopular: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dish-5',
    name: 'Golden Turmeric Ashwagandha Elixir',
    category: 'cat-1',
    price: 160,
    rating: 4.9,
    description: 'Warm almond milk infused with wild Lakadong turmeric, Ashwagandha root extract, green cardamom, and saffron strands.',
    healthBenefits: ['Stress & Cortisol Reduction', 'Deep Restorative Sleep', 'Potent Anti-Inflammatory'],
    ingredients: ['Almond milk', 'Lakadong Turmeric', 'Ashwagandha', 'Kashmiri Saffron', 'Cardamom'],
    dietary: ['Dairy-Free', 'Vegan', 'Adaptogen-Rich'],
    isPopular: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dish-6',
    name: 'Foxtail Millet Pongal with Cashews',
    category: 'cat-2',
    price: 190,
    rating: 4.8,
    description: 'Hearty porridge of foxtail millet and split yellow moong dal tempered with whole pepper, cumin, ginger, and curry leaves.',
    healthBenefits: ['Sustained Energy Release', 'Easy on Gut', 'High Plant Protein'],
    ingredients: ['Foxtail Millet (Navane)', 'Moong Dal', 'A2 Ghee', 'Whole Black Pepper', 'Cashews'],
    dietary: ['Sattvic', 'Gluten-Free'],
    isPopular: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80'
  }
];

export const initialReservations = [
  {
    id: 'res-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    date: '2026-09-20',
    time: '19:30',
    guests: 4,
    seatingPreference: 'Indoor Heritage Corner',
    specialRequests: 'Sattvic preparation without onion/garlic, celebrating anniversary',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-102',
    name: 'Priya Sundaram',
    email: 'priya.s@example.com',
    phone: '+91 94432 10987',
    date: '2026-09-21',
    time: '13:00',
    guests: 2,
    seatingPreference: 'Garden Courtyard',
    specialRequests: 'Ayurvedic Thali recommendation for lunch',
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
];

export const initialInquiries = [
  {
    id: 'inq-1',
    name: 'Vikram Joshi',
    email: 'vikram.j@example.com',
    subject: 'Ayurvedic Catering for Wellness Retreat',
    message: 'Hello Madhura Cafe team, we are organizing a 3-day yoga & meditation retreat in Bangalore and would like to order sattvic herbal meals for 25 people.',
    createdAt: new Date().toISOString(),
    status: 'Unread'
  }
];
