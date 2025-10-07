import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Book, 
  Users, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/books', icon: Book, label: 'Books' },
    { path: '/admin/users', icon: Users, label: 'Users' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 hover:text-gray-900"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-blue-600">Library Admin</h2>
              <p className="text-sm text-gray-500 mt-1">Management System</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${isActive(item.path)
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;