const Product = require('../models/Product');

// @desc    Get all active marketplace products
// @route   GET /api/marketplace
// @access  Private
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isSold: false };
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const products = await Product.find(query)
      .populate('seller', 'name profile.profilePic')
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Post product to marketplace
// @route   POST /api/marketplace
// @access  Private
const postProduct = async (req, res) => {
  try {
    const { title, description, price, category, condition, images } = req.body;
    const product = await Product.create({
      title,
      description,
      price,
      category,
      condition,
      images: images || [],
      seller: req.user.id,
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, postProduct };
