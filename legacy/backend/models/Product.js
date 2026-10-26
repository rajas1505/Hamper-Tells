const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  occasion: { type: String, default: 'All', index: true }, // Birthday, Anniversary, For Her, For Him, Celebration, Personalized, Flowers, Corporate
  images: [{ type: String, required: true }],
  stock: { type: Number, default: 50 },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 12 },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  customizable: { type: Boolean, default: false },
  includedItems: [{ type: String }],
  dimensions: { type: String, default: 'Standard Boutique Size' },
  careTips: { type: String, default: 'Handle with care. Keep in a dry, ambient room temperature.' },
  isDemoNotice: { type: String, default: 'DEMO PRODUCT' },
  createdAt: { type: Date, default: Date.now }
});

ProductSchema.index({ name: 'text', description: 'text', category: 'text', occasion: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
