const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  publishedYear: {
    type: Number,
    required: true
  },
  pages: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    default: 'Indonesian'
  },
  coverImage: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 0
  },
  available: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);