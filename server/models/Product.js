const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Books', 'Electronics', 'Dorm Essentials', 'Stationery', 'Clothing', 'Other'],
    default: 'Other',
  },
  condition: {
    type: String,
    enum: ['New', 'Mint', 'Good', 'Fair'],
    default: 'Good',
  },
  images: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isSold: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', ProductSchema);
