const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filtering, search, and sorting
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, occasion, minPrice, maxPrice, search, sort, featured, bestSeller } = req.query;

    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (occasion && occasion !== 'All') {
      query.occasion = { $regex: new RegExp(`^${occasion}$`, 'i') };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (bestSeller === 'true') {
      query.isBestSeller = true;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { occasion: searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 }; // default newest

    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'popularity') {
      sortOption = { rating: -1, reviewsCount: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query).sort(sortOption);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Find related products in same category
      const relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
      }).limit(4);

      res.json({
        success: true,
        product,
        relatedProducts
      });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, getCategories };
