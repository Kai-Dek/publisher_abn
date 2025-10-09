const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

// ⚠️ PENTING: Route spesifik HARUS di atas route dengan parameter dinamis /:id

// Get featured books - HARUS DI ATAS /:id
router.get('/featured/list', async (req, res) => {
  try {
    const books = await Book.find({ status: 'available' })
      .sort({ rating: -1, createdAt: -1 })
      .limit(6);

    // Transform books
    const transformedBooks = books.map(book => ({
      _id: book._id,
      id: book._id,
      title: book.title,
      author: book.author,
      issn: book.isbn,
      description: book.description,
      category: book.category,
      publisher: book.publisher,
      published_year: book.publishedYear,
      pages: book.pages,
      language: book.language,
      cover: book.coverImage,
      stock: book.stock,
      available: book.available,
      rating: book.rating,
      status: book.status
    }));

    res.json({ 
      success: true, 
      data: transformedBooks 
    });
  } catch (error) {
    console.error('Get featured books error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get categories - HARUS DI ATAS /:id
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.json({ 
      success: true, 
      data: categories 
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get all books with pagination and filters
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const books = await Book.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Book.countDocuments(query);

    // Transform books to match frontend expectations
    const transformedBooks = books.map(book => ({
      _id: book._id,
      id: book._id,
      title: book.title,
      author: book.author,
      issn: book.isbn, // Map isbn to issn for frontend
      description: book.description,
      category: book.category,
      publisher: book.publisher,
      published_year: book.publishedYear, // Map publishedYear to published_year
      pages: book.pages,
      language: book.language,
      cover: book.coverImage, // Map coverImage to cover
      stock: book.stock,
      available: book.available,
      rating: book.rating,
      status: book.status
    }));

    res.json({
      success: true,
      data: {
        books: transformedBooks,
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get book by ID - HARUS DI BAWAH route spesifik
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ 
        success: false, 
        message: 'Book not found' 
      });
    }

    // Transform book to match frontend expectations
    const transformedBook = {
      _id: book._id,
      id: book._id,
      title: book.title,
      author: book.author,
      issn: book.isbn,
      description: book.description,
      category: book.category,
      publisher: book.publisher,
      published_year: book.publishedYear,
      pages: book.pages,
      language: book.language,
      cover: book.coverImage,
      stock: book.stock,
      available: book.available,
      rating: book.rating,
      status: book.status
    };

    res.json({ 
      success: true, 
      data: transformedBook 
    });
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;