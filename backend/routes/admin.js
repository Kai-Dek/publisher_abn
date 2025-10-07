const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// BOOKS MANAGEMENT

// Create book
router.post('/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({ message: 'Book created successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update book
router.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete book
router.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all books (admin view)
router.get('/books', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const query = search ? {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBooks: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// USERS MANAGEMENT

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user status
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DASHBOARD STATISTICS
router.get('/stats', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const availableBooks = await Book.countDocuments({ status: 'available' });
    const totalStock = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$stock' } } }
    ]);

    res.json({
      totalBooks,
      totalUsers,
      availableBooks,
      totalStock: totalStock[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;