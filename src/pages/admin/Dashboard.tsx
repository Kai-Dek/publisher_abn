import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Users, Package, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { adminStatsAPI } from '@/lib/api';

interface Stats {
  totalBooks: number;
  totalUsers: number;
  availableBooks: number;
  totalStock: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalUsers: 0,
    availableBooks: 0,
    totalStock: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminStatsAPI.getStats();
      
      if (response.success) {
        setStats(response.data || {
          totalBooks: 0,
          totalUsers: 0,
          availableBooks: 0,
          totalStock: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: Book,
      color: 'bg-blue-500',
      link: '/admin/books'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      link: '/admin/users'
    },
    {
      title: 'Available Books',
      value: stats.availableBooks,
      icon: Package,
      color: 'bg-yellow-500',
      link: '/admin/books'
    },
    {
      title: 'Total Stock',
      value: stats.totalStock,
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/admin/books'
    }
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Library Admin Panel</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <Link 
              key={index} 
              to={card.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <card.icon className="text-white" size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/books/new"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-center hover:bg-blue-600 transition-colors"
          >
            Add New Book
          </Link>
          <Link 
            to="/admin/books"
            className="bg-green-500 text-white px-6 py-3 rounded-lg text-center hover:bg-green-600 transition-colors"
          >
            Manage Books
          </Link>
          <Link 
            to="/admin/users"
            className="bg-purple-500 text-white px-6 py-3 rounded-lg text-center hover:bg-purple-600 transition-colors"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;