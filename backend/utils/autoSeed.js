const Product = require('../models/Product');
const Category = require('../models/Category');
const Workshop = require('../models/Workshop');
const User = require('../models/User');
const Order = require('../models/Order');
const Expense = require('../models/Expense');

const autoSeed = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@hampertells.com' });
    const productCount = await Product.countDocuments();
    if (adminExists && productCount >= 45) {
      console.log(`[AutoSeed] Database already initialized with Admin and ${productCount} Catalog Products.`);
      return;
    }

    console.log('[AutoSeed] Initializing Admin, Customers, Catalog, Monthly Sales & Loss records...');

    // Clear existing collections to ensure clean data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Workshop.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Expense.deleteMany({});

    // 1. Seed Categories
    const categories = [
      { name: 'Hampers', slug: 'hampers', description: 'Curated luxury hampers for special moments', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80' },
      { name: 'Bouquets', slug: 'bouquets', description: 'Handcrafted floral & artisan bouquet arrangements', image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&auto=format&fit=crop&q=80' },
      { name: 'Chocolate Bouquets', slug: 'chocolate-bouquets', description: 'Delicious chocolate bouquet creations', image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=500&auto=format&fit=crop&q=80' },
      { name: 'Personalized Gifts', slug: 'personalized-gifts', description: 'Custom engraved & memory gifts', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&auto=format&fit=crop&q=80' },
      { name: 'Birthday Gifts', slug: 'birthday-gifts', description: 'Joyful birthday surprise boxes & combos', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=80' },
      { name: 'Anniversary Gifts', slug: 'anniversary-gifts', description: 'Romantic gifts expressing timeless love', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80' },
      { name: 'Flowers', slug: 'flowers', description: 'Freshly picked roses, lilies & sunflowers', image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&auto=format&fit=crop&q=80' },
      { name: 'Gift Combos', slug: 'gift-combos', description: 'Thoughtfully paired bouquets & sweets', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80' },
      { name: 'Celebration Gifts', slug: 'celebration-gifts', description: 'Grand celebration luxury boxes', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=500&auto=format&fit=crop&q=80' }
    ];
    await Category.insertMany(categories);

    // 2. Seed Rich Product Catalog (Handcrafted creations from @_thehampertells_)
    const products = [
  {
    "name": "Aesthetic Pink Pipe-Cleaner Lily Bouquet",
    "description": "Handcrafted with loving care! Premium velvety pink chenille pipe-cleaner lilies, handmade bud stamens, and fresh eucalyptus accents in blush paper wrapping with the signature quote: \"The kind of surprise SHE DESERVES\". A forever keepsake bloom that never withers.",
    "price": 699,
    "category": "Bouquets",
    "occasion": "For Her",
    "images": [
      "/images/instagram/media_1792779839320_a25e7295.jpg",
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 25,
    "rating": 5,
    "reviewsCount": 48,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 42 cm, Diameter: 28 cm",
    "careTips": "Dust gently with soft brush or dry cloth. 100% eternal artisan craft.",
    "includedItems": [
      "6 Handcrafted Pink Chenille Lilies",
      "Aesthetic Paper Wrapping",
      "Ribbon Bow",
      "Personalized Gift Card"
    ]
  },
  {
    "name": "Butterfly Fairy-Light Red Rose Bouquet",
    "description": "Romantic fresh Dutch red roses framed by delicate 3D golden butterfly wings, twinkling warm fairy lights, and wrapped in luxury midnight black paper with burgundy ribbon.",
    "price": 849,
    "category": "Bouquets",
    "occasion": "Anniversary",
    "images": [
      "/images/instagram/media_1792779839320_a25e7295.jpg",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 20,
    "rating": 4.9,
    "reviewsCount": 52,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 45 cm, Diameter: 30 cm",
    "careTips": "Trim stems diagonally 1-2 cm and place in fresh water. Battery pack for fairy lights included.",
    "includedItems": [
      "10 Fresh Red Roses",
      "Warm LED Fairy Wire",
      "3D Golden Butterflies",
      "Midnight Black Wrap",
      "Burgundy Satin Ribbon"
    ]
  },
  {
    "name": "Classic Velvet Red Rose Bouquet",
    "description": "A timeless romantic bouquet of 12 hand-selected velvety red roses wrapped in blush pink satin paper with baby’s breath sprigs and tied with an ivory silk ribbon.",
    "price": 699,
    "category": "Bouquets",
    "occasion": "For Her",
    "images": [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 35,
    "rating": 4.9,
    "reviewsCount": 42,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 45 cm, Diameter: 30 cm",
    "careTips": "Trim stems diagonally 1-2 cm and place in fresh cool water. Keep away from direct sunlight.",
    "includedItems": [
      "12 Fresh Dutch Red Roses",
      "Gypsophila / Baby’s Breath",
      "Blush Pink Satin Wrapping",
      "Silk Ribbon",
      "Personalized Gift Card"
    ]
  },
  {
    "name": "Grand 50 Red Roses Romantic Bouquet",
    "description": "The ultimate royal declaration of love! A majestic, spherical bouquet of 50 handpicked deep red roses in matte black luxury paper with golden trim and rich burgundy ribbons.",
    "price": 2499,
    "category": "Bouquets",
    "occasion": "Anniversary",
    "images": [
      "/images/instagram/media_1792779839325_83d201a7.jpg",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 8,
    "rating": 5,
    "reviewsCount": 39,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 55 cm, Diameter: 45 cm",
    "careTips": "Place in large clean vase with ample fresh water. Spray petals lightly with mist daily.",
    "includedItems": [
      "50 Premium Dutch Red Roses",
      "Matte Black Florist Paper with Gold Trim",
      "Burgundy Double Satin Ribbon",
      "Luxury Gift Envelope"
    ]
  },
  {
    "name": "Holographic Iridescent Pastel Rose Bouquet",
    "description": "Mesmerizing pastel pink and white roses presented in futuristic iridescent holographic Korean wrapping that shimmers with rainbow reflections under sunlight.",
    "price": 899,
    "category": "Bouquets",
    "occasion": "For Her",
    "images": [
      "/images/instagram/media_1792779839325_83d201a7.jpg",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 18,
    "rating": 4.9,
    "reviewsCount": 29,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 46 cm, Diameter: 32 cm",
    "careTips": "Keep water fresh and cool. Do not crumple the holographic paper.",
    "includedItems": [
      "12 Pastel Pink & White Roses",
      "Holographic Rainbow Foil Wrap",
      "Ivory Satin Ribbon",
      "Brand Gift Card"
    ]
  },
  {
    "name": "Sunflower Love Sunshine Bouquet",
    "description": "Vibrant golden sunflowers radiating pure joy, paired with delicate baby’s breath and fresh eucalyptus foliage wrapped in rustic eco-friendly kraft paper.",
    "price": 699,
    "category": "Bouquets",
    "occasion": "Birthday",
    "images": [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 25,
    "rating": 4.8,
    "reviewsCount": 31,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 48 cm, Diameter: 32 cm",
    "careTips": "Change vase water every 48 hours. Remove leaves that fall below water level.",
    "includedItems": [
      "5 Premium Sunflowers",
      "Eucalyptus Leaves",
      "Baby’s Breath Stems",
      "Eco Kraft Paper",
      "Custom Brand Ribbon"
    ]
  },
  {
    "name": "Pastel Hydrangea & Blush Roses Bouquet",
    "description": "An ethereal pastel floral creation featuring voluminous cloud-like blue hydrangeas paired with peach roses and white chrysanthemums in luxury layered pleat wrap.",
    "price": 1199,
    "category": "Bouquets",
    "occasion": "Anniversary",
    "images": [
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 15,
    "rating": 5,
    "reviewsCount": 24,
    "isFeatured": false,
    "isBestSeller": false,
    "customizable": true,
    "dimensions": "Height: 50 cm, Diameter: 35 cm",
    "careTips": "Hydrangeas love water! Mist petals lightly daily to preserve fullness.",
    "includedItems": [
      "2 Giant Blue Hydrangeas",
      "8 Peach Roses",
      "White Chrysanthemums",
      "French Pleated Wrapping"
    ]
  },
  {
    "name": "Elegance Purple Orchid & Baby’s Breath",
    "description": "Exquisite exotic purple dendrobium orchids gracefully styled with silver dollar eucalyptus and baby’s breath in a matte lavender wrap.",
    "price": 949,
    "category": "Bouquets",
    "occasion": "For Her",
    "images": [
      "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 20,
    "rating": 4.8,
    "reviewsCount": 19,
    "isFeatured": false,
    "isBestSeller": false,
    "customizable": true,
    "dimensions": "Height: 46 cm, Diameter: 28 cm",
    "careTips": "Orchids last up to 2 weeks when kept in ambient temperature away from direct sunlight.",
    "includedItems": [
      "8 Dendrobium Purple Orchids",
      "Eucalyptus Sprigs",
      "Matte Lavender Wrap",
      "Gift Tag"
    ]
  },
  {
    "name": "Red Rose Cone Wrap with Red Satin Bow",
    "description": "A minimalist chic white presentation cone holding long-stem velvety red roses accented with gypsophila and tied with a large scarlet satin bow.",
    "price": 549,
    "category": "Bouquets",
    "occasion": "For Her",
    "images": [
      "/images/instagram/media_1792779839325_83d201a7.jpg",
      "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 22,
    "rating": 4.8,
    "reviewsCount": 27,
    "isFeatured": false,
    "isBestSeller": false,
    "customizable": true,
    "dimensions": "Height: 42 cm, Diameter: 22 cm",
    "careTips": "Keep upright in water or dry spray.",
    "includedItems": [
      "6 Dutch Red Roses",
      "Gypsophila Stems",
      "Crisp White Cone",
      "Wide Scarlet Ribbon"
    ]
  },
  {
    "name": "Cadbury Dairy Milk Silk Purple Fan Bouquet with Crochet Lily",
    "description": "Signature @_thehampertells_ showstopper! Full-size Cadbury Dairy Milk Silk bars stylishly arranged in a royal purple fan structure, crowned with a handcrafted crochet purple lily and matching ribbon bow.",
    "price": 849,
    "category": "Chocolate Bouquets",
    "occasion": "Celebration",
    "images": [
      "/images/instagram/media_1792779839327_e7664550.jpg",
      "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 30,
    "rating": 5,
    "reviewsCount": 64,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 45 cm, Width: 32 cm",
    "careTips": "Store in cool ambient conditions below 22°C. Beautiful reusable crochet lily.",
    "includedItems": [
      "6 Cadbury Dairy Milk Silk Bars",
      "1 Handcrafted Crochet Purple Lily",
      "Royal Purple Pleated Paper Wrap",
      "Silk Ribbon"
    ]
  },
  {
    "name": "Golden Princess Crown Tiara Chocolate Bouquet",
    "description": "Feel like royalty! An opulent chocolate and floral bouquet featuring deep purple lilies, radiant sunflower blooms, Ferrero Rocher & KitKat chocolates, crowned with a sparkling golden crystal princess tiara.",
    "price": 1099,
    "category": "Chocolate Bouquets",
    "occasion": "Birthday",
    "images": [
      "/images/instagram/media_1792779839322_ec36f7ef.jpg",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 16,
    "rating": 5,
    "reviewsCount": 41,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 46 cm, Width: 30 cm",
    "careTips": "Tiara is detachable and wearable for birthday photos!",
    "includedItems": [
      "Golden Crystal Tiara Crown",
      "Purple Lilies & Sunflowers",
      "Ferrero Rocher & KitKats",
      "Korean Frosted Wrap",
      "LED Fairy Light"
    ]
  },
  {
    "name": "Luxury KitKat & Red Rose Golden Butterfly Bouquet",
    "description": "Crisp KitKat chocolate bars paired with lush fresh red roses, nestled in matte black origami pleated wrap and accented with fluttering 3D golden butterflies.",
    "price": 799,
    "category": "Chocolate Bouquets",
    "occasion": "Anniversary",
    "images": [
      "/images/instagram/media_1792779839322_ec36f7ef.jpg",
      "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 25,
    "rating": 4.9,
    "reviewsCount": 47,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 42 cm, Width: 28 cm",
    "careTips": "Chocolates mounted securely on floral stems. Store away from heat.",
    "includedItems": [
      "6 Nestle KitKat 4-Finger Bars",
      "6 Fresh Dutch Red Roses",
      "3D Golden Butterflies",
      "Matte Black Wrap"
    ]
  },
  {
    "name": "Red Rose & Ferrero Rocher Golden Bouquet",
    "description": "The ultimate blend of romance and sweetness featuring deep velvety red roses nestled alongside premium Ferrero Rocher golden truffles in matte black and gold foil wrap.",
    "price": 899,
    "category": "Chocolate Bouquets",
    "occasion": "Anniversary",
    "images": [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 24,
    "rating": 5,
    "reviewsCount": 65,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 45 cm, Width: 30 cm",
    "careTips": "Fresh roses should be sprayed lightly with water. Chocolates are secured on bamboo floral picks.",
    "includedItems": [
      "8 Fresh Red Roses",
      "8 Ferrero Rocher Chocolates",
      "Matte Black & Gold Wrapping",
      "LED Warm Fairy String"
    ]
  },
  {
    "name": "KitKat Chocolate Origami Bouquet in Black & Red",
    "description": "Crisp KitKat 4-finger bars styled into a geometric fan bouquet wrapped in black origami paper with vibrant red lining and a rich crimson satin bow.",
    "price": 599,
    "category": "Chocolate Bouquets",
    "occasion": "Birthday",
    "images": [
      "/images/instagram/media_1792779839325_83d201a7.jpg",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 28,
    "rating": 4.8,
    "reviewsCount": 38,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 38 cm, Width: 26 cm",
    "careTips": "Store in a cool place below 22°C.",
    "includedItems": [
      "8 Nestle KitKat Bars",
      "Black & Red Origami Pleated Wrap",
      "Satin Bow",
      "Gift Card"
    ]
  },
  {
    "name": "Mini KitKat Red Paper Wrap Bouquet",
    "description": "A pocket-friendly sweet gesture! 4 crisp KitKat bars arranged in a conical red paper wrap with baby’s breath sprigs and a petite ribbon.",
    "price": 399,
    "category": "Chocolate Bouquets",
    "occasion": "Birthday",
    "images": [
      "/images/instagram/media_1792779839320_a25e7295.jpg",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 35,
    "rating": 4.7,
    "reviewsCount": 29,
    "isFeatured": false,
    "isBestSeller": false,
    "customizable": true,
    "dimensions": "Height: 30 cm, Width: 18 cm",
    "careTips": "Keep cool.",
    "includedItems": [
      "4 KitKat Bars",
      "Red Craft Paper Cone",
      "Baby’s Breath Sprig",
      "Tag"
    ]
  },
  {
    "name": "Custom Bestie Photo Box Hamper with Polaroid Prints",
    "description": "As featured on @_thehampertells_! A crystal-clear acrylic keepsake box featuring custom polaroid photos, chocolate bars, fairy lights, personalized birthday note, and satin ribbon packaging. The ultimate friendship tribute!",
    "price": 1199,
    "category": "Hampers",
    "occasion": "Birthday",
    "images": [
      "/images/instagram/media_1792779839320_a25e7295.jpg",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 22,
    "rating": 5,
    "reviewsCount": 57,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Box: 24 x 20 x 10 cm",
    "careTips": "Acrylic box is reusable for photos, jewellery or keepsakes.",
    "includedItems": [
      "Crystal Clear Acrylic Box",
      "6 Custom Polaroid Photo Prints",
      "Assorted Chocolates & Cookies",
      "Warm LED Fairy String",
      "Handwritten Bestie Note"
    ]
  },
  {
    "name": "Pink Satin Bow Luxury Wooden Hamper",
    "description": "Handcrafted natural pinewood hamper tray adorned with a voluminous blush pink satin bow, filled with gourmet sweets, scented candles, mini plush, and dried floral accents.",
    "price": 1499,
    "category": "Hampers",
    "occasion": "For Her",
    "images": [
      "/images/instagram/media_1792779839320_a25e7295.jpg",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 16,
    "rating": 4.9,
    "reviewsCount": 34,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Tray: 30 x 24 x 12 cm",
    "careTips": "Natural wooden crate is durable and reusable for home vanity.",
    "includedItems": [
      "Solid Pinewood Hamper Tray",
      "Giant Blush Pink Satin Bow",
      "Aromatherapy Candle",
      "Gourmet Treats",
      "Floral Accents"
    ]
  },
  {
    "name": "Luxury Purple Tulle Net Celebration Gift Basket",
    "description": "A dreamy woven basket elegantly enrobed in cascading sheer purple tulle netting, filled with artisan chocolates, floral posy, and celebration keepsakes.",
    "price": 1349,
    "category": "Hampers",
    "occasion": "Celebration",
    "images": [
      "/images/instagram/media_1792779839321_f3356cad.jpg",
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 18,
    "rating": 4.9,
    "reviewsCount": 28,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Basket: 26 x 22 x 15 cm",
    "careTips": "Store in dry surroundings.",
    "includedItems": [
      "Woven Cane Basket",
      "Sheer Purple Tulle Netting",
      "Assorted Chocolates",
      "Mini Rose Posy",
      "Satin Bow"
    ]
  },
  {
    "name": "Pink Net Wooden Hamper with Cuddly Teddy",
    "description": "Charming wooden crate hamper draped in delicate pink net, featuring an adorable plush mini teddy bear, assorted Cadbury chocolates, fairy lights, and personalized wishes.",
    "price": 1099,
    "category": "Hampers",
    "occasion": "For Her",
    "images": [
      "/images/instagram/media_1792779839321_f3356cad.jpg",
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 20,
    "rating": 4.8,
    "reviewsCount": 33,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Crate: 25 x 20 x 10 cm",
    "careTips": "Teddy bear is hypoallergenic and super soft.",
    "includedItems": [
      "Pinewood Crate",
      "Plush Pink Ribbon Teddy (18cm)",
      "Cadbury Dairy Milk Bars",
      "Pink Netting & Fairy Lights"
    ]
  },
  {
    "name": "Pink Baby Teddy & Pastel Scrunchie Gift Hamper",
    "description": "An adorable self-care and cuteness gift set featuring an ultra-soft mini teddy, set of 3 silk satin scrunchies, Ferrero Rocher chocolates, and customized note.",
    "price": 749,
    "category": "Hampers",
    "occasion": "For Her",
    "images": [
      "/images/instagram/media_1792779839322_ec36f7ef.jpg",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 25,
    "rating": 4.8,
    "reviewsCount": 36,
    "isFeatured": false,
    "isBestSeller": false,
    "customizable": true,
    "dimensions": "Box: 20 x 16 x 8 cm",
    "careTips": "Scrunchies are 100% gentle mulberry silk satin.",
    "includedItems": [
      "Mini Plush Teddy",
      "3 Silk Satin Scrunchies",
      "4 Ferrero Chocolates",
      "Pastel Pink Box"
    ]
  },
  {
    "name": "Luxury Royal Celebration Hamper",
    "description": "The pinnacle of luxury gifting. A grand presentation box containing a porcelain keepsake mug, handcrafted scented soy candle, artisan Belgian truffles, lavender bath soak, and fairytale LED lights.",
    "price": 2199,
    "category": "Hampers",
    "occasion": "Celebration",
    "images": [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 14,
    "rating": 5,
    "reviewsCount": 48,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Box: 32 x 26 x 14 cm",
    "careTips": "Candles should be trimmed to 1/4 inch wick before lighting. Store truffles below 20°C.",
    "includedItems": [
      "Embossed Ceramic Mug",
      "Rose & Vanilla Soy Candle",
      "Box of 12 Belgian Truffles",
      "Handmade Lavender Bath Salts",
      "LED Fairy String",
      "Luxury Rigid Trunk"
    ]
  },
  {
    "name": "Lavender Spa & Self-Care Pamper Hamper",
    "description": "A calming aromatic relaxation gift set designed to pamper her senses with handmade organic lavender soap, whipped shea body butter, satin sleep mask, and aromatic bath bombs.",
    "price": 1299,
    "category": "Hampers",
    "occasion": "For Her",
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 22,
    "rating": 4.9,
    "reviewsCount": 36,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Box: 28 x 22 x 10 cm",
    "careTips": "100% Organic cosmetics. Keep soap bar in dry dish after usage.",
    "includedItems": [
      "Cold-Pressed Lavender Soap Bar",
      "Whipped Shea Body Butter (100g)",
      "Silk Sleep Eye Mask",
      "2 Scented Fizzy Bath Bombs",
      "Pastel Pink Keepsake Box"
    ]
  },
  {
    "name": "Mini Artisanal Gift Basket",
    "description": "Charming mini woven cane gift basket filled with artisan natural soap, mini votive soy candle, honey jar with wooden dipper, and dried floral sprigs.",
    "price": 699,
    "category": "Hampers",
    "occasion": "For Her",
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 30,
    "rating": 4.7,
    "reviewsCount": 35,
    "isFeatured": false,
    "isBestSeller": false,
    "customizable": true,
    "dimensions": "Basket: 20 x 18 x 10 cm",
    "careTips": "Store in dry surroundings. Beautiful keepsake woven basket reusable for vanity.",
    "includedItems": [
      "Artisan Honey Oat Soap",
      "Mini Soy Candle",
      "Pure Raw Honey (50g)",
      "Wooden Honey Wand",
      "Woven Cane Basket"
    ]
  },
  {
    "name": "Handmade Purple Crochet Lavender & Lily Bouquet",
    "description": "An exquisite eternal bouquet meticulously hand-knitted with organic cotton yarn: Features delicate purple lavender spikes, elegant purple lily, and green leaves wrapped in frosted transparent Korean paper with satin bow.",
    "price": 899,
    "category": "Personalized Gifts",
    "occasion": "For Her",
    "images": [
      "/images/instagram/media_1792779839322_ec36f7ef.jpg",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 15,
    "rating": 5,
    "reviewsCount": 37,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 40 cm, Width: 26 cm",
    "careTips": "100% Hand-knitted crochet. Never wilts, completely washable in cold water.",
    "includedItems": [
      "3 Hand-Knitted Lavender Stems",
      "1 Handcrafted Crochet Lily",
      "Crochet Foliage",
      "Frosted Waterproof Wrap",
      "Ribbon Bow"
    ]
  },
  {
    "name": "Velvet Crimson Tulip Crochet Eternal Bouquet",
    "description": "Chic and minimalist! Hand-crocheted velvet red tulip stems nestled in deep black origami wrap, tied with a scarlet ribbon. A modern symbol of pure, everlasting romance.",
    "price": 949,
    "category": "Personalized Gifts",
    "occasion": "Anniversary",
    "images": [
      "/images/instagram/media_1792779839322_ec36f7ef.jpg",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 14,
    "rating": 4.9,
    "reviewsCount": 29,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 42 cm, Width: 24 cm",
    "careTips": "Dust gently. Retains rich crimson color forever.",
    "includedItems": [
      "5 Crochet Red Tulips",
      "Deep Black Origami Wrap",
      "Scarlet Satin Ribbon",
      "Custom Note"
    ]
  },
  {
    "name": "Crochet Sunflower Everlasting Bouquet",
    "description": "Meticulously hand-knitted crochet sunflowers and daisies crafted from organic cotton yarn. A forever flower bouquet that never wilts or fades.",
    "price": 1099,
    "category": "Personalized Gifts",
    "occasion": "For Her",
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 15,
    "rating": 5,
    "reviewsCount": 33,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 40 cm, Width: 25 cm",
    "careTips": "100% Handmade crochet. Dust gently with dry cloth. Washable in cold water if needed.",
    "includedItems": [
      "3 Hand-Knitted Sunflowers",
      "2 Crochet White Daisies",
      "Eucalyptus Sprigs",
      "Korean Style Waterproof Wrap"
    ]
  },
  {
    "name": "Custom Bestie Polaroid Memory Book & Photo Hamper",
    "description": "A handcrafted scrapbook memory album containing 12 of your customized polaroid pictures with personal captions, accompanied by luxury chocolates in a ribboned gift box.",
    "price": 1249,
    "category": "Personalized Gifts",
    "occasion": "Birthday",
    "images": [
      "/images/instagram/media_1792779839322_ec36f7ef.jpg",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 18,
    "rating": 4.9,
    "reviewsCount": 42,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Book: 20 x 15 cm, Box: 25 x 20 cm",
    "careTips": "Archival quality photo prints.",
    "includedItems": [
      "Handbound Scrapbook Memory Album",
      "12 Polaroid Custom Prints",
      "Box of Chocolates",
      "Presentation Box"
    ]
  },
  {
    "name": "Personalized Name LED Acrylic Night Lamp",
    "description": "Warm glowing personalized bedside night lamp with custom engraved couple/recipient name and romantic floral illustration mounted on a solid beechwood base.",
    "price": 749,
    "category": "Personalized Gifts",
    "occasion": "Birthday",
    "images": [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 20,
    "rating": 4.8,
    "reviewsCount": 26,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 18 cm, Base: 14 x 4 cm",
    "careTips": "Clean acrylic plate with soft microfiber cloth. Powered by standard USB cable.",
    "includedItems": [
      "Laser Engraved Optical Acrylic Plate",
      "Solid Wood Warm LED Base",
      "USB Power Cable with Switch"
    ]
  },
  {
    "name": "Personalized Birthday Box For Him",
    "description": "Sleek luxury black matte box customized with recipient’s gold foil name. Contains genuine leather engraved keychain, custom chocolate wrapper, and handwritten birthday card.",
    "price": 849,
    "category": "Personalized Gifts",
    "occasion": "For Him",
    "images": [
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 25,
    "rating": 4.8,
    "reviewsCount": 30,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Box: 22 x 18 x 7 cm",
    "careTips": "Condition leather keychain with light wax.",
    "includedItems": [
      "Custom Engraved Tan Leather Keychain",
      "Personalized Gold Foil Name Chocolate Bar",
      "Sleek Black Keepsake Box"
    ]
  },
  {
    "name": "Hello Kitty Plush & Pink Lily Bouquet",
    "description": "The cutest surprise for sanrio lovers! An authentic Hello Kitty plush sitting amidst hand-shaped pink lilies, gypsophila, and pastel pink pleated wrap.",
    "price": 1049,
    "category": "Birthday Gifts",
    "occasion": "Birthday",
    "images": [
      "/images/instagram/media_1792779839327_e7664550.jpg",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 14,
    "rating": 5,
    "reviewsCount": 46,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 44 cm, Width: 28 cm",
    "careTips": "Plush toy is detachable for bedroom decor.",
    "includedItems": [
      "Hello Kitty Soft Plush (16cm)",
      "Handcrafted Pink Lilies",
      "Baby’s Breath Stems",
      "Blush Wrap with Bow"
    ]
  },
  {
    "name": "National Girlfriends Day Pink Eternal Hamper & Bento Cake",
    "description": "As seen on @_thehampertells_! Dedicated Girlfriend celebration package: 400g vanilla Bento cake, pink eternal handcrafted bouquet, teddy bear, and customized love card in a presentation basket.",
    "price": 1599,
    "category": "Birthday Gifts",
    "occasion": "For Her",
    "images": [
      "/images/instagram/media_1792779839321_f3356cad.jpg",
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 12,
    "rating": 5,
    "reviewsCount": 38,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Tray: 30 x 25 cm, Cake: 15 cm",
    "careTips": "Refrigerate cake until serving.",
    "includedItems": [
      "400g Fresh Vanilla Bento Cake",
      "Pink Eternal Lily Bouquet",
      "Cute Mini Plush Teddy",
      "Wicker Tray & Ribbon"
    ]
  },
  {
    "name": "Ultimate Birthday Surprise Confetti Hamper",
    "description": "The complete birthday celebration in a box: Personalized birthday ceramic mug, plush mini teddy bear, scented soy candle, confetti popper, assorted chocolates, and custom keepsake card.",
    "price": 1249,
    "category": "Birthday Gifts",
    "occasion": "Birthday",
    "images": [
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 25,
    "rating": 4.9,
    "reviewsCount": 74,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Box: 30 x 24 x 12 cm",
    "careTips": "Ceramic mug is microwave and dishwasher safe.",
    "includedItems": [
      "Custom Birthday Name Mug",
      "Fluffy Plush Teddy Bear (15cm)",
      "Lavender Soy Scented Candle",
      "Party Confetti Popper",
      "Assorted Dairy Chocolates",
      "Rigid Pastel Box"
    ]
  },
  {
    "name": "Midnight Birthday Confetti Balloon Box",
    "description": "An interactive pop-up surprise box with a mini personalized helium balloon floating out upon opening, surrounded by luxury Ferrero truffles and fairy lights.",
    "price": 799,
    "category": "Birthday Gifts",
    "occasion": "Birthday",
    "images": [
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 20,
    "rating": 4.8,
    "reviewsCount": 29,
    "isFeatured": false,
    "isBestSeller": false,
    "customizable": true,
    "dimensions": "Box: 25 x 25 x 25 cm",
    "careTips": "Open carefully indoors so the tethered helium balloon floats up to 40 cm.",
    "includedItems": [
      "Floating Foil Birthday Balloon",
      "6 Ferrero Rocher Truffles",
      "Warm String Lights",
      "Confetti Base Fillers"
    ]
  },
  {
    "name": "Happy Anniversary Photo Floral Bouquet",
    "description": "A deeply emotional floral arrangement: Delicate pink roses paired with wooden mini clothespins holding your favourite couple polaroid photos, wrapped in craft paper with a Happy Anniversary banner.",
    "price": 899,
    "category": "Anniversary Gifts",
    "occasion": "Anniversary",
    "images": [
      "/images/instagram/media_1792779839320_a25e7295.jpg",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 20,
    "rating": 5,
    "reviewsCount": 44,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Height: 45 cm, Width: 30 cm",
    "careTips": "Clip in your own high-gloss polaroid prints (or send photos for us to print).",
    "includedItems": [
      "8 Fresh Pink Dutch Roses",
      "4 Custom Polaroid Prints with Clips",
      "Anniversary Banner",
      "Craft Florist Wrap"
    ]
  },
  {
    "name": "Eternal Romance Velvet Red Box",
    "description": "A deeply romantic anniversary box lined with velvet and containing 16 deep crimson preserved eternal roses, a silver heart pendant, and personalized wax-sealed love letter.",
    "price": 1599,
    "category": "Anniversary Gifts",
    "occasion": "Anniversary",
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 14,
    "rating": 5,
    "reviewsCount": 39,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Box: 22 x 22 x 12 cm",
    "careTips": "Preserved eternal roses do not require water. They maintain beauty for over 2 years.",
    "includedItems": [
      "16 Long-Lasting Preserved Roses",
      "Heart Crystal Pendant",
      "Wax-Sealed Love Parchment",
      "Burgundy Velvet Casket"
    ]
  },
  {
    "name": "Forever Roses & Scented Candle Duo",
    "description": "An elegant glass cloche featuring a preserved red rose surrounded by fallen petals and warm fairy lights, paired with a hand-poured French vanilla scented candle.",
    "price": 999,
    "category": "Anniversary Gifts",
    "occasion": "Anniversary",
    "images": [
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 18,
    "rating": 4.8,
    "reviewsCount": 25,
    "isFeatured": false,
    "isBestSeller": false,
    "customizable": true,
    "dimensions": "Dome: Height 22 cm, Diameter 12 cm",
    "careTips": "Powered by 3 AAA batteries included.",
    "includedItems": [
      "Enchanted Glass Rose Cloche with LEDs",
      "Vanilla Scented Soy Candle",
      "Luxury Ribbon Packaging"
    ]
  },
  {
    "name": "Single Velvet Red Rose in Black Luxury Sleeve",
    "description": "An iconic minimalist statement! A single long-stem premium velvety red rose with baby’s breath and deep purple ribbon in a sleek black florist sleeve.",
    "price": 249,
    "category": "Flowers",
    "occasion": "For Her",
    "images": [
      "/images/instagram/media_1792779839320_a25e7295.jpg",
      "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 40,
    "rating": 4.8,
    "reviewsCount": 55,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Stem: 45 cm",
    "careTips": "Keep stem in fresh water.",
    "includedItems": [
      "1 Long-stem Dutch Red Rose",
      "Gypsophila Stems",
      "Black Florist Sleeve",
      "Purple Ribbon"
    ]
  },
  {
    "name": "Single Sunflower & Baby’s Breath Kraft Cone",
    "description": "A burst of warm sunshine! Single freshly harvested large golden sunflower with gypsophila foliage in a minimalist kraft cone wrap.",
    "price": 299,
    "category": "Flowers",
    "occasion": "Birthday",
    "images": [
      "/images/instagram/media_1792779839325_83d201a7.jpg",
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 35,
    "rating": 4.8,
    "reviewsCount": 43,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Stem: 45 cm",
    "careTips": "Place in water upon receipt.",
    "includedItems": [
      "1 Fresh Sunflower",
      "Baby’s Breath Stems",
      "Brown Kraft Cone",
      "Jute Ribbon"
    ]
  },
  {
    "name": "Fresh Pink & White Rose Posy Bunch",
    "description": "Dual-tone fresh garden roses (blush pink and snowy white) gracefully arranged in eco kraft paper with twine bow.",
    "price": 649,
    "category": "Flowers",
    "occasion": "For Her",
    "images": [
      "/images/instagram/media_1792779839321_f3356cad.jpg",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 25,
    "rating": 4.7,
    "reviewsCount": 31,
    "isFeatured": false,
    "isBestSeller": false,
    "customizable": true,
    "dimensions": "Height: 40 cm, Diameter: 25 cm",
    "careTips": "Trim stems 1 cm daily.",
    "includedItems": [
      "10 Dual-Tone Pink & White Roses",
      "Florist Nutritive Packet",
      "Eco Kraft Paper"
    ]
  },
  {
    "name": "Fresh Dutch Red Roses Bunch (Pack of 20)",
    "description": "20 fresh, long-stemmed premium Dutch red roses delivered in florist craft wrap with flower food preservative to maximize vase bloom life.",
    "price": 899,
    "category": "Flowers",
    "occasion": "For Her",
    "images": [
      "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 30,
    "rating": 4.8,
    "reviewsCount": 44,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Stem Length: 50 cm",
    "careTips": "Add provided flower food packet to 1 liter of fresh water in clean vase.",
    "includedItems": [
      "20 Long-stemmed Dutch Red Roses",
      "Florist Nutritive Powder",
      "Eco Kraft Paper",
      "Gift Card"
    ]
  },
  {
    "name": "Single Preserved Eternal Pink Rose Gift Box",
    "description": "A genuine preserved pink rose that stays fresh and fragrant for up to 3 years without water, presented in an elegant acrylic-view drawer box.",
    "price": 449,
    "category": "Flowers",
    "occasion": "Anniversary",
    "images": [
      "/images/instagram/media_1792779839321_f3356cad.jpg",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 30,
    "rating": 4.9,
    "reviewsCount": 27,
    "isFeatured": false,
    "isBestSeller": false,
    "customizable": true,
    "dimensions": "Box: 10 x 10 x 10 cm",
    "careTips": "Do not water. Keep in dry ambient room.",
    "includedItems": [
      "1 Preserved Pink Rose",
      "Acrylic Display Box",
      "Gift Bag"
    ]
  },
  {
    "name": "Hamper + Fresh Bouquet + Bento Cake Trio Celebration",
    "description": "The viral @_thehampertells_ signature combo! Three-in-one surprise: 1) Handcrafted gift hamper basket, 2) Fresh rose floral bouquet, and 3) Custom 400g Bento birthday cake with greeting tag.",
    "price": 1899,
    "category": "Gift Combos",
    "occasion": "Birthday",
    "images": [
      "/images/instagram/media_1792779839321_f3356cad.jpg",
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 10,
    "rating": 5,
    "reviewsCount": 62,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Hamper: 26cm, Bouquet: 40cm, Bento Cake: 15cm",
    "careTips": "Refrigerate cake until cutting. Staggered doorstep hand-delivery available.",
    "includedItems": [
      "400g Vanilla Bento Cake",
      "Fresh 8-Rose Floral Bouquet",
      "Curated Gift Basket with Chocolates",
      "Sparkler Candle & Cards"
    ]
  },
  {
    "name": "Bento Birthday Cake & Red Rose Combo",
    "description": "A delightful celebratory pairing: 400g vanilla buttercream Bento birthday cake with customizable name piping, paired with a matching fresh pink or red rose posy.",
    "price": 1399,
    "category": "Gift Combos",
    "occasion": "Birthday",
    "images": [
      "/images/instagram/media_1792779839320_a25e7295.jpg",
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 15,
    "rating": 4.9,
    "reviewsCount": 38,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Cake Box: 15 x 15 cm, Bouquet: 35 cm",
    "careTips": "Store cake in refrigerator until 20 minutes before serving. Includes wooden fork and candle.",
    "includedItems": [
      "400g Eggless Vanilla Bento Cake",
      "6 Fresh Red Roses Posy",
      "Sparkler Candle",
      "Personalized Birthday Card"
    ]
  },
  {
    "name": "Helium Heart Foil Balloon & Wooden Hamper Combo",
    "description": "An eye-catching romantic setup! A large red heart helium foil balloon floating above a solid pinewood hamper tray with sunflower bouquet, chocolates, and fairy lights.",
    "price": 1699,
    "category": "Gift Combos",
    "occasion": "Anniversary",
    "images": [
      "/images/instagram/media_1792779839322_ec36f7ef.jpg",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 12,
    "rating": 5,
    "reviewsCount": 35,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Balloon: 18 inch, Wooden Tray: 28 x 20 cm",
    "careTips": "Helium balloon stays floating for 3-5 days indoors.",
    "includedItems": [
      "18-inch Red Foil Heart Helium Balloon",
      "Pinewood Hamper Tray",
      "Sunflower Bunch",
      "Chocolates & Fairy String"
    ]
  },
  {
    "name": "Chocolates, Ceramic Mug & Mini Teddy Combo",
    "description": "An adorable and affordable gift combo comprising a plush cuddly teddy bear, pastel ceramic coffee mug, and a box of 4 Dairy Milk chocolate bars.",
    "price": 799,
    "category": "Gift Combos",
    "occasion": "For Her",
    "images": [
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 28,
    "rating": 4.7,
    "reviewsCount": 31,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Combo Hamper Tray: 24 x 20 cm",
    "careTips": "Teddy bear is hypoallergenic and machine washable.",
    "includedItems": [
      "Plush Cream Teddy Bear (20 cm)",
      "Pastel Ceramic Coffee Mug",
      "4 Cadbury Chocolate Bars",
      "Gift Tray Wrap"
    ]
  },
  {
    "name": "Cadbury Celebrations Gold Net Gift Tray",
    "description": "Festive classic elevated! Large Cadbury Celebrations gift box enrobed in glistening golden tulle netting, crowned with a large champagne satin bow and festive card.",
    "price": 849,
    "category": "Celebration Gifts",
    "occasion": "Celebration",
    "images": [
      "/images/instagram/media_1792779839327_e7664550.jpg",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 30,
    "rating": 4.8,
    "reviewsCount": 40,
    "isFeatured": false,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Tray: 30 x 22 cm",
    "careTips": "Keep cool.",
    "includedItems": [
      "Cadbury Celebrations Large Assortment",
      "Glistening Gold Net Wrap",
      "Champagne Satin Bow",
      "Greeting Tag"
    ]
  },
  {
    "name": "Birthday Surprise Room Decor & Balloon Setup",
    "description": "Now officially launched: \"Decors by The Hamper Tells\"! Complete doorstep hotel/home room surprise decor: Warm fairy light curtain wall, helium balloon bouquet, customized birthday banner, flower petals, and bento cake table setup.",
    "price": 2999,
    "category": "Celebration Gifts",
    "occasion": "Birthday",
    "images": [
      "/images/instagram/media_1792779839325_83d201a7.jpg",
      "/images/instagram/media_1792779839327_e7664550.jpg"
    ],
    "stock": 6,
    "rating": 5,
    "reviewsCount": 22,
    "isFeatured": true,
    "isBestSeller": true,
    "customizable": true,
    "dimensions": "Full Room Setup (2-hour setup by our styling team)",
    "careTips": "Styling team coordinates 3 hours before surprise time.",
    "includedItems": [
      "Fairy Light Backdrop Wall (10x10 ft)",
      "30 Metallic Helium & Pastel Balloons",
      "Happy Birthday Foil Banner",
      "Rose Petal Bed Arrangement",
      "Candle Light Pathway"
    ]
  },
  {
    "name": "Neon Sign & Balloon Birthday Room Decor Combo",
    "description": "The ultimate VIP celebration experience: Custom glowing LED Neon sign (\"Happy Birthday\" / Recipient Name), grand organic balloon arch, rose pathway, and luxury hamper table styling.",
    "price": 3499,
    "category": "Celebration Gifts",
    "occasion": "Celebration",
    "images": [
      "/images/instagram/media_1792779839327_e7664550.jpg",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 5,
    "rating": 5,
    "reviewsCount": 19,
    "isFeatured": true,
    "isBestSeller": false,
    "customizable": true,
    "dimensions": "Complete VIP Room Decor Service",
    "careTips": "Professional styling artist provided on location.",
    "includedItems": [
      "Warm Glowing LED Neon Sign",
      "Pastel Chrome Balloon Garland",
      "Rose Petal Heart Pathway",
      "Surprise Gift Table Styling"
    ]
  },
  {
    "name": "Grand Festive Golden Celebration Box",
    "description": "A majestic golden celebration trunk for festive gatherings and grand celebrations: Premium roasted nuts (cashews, almonds, pistachios), artisanal dark chocolate bark, brass diya, and luxury sweets.",
    "price": 1799,
    "category": "Celebration Gifts",
    "occasion": "Celebration",
    "images": [
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop&q=80"
    ],
    "stock": 15,
    "rating": 4.9,
    "reviewsCount": 41,
    "isFeatured": false,
    "isBestSeller": false,
    "customizable": true,
    "dimensions": "Trunk: 32 x 22 x 12 cm",
    "careTips": "Dry fruits sealed in vacuum glass jars for guaranteed crisp freshness.",
    "includedItems": [
      "California Almonds (100g)",
      "Roasted Salted Cashews (100g)",
      "Turkish Pistachios (100g)",
      "Artisan Dark Chocolate Fruit Bark",
      "Carved Brass Keepsake Diya",
      "Gold Foil Trunk"
    ]
  }
];
const createdProducts = await Product.insertMany(products);

    // 3. Seed Workshops
    const workshops = [
      {
        title: 'Pipe Cleaner Flower Making Masterclass',
        description: 'Learn how to sculpt realistic, colorful flowers using soft chenille pipe cleaners! All materials provided. Take home your own bouquet.',
        price: 799,
        date: 'Sunday, October 25, 2026',
        time: '3:00 PM – 5:30 PM',
        location: 'The Hamper Tells Studio & Creative Space',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
        includes: ['All Craft Materials Provided', 'Guided Step-by-Step Instruction', 'Refreshments & Iced Tea', 'Your Custom Flower Bouquet to Take Home'],
        seatsLeft: 12
      },
      {
        title: 'Tote Bag Painting & Floral Customization',
        description: 'Design and paint your own aesthetic canvas tote bag using fabric paints and floral stencils. Perfect weekend creative activity.',
        price: 549,
        date: 'Saturday, November 7, 2026',
        time: '4:00 PM – 6:00 PM',
        location: 'The Hamper Tells Studio & Creative Space',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
        includes: ['100% Organic Canvas Tote Bag', 'Acrylic Fabric Paints & Brushes', 'Complimentary Coffee & Cookies', 'Take Home Your Painted Tote'],
        seatsLeft: 8
      }
    ];
    await Workshop.insertMany(workshops);

    // 4. Seed ONE PERSON ADMIN LOGIN + CUSTOMER ACCOUNTS
    console.log('[AutoSeed] Seeding One Person Admin Login & Customer Logins...');

    // Single designated Admin Account ("one person login")
    await User.create({
      name: 'The Hamper Tells Owner',
      email: 'admin@hampertells.com',
      phone: '9876543210',
      passwordHash: 'admin123',
      role: 'admin',
      addresses: [{
        houseNo: 'Studio 101, Creative Arcade',
        street: 'FC Road',
        city: 'Pune',
        state: 'Maharashtra',
        pinCode: '411004',
        isDefault: true
      }]
    });

    // Customer accounts ("all the login for the customers too")
    const customer1 = await User.create({
      name: 'Demo Student',
      email: 'demo@hampertells.com',
      phone: '9876543210',
      passwordHash: 'password123',
      role: 'customer',
      addresses: [{
        houseNo: 'Flat 402, Rosewood Heights',
        street: 'College Road, Shivaji Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        pinCode: '411005',
        isDefault: true
      }]
    });

    const customer2 = await User.create({
      name: 'Ananya Sharma',
      email: 'ananya@gmail.com',
      phone: '9822012345',
      passwordHash: 'password123',
      role: 'customer',
      addresses: [{
        houseNo: 'Villa 12, Blossom Park',
        street: 'Kalyani Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        pinCode: '411006',
        isDefault: true
      }]
    });

    const customer3 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@gmail.com',
      phone: '9765432109',
      passwordHash: 'password123',
      role: 'customer',
      addresses: [{
        houseNo: 'B-204, Green Acres',
        street: 'Baner Road',
        city: 'Pune',
        state: 'Maharashtra',
        pinCode: '411045',
        isDefault: true
      }]
    });

    const customer4 = await User.create({
      name: 'Priya Kulkarni',
      email: 'priya@gmail.com',
      phone: '9890123456',
      passwordHash: 'password123',
      role: 'customer',
      addresses: [{
        houseNo: '7, Swapnashilp Society',
        street: 'Kothrud',
        city: 'Pune',
        state: 'Maharashtra',
        pinCode: '411038',
        isDefault: true
      }]
    });

    // 5. Seed Historical Orders across May, June, July, August, September, October 2026
    console.log('[AutoSeed] Seeding Monthly Orders & Sales records...');

    const sampleOrders = [
      // May 2026
      {
        orderId: 'HT-20260514-1011',
        userId: customer2._id,
        customerName: customer2.name,
        customerEmail: customer2.email,
        customerPhone: customer2.phone,
        items: [{
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          quantity: 2,
          giftMessage: 'Happy Mother Day Mom!'
        }],
        address: customer2.addresses[0],
        deliveryDate: '2026-05-15',
        subtotal: 1398,
        discount: 0,
        deliveryCharge: 99,
        totalAmount: 1497,
        paymentMethod: 'UPI_QR',
        paymentStatus: 'PAID',
        orderStatus: 'Delivered',
        createdAt: new Date('2026-05-14T11:20:00Z')
      },
      {
        orderId: 'HT-20260528-1022',
        userId: customer3._id,
        customerName: customer3.name,
        customerEmail: customer3.email,
        customerPhone: customer3.phone,
        customHamper: {
          baseBox: { name: 'Medium Box', price: 299 },
          items: [{ name: 'Artisan Chocolates', price: 150 }, { name: 'Teddy Bear', price: 199 }],
          packagingTheme: { name: 'Blush Pink Theme', price: 99 },
          greetingCard: { name: 'Birthday Card', price: 49 },
          personalMessage: 'Best wishes!',
          totalPrice: 796
        },
        address: customer3.addresses[0],
        deliveryDate: '2026-05-30',
        subtotal: 796,
        discount: 0,
        deliveryCharge: 99,
        totalAmount: 895,
        paymentMethod: 'COD',
        paymentStatus: 'PAID',
        orderStatus: 'Delivered',
        createdAt: new Date('2026-05-28T14:10:00Z')
      },

      // June 2026
      {
        orderId: 'HT-20260610-2033',
        userId: customer1._id,
        customerName: customer1.name,
        customerEmail: customer1.email,
        customerPhone: customer1.phone,
        items: [{
          product: createdProducts[4]._id,
          name: createdProducts[4].name,
          image: createdProducts[4].images[0],
          price: createdProducts[4].price,
          quantity: 1
        }],
        address: customer1.addresses[0],
        deliveryDate: '2026-06-12',
        subtotal: 1299,
        discount: 0,
        deliveryCharge: 99,
        totalAmount: 1398,
        paymentMethod: 'UPI_QR',
        paymentStatus: 'PAID',
        orderStatus: 'Delivered',
        createdAt: new Date('2026-06-10T10:00:00Z')
      },
      {
        orderId: 'HT-20260622-2044',
        userId: customer4._id,
        customerName: customer4.name,
        customerEmail: customer4.email,
        customerPhone: customer4.phone,
        items: [{
          product: createdProducts[6]._id,
          name: createdProducts[6].name,
          image: createdProducts[6].images[0],
          price: createdProducts[6].price,
          quantity: 1
        }],
        address: customer4.addresses[0],
        deliveryDate: '2026-06-24',
        subtotal: 1199,
        discount: 0,
        deliveryCharge: 99,
        totalAmount: 1298,
        paymentMethod: 'UPI_QR',
        paymentStatus: 'PAID',
        orderStatus: 'Delivered',
        createdAt: new Date('2026-06-22T16:30:00Z')
      },

      // July 2026
      {
        orderId: 'HT-20260705-3055',
        userId: customer2._id,
        customerName: customer2.name,
        customerEmail: customer2.email,
        customerPhone: customer2.phone,
        customHamper: {
          baseBox: { name: 'Large Box', price: 399 },
          items: [
            { name: 'Perfume', price: 499 },
            { name: 'Scented Candle', price: 149 },
            { name: 'Chocolates', price: 150 }
          ],
          packagingTheme: { name: 'Lavish Purple Theme', price: 99 },
          greetingCard: { name: 'Love Card', price: 49 },
          personalMessage: 'Forever and always yours.',
          totalPrice: 1345
        },
        address: customer2.addresses[0],
        deliveryDate: '2026-07-08',
        subtotal: 1345,
        discount: 0,
        deliveryCharge: 99,
        totalAmount: 1444,
        paymentMethod: 'UPI_QR',
        paymentStatus: 'PAID',
        orderStatus: 'Delivered',
        createdAt: new Date('2026-07-05T09:15:00Z')
      },
      {
        orderId: 'HT-20260718-3066',
        userId: customer3._id,
        customerName: customer3.name,
        customerEmail: customer3.email,
        customerPhone: customer3.phone,
        items: [{
          product: createdProducts[2]._id,
          name: createdProducts[2].name,
          image: createdProducts[2].images[0],
          price: createdProducts[2].price,
          quantity: 2
        }],
        address: customer3.addresses[0],
        deliveryDate: '2026-07-20',
        subtotal: 1198,
        discount: 0,
        deliveryCharge: 99,
        totalAmount: 1297,
        paymentMethod: 'COD',
        paymentStatus: 'FAILED',
        orderStatus: 'Cancelled',
        createdAt: new Date('2026-07-18T13:40:00Z')
      },

      // August 2026
      {
        orderId: 'HT-20260812-4077',
        userId: customer1._id,
        customerName: customer1.name,
        customerEmail: customer1.email,
        customerPhone: customer1.phone,
        items: [{
          product: createdProducts[7]._id,
          name: createdProducts[7].name,
          image: createdProducts[7].images[0],
          price: createdProducts[7].price,
          quantity: 1
        }],
        address: customer1.addresses[0],
        deliveryDate: '2026-08-14',
        subtotal: 1499,
        discount: 0,
        deliveryCharge: 0,
        totalAmount: 1499,
        paymentMethod: 'UPI_QR',
        paymentStatus: 'PAID',
        orderStatus: 'Delivered',
        createdAt: new Date('2026-08-12T15:00:00Z')
      },
      {
        orderId: 'HT-20260825-4088',
        userId: customer4._id,
        customerName: customer4.name,
        customerEmail: customer4.email,
        customerPhone: customer4.phone,
        items: [{
          product: createdProducts[3]._id,
          name: createdProducts[3].name,
          image: createdProducts[3].images[0],
          price: createdProducts[3].price,
          quantity: 1
        }],
        address: customer4.addresses[0],
        deliveryDate: '2026-08-27',
        subtotal: 899,
        discount: 0,
        deliveryCharge: 99,
        totalAmount: 998,
        paymentMethod: 'UPI_QR',
        paymentStatus: 'PAID',
        orderStatus: 'Delivered',
        createdAt: new Date('2026-08-25T17:45:00Z')
      },

      // September 2026
      {
        orderId: 'HT-20260908-5099',
        userId: customer2._id,
        customerName: customer2.name,
        customerEmail: customer2.email,
        customerPhone: customer2.phone,
        items: [{
          product: createdProducts[5]._id,
          name: createdProducts[5].name,
          image: createdProducts[5].images[0],
          price: createdProducts[5].price,
          quantity: 1
        }],
        address: customer2.addresses[0],
        deliveryDate: '2026-09-10',
        subtotal: 999,
        discount: 0,
        deliveryCharge: 99,
        totalAmount: 1098,
        paymentMethod: 'UPI_QR',
        paymentStatus: 'PAID',
        orderStatus: 'Delivered',
        createdAt: new Date('2026-09-08T12:00:00Z')
      },
      {
        orderId: 'HT-20260924-5100',
        userId: customer3._id,
        customerName: customer3.name,
        customerEmail: customer3.email,
        customerPhone: customer3.phone,
        items: [{
          product: createdProducts[9]._id,
          name: createdProducts[9].name,
          image: createdProducts[9].images[0],
          price: createdProducts[9].price,
          quantity: 1
        }],
        address: customer3.addresses[0],
        deliveryDate: '2026-09-26',
        subtotal: 899,
        discount: 0,
        deliveryCharge: 99,
        totalAmount: 998,
        paymentMethod: 'COD',
        paymentStatus: 'PAID',
        orderStatus: 'Delivered',
        createdAt: new Date('2026-09-24T18:20:00Z')
      },

      // October 2026 (Current Month)
      {
        orderId: 'HT-20261002-6101',
        userId: customer1._id,
        customerName: customer1.name,
        customerEmail: customer1.email,
        customerPhone: customer1.phone,
        customHamper: {
          baseBox: { name: 'Medium Box', price: 299 },
          items: [
            { name: 'Fresh Rose Stem', price: 299 },
            { name: 'Artisan Chocolates', price: 150 },
            { name: 'Plush Teddy Bear', price: 199 }
          ],
          packagingTheme: { name: 'Blush Pink Theme', price: 99 },
          greetingCard: { name: 'Birthday Card', price: 49 },
          personalMessage: 'Wishing you the happiest celebration!',
          totalPrice: 1095
        },
        address: customer1.addresses[0],
        deliveryDate: '2026-10-04',
        subtotal: 1095,
        discount: 0,
        deliveryCharge: 99,
        totalAmount: 1194,
        paymentMethod: 'UPI_QR',
        paymentStatus: 'PAID',
        orderStatus: 'Delivered',
        createdAt: new Date('2026-10-02T10:15:00Z')
      },
      {
        orderId: 'HT-20261009-6102',
        userId: customer4._id,
        customerName: customer4.name,
        customerEmail: customer4.email,
        customerPhone: customer4.phone,
        items: [{
          product: createdProducts[1]._id,
          name: createdProducts[1].name,
          image: createdProducts[1].images[0],
          price: createdProducts[1].price,
          quantity: 1
        }],
        address: customer4.addresses[0],
        deliveryDate: '2026-10-12',
        subtotal: 799,
        discount: 0,
        deliveryCharge: 99,
        totalAmount: 898,
        paymentMethod: 'UPI_QR',
        paymentStatus: 'PAID',
        orderStatus: 'Preparing',
        createdAt: new Date('2026-10-09T08:30:00Z')
      },
      {
        orderId: 'HT-20261013-6103',
        userId: customer2._id,
        customerName: customer2.name,
        customerEmail: customer2.email,
        customerPhone: customer2.phone,
        items: [{
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          quantity: 1
        }],
        address: customer2.addresses[0],
        deliveryDate: '2026-10-15',
        subtotal: 699,
        discount: 0,
        deliveryCharge: 99,
        totalAmount: 798,
        paymentMethod: 'UPI_QR',
        paymentStatus: 'PAID',
        orderStatus: 'Packed',
        createdAt: new Date('2026-10-13T14:45:00Z')
      }
    ];

    await Order.insertMany(sampleOrders);

    // 6. Seed Monthly Expenses & Loss Records
    console.log('[AutoSeed] Seeding Monthly Expenses, Losses & Material Costs...');

    const sampleExpenses = [
      // May 2026
      {
        title: 'Wholesale Dutch Roses & Fresh Lilies',
        category: 'Raw Materials',
        amount: 820,
        date: new Date('2026-05-02T10:00:00Z'),
        month: '2026-05',
        notes: 'Bulk floral lot for Mother’s Day rush'
      },
      {
        title: 'Rigid Luxury Box Bases & Pink Ribbons',
        category: 'Packaging & Ribbons',
        amount: 450,
        date: new Date('2026-05-05T12:00:00Z'),
        month: '2026-05',
        notes: '20 medium craft boxes & pastel satin ribbons'
      },
      {
        title: 'Local Delivery Logistics & Bike Courier',
        category: 'Logistics & Courier',
        amount: 250,
        date: new Date('2026-05-20T16:00:00Z'),
        month: '2026-05',
        notes: 'Partner delivery fees'
      },

      // June 2026
      {
        title: 'Imported Cadbury Silk & Ferrero Rocher Stocks',
        category: 'Raw Materials',
        amount: 950,
        date: new Date('2026-06-03T11:00:00Z'),
        month: '2026-06',
        notes: 'Wholesale batch for chocolate bouquets'
      },
      {
        title: 'Transit Flower Wilting / Damaged Inventory Loss',
        category: 'Damaged & Wastage Loss',
        amount: 320,
        date: new Date('2026-06-15T15:30:00Z'),
        month: '2026-06',
        notes: 'Summer heat damage to 8 rose stems during transport'
      },
      {
        title: 'Studio Lighting & Packing Supplies',
        category: 'Operational & Utilities',
        amount: 380,
        date: new Date('2026-06-25T18:00:00Z'),
        month: '2026-06',
        notes: 'Hot glue guns, tissue paper & scissors'
      },

      // July 2026
      {
        title: 'Aesthetic Scented Soy Wax & Fragrance Oils',
        category: 'Raw Materials',
        amount: 680,
        date: new Date('2026-07-04T10:30:00Z'),
        month: '2026-07',
        notes: 'Rose & Vanilla aromatherapy candle supply'
      },
      {
        title: 'Kraft Paper, Shredded Fillers & Cards',
        category: 'Packaging & Ribbons',
        amount: 420,
        date: new Date('2026-07-12T14:00:00Z'),
        month: '2026-07',
        notes: 'Greeting card print run and pink crinkle paper'
      },
      {
        title: 'Customer Cancellation Shipping Loss',
        category: 'Damaged & Wastage Loss',
        amount: 290,
        date: new Date('2026-07-19T11:00:00Z'),
        month: '2026-07',
        notes: 'COD refused at delivery - packaging wastage'
      },

      // August 2026
      {
        title: 'Sunflowers & Baby’s Breath Stems Wholesale',
        category: 'Raw Materials',
        amount: 890,
        date: new Date('2026-08-05T09:00:00Z'),
        month: '2026-08',
        notes: 'Fresh cut sunflowers lot'
      },
      {
        title: 'Velvet Ribbon Rolls & Custom Stamp Foil',
        category: 'Packaging & Ribbons',
        amount: 360,
        date: new Date('2026-08-15T12:00:00Z'),
        month: '2026-08',
        notes: 'Gold embossed brand stickers'
      },
      {
        title: 'Instagram Creative Promotion & Ads',
        category: 'Marketing & Ads',
        amount: 500,
        date: new Date('2026-08-20T17:00:00Z'),
        month: '2026-08',
        notes: 'Festival gifting campaign sponsored post'
      },

      // September 2026
      {
        title: 'Handmade Crochet Yarn & Hooks Inventory',
        category: 'Raw Materials',
        amount: 640,
        date: new Date('2026-09-04T13:00:00Z'),
        month: '2026-09',
        notes: 'Cotton yarn for everlasting crochet sunflowers'
      },
      {
        title: 'Luxury Keepsake Boxes (Small & Medium)',
        category: 'Packaging & Ribbons',
        amount: 510,
        date: new Date('2026-09-14T11:30:00Z'),
        month: '2026-09',
        notes: 'Reorder of blush pink presentation boxes'
      },
      {
        title: 'Damaged Candle Votives in Transit',
        category: 'Damaged & Wastage Loss',
        amount: 210,
        date: new Date('2026-09-22T16:00:00Z'),
        month: '2026-09',
        notes: 'Glass votives cracked during supplier shipping'
      },

      // October 2026 (Current Month)
      {
        title: 'October Fresh Floral Batch & Roses',
        category: 'Raw Materials',
        amount: 980,
        date: new Date('2026-10-02T10:00:00Z'),
        month: '2026-10',
        notes: 'Fresh red and pink roses for weekend hamper orders'
      },
      {
        title: 'Premium Gift Baskets & Wooden Keepsake Boxes',
        category: 'Packaging & Ribbons',
        amount: 540,
        date: new Date('2026-10-06T14:00:00Z'),
        month: '2026-10',
        notes: 'Woven cane baskets and luxury matte boxes'
      },
      {
        title: 'Express Doorstep Delivery Courier Fees',
        category: 'Logistics & Courier',
        amount: 350,
        date: new Date('2026-10-10T12:00:00Z'),
        month: '2026-10',
        notes: 'Same-day courier dispatch for surprise birthday hampers'
      }
    ];

    await Expense.insertMany(sampleExpenses);

    console.log('✅ [AutoSeed] Admin, Customers, Historical Orders, Monthly Sales & Losses successfully initialized!');
  } catch (error) {
    console.error('❌ [AutoSeed] Error:', error.message);
  }
};

module.exports = autoSeed;
