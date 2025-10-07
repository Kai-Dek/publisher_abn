import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X, User, LogOut, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserData {
  name: string;
  email: string;
  role: string;
}

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(userStr);
        setUserData(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserData(null);
    navigate('/');
    window.location.reload(); // Refresh to update UI
  };

  const handleProfileClick = () => {
    if (userData?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/profile');
    }
  };

  return (
    <nav className="bg-primary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold text-primary-foreground">
              Adilla Bangun Negeri
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-primary-foreground hover:text-accent transition-colors"
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className="text-primary-foreground hover:text-accent transition-colors"
            >
              Katalog
            </Link>
            <Link
              to="/search"
              className="text-primary-foreground hover:text-accent transition-colors"
            >
              Pencarian
            </Link>

            {/* User Menu or Login Button */}
            {isAuthenticated && userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground hover:text-accent hover:bg-primary/80"
                  >
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userData.name}</p>
                      <p className="text-xs text-muted-foreground">{userData.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>{userData.role === 'admin' ? 'Dashboard' : 'Profile'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/"
              className="block text-primary-foreground hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className="block text-primary-foreground hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Katalog
            </Link>
            <Link
              to="/search"
              className="block text-primary-foreground hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pencarian
            </Link>

            {/* Mobile User Menu */}
            {isAuthenticated && userData ? (
              <div className="pt-4 border-t border-primary-foreground/20">
                <div className="mb-3">
                  <p className="text-sm font-medium text-primary-foreground">{userData.name}</p>
                  <p className="text-xs text-primary-foreground/60">{userData.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleProfileClick();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-primary-foreground hover:text-accent transition-colors mb-2"
                >
                  {userData.role === 'admin' ? 'Dashboard' : 'Profile'}
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;