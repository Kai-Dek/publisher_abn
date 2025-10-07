const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_db');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'admin',
      phone: '081234567890',
      address: 'Pekanbaru, Riau',
      status: 'active'
    });
    console.log('Admin user created:', adminUser.email);

    // Create regular user
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'user@library.com',
      password: 'user123',
      role: 'user',
      phone: '081234567891',
      address: 'Pekanbaru, Riau',
      status: 'active'
    });
    console.log('Regular user created:', regularUser.email);

    // Create sample books
    const books = [
      {
        title: 'Laskar Pelangi',
        author: 'Andrea Hirata',
        isbn: '978-979-3062-79-2',
        description: 'Novel tentang perjuangan anak-anak dari keluarga miskin untuk mendapatkan pendidikan di Pulau Belitung.',
        category: 'Fiction',
        publisher: 'Bentang Pustaka',
        publishedYear: 2005,
        pages: 529,
        language: 'Indonesian',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51ZqgFWDIcL.jpg',
        stock: 10,
        available: 10,
        rating: 4.8,
        status: 'available'
      },
      {
        title: 'Bumi Manusia',
        author: 'Pramoedya Ananta Toer',
        isbn: '978-602-291-103-7',
        description: 'Novel pertama dari Tetralogi Buru yang menceritakan kisah Minke, seorang pribumi yang bersekolah di HBS.',
        category: 'Fiction',
        publisher: 'Lentera Dipantara',
        publishedYear: 1980,
        pages: 535,
        language: 'Indonesian',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41l8ZpnHL6L.jpg',
        stock: 8,
        available: 8,
        rating: 4.9,
        status: 'available'
      },
      {
        title: 'Ronggeng Dukuh Paruk',
        author: 'Ahmad Tohari',
        isbn: '978-979-3062-52-5',
        description: 'Novel tentang kehidupan Srintil, seorang ronggeng dari Dukuh Paruk yang memiliki takdir penuh tragedi.',
        category: 'Fiction',
        publisher: 'Gramedia Pustaka Utama',
        publishedYear: 1982,
        pages: 274,
        language: 'Indonesian',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41KXsE9DwNL.jpg',
        stock: 5,
        available: 5,
        rating: 4.7,
        status: 'available'
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        isbn: '978-0-06-231609-7',
        description: 'Sejarah umat manusia dari era batu hingga abad ke-21, mengungkap bagaimana Homo sapiens menjadi spesies dominan.',
        category: 'History',
        publisher: 'Harper',
        publishedYear: 2011,
        pages: 443,
        language: 'English',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41eNBo0u9PL.jpg',
        stock: 12,
        available: 12,
        rating: 4.6,
        status: 'available'
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0-13-235088-4',
        description: 'Panduan tentang bagaimana menulis kode yang bersih, mudah dipahami, dan mudah dipelihara.',
        category: 'Technology',
        publisher: 'Prentice Hall',
        publishedYear: 2008,
        pages: 464,
        language: 'English',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41SH-SvWPxL.jpg',
        stock: 15,
        available: 15,
        rating: 4.7,
        status: 'available'
      },
      {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        isbn: '978-0-85719-805-9',
        description: 'Pelajaran tentang kekayaan, keserakahan, dan kebahagiaan dari perspektif psikologi.',
        category: 'Finance',
        publisher: 'Harriman House',
        publishedYear: 2020,
        pages: 256,
        language: 'English',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41r6F7qGN3L.jpg',
        stock: 20,
        available: 20,
        rating: 4.8,
        status: 'available'
      }
    ];

    await Book.insertMany(books);
    console.log(`Created ${books.length} sample books`);

    console.log('\n=== Seeding completed successfully! ===');
    console.log('\nLogin credentials:');
    console.log('Admin - email: admin@library.com, password: admin123');
    console.log('User - email: user@library.com, password: user123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();