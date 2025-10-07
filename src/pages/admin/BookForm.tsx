import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/hooks/use-toast';

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  description: string;
  category: string;
  publisher: string;
  publishedYear: number;
  pages: number;
  language: string;
  coverImage: string;
  stock: number;
  available: number;
  status: string;
}

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    publisher: '',
    publishedYear: new Date().getFullYear(),
    pages: 0,
    language: 'Indonesian',
    coverImage: '',
    stock: 0,
    available: 0,
    status: 'available'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      // ✅ FIX: API mengembalikan { success, data } bukan { book }
      if (result.success && result.data) {
        // Map field names dari API ke form
        setFormData({
          title: result.data.title || '',
          author: result.data.author || '',
          isbn: result.data.issn || result.data.isbn || '', // API menggunakan 'issn'
          description: result.data.description || '',
          category: result.data.category || '',
          publisher: result.data.publisher || '',
          publishedYear: result.data.published_year || result.data.publishedYear || new Date().getFullYear(),
          pages: result.data.pages || 0,
          language: result.data.language || 'Indonesian',
          coverImage: result.data.cover || result.data.coverImage || '',
          stock: result.data.stock || 0,
          available: result.data.available || 0,
          status: result.data.status || 'available'
        });
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      toast({
        title: 'Error',
        description: 'Failed to load book data',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = isEdit 
        ? `http://localhost:5000/api/admin/books/${id}`
        : 'http://localhost:5000/api/admin/books';
      
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Book ${isEdit ? 'updated' : 'created'} successfully`
        });
        navigate('/admin/books');
      } else {
        throw new Error(result.message || 'Failed to save book');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save book',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['publishedYear', 'pages', 'stock', 'available'].includes(name) 
        ? parseInt(value) || 0 
        : value
    }));
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/books')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Books
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEdit ? 'Edit Book' : 'Add New Book'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN *
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Fiction, Science, History"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publisher *
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Published Year *
              </label>
              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pages *
              </label>
              <input
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available *
              </label>
              <input
                type="number"
                name="available"
                value={formData.available}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <input
                type="text"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Saving...' : 'Save Book'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/books')}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default BookForm;