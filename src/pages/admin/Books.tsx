import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/hooks/use-toast';

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  stock: number;
  available: number;
  status: string;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, [currentPage, search]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/admin/books?page=${currentPage}&limit=10&search=${search}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Book deleted successfully'
        });
        fetchBooks();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete book',
        variant: 'destructive'
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Books Management</h1>
            <p className="text-gray-600 mt-2">Manage your library books</p>
          </div>
          <Link 
            to="/admin/books/new"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Add New Book
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{book.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{book.isbn}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {book.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{book.available}/{book.stock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          book.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/books/edit/${book._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(book._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {books.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No books found
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Books;