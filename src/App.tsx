import { createContext, useState, useContext, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Search from "./pages/Search";
import BookDetail from "./pages/BookDetail";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBooks from "./pages/admin/Books";
import BookForm from "./pages/admin/BookForm";
import AdminUsers from "./pages/admin/Users";

const queryClient = new QueryClient();

// Auth Context
interface AuthContextType {
  token: string | null;
  user: any;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Initialize from localStorage on mount (only once)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user data');
      }
    }
  }, []);

  const login = (newToken: string, userData: any) => {
    setToken(newToken);
    setUser(userData);
    // Sync with localStorage for persistence
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useAuth();
  
  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/search" element={<Search />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/books" element={
              <ProtectedRoute>
                <AdminBooks />
              </ProtectedRoute>
            } />
            <Route path="/admin/books/new" element={
              <ProtectedRoute>
                <BookForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/books/edit/:id" element={
              <ProtectedRoute>
                <BookForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            } />
            
            {/* Redirect /admin to /admin/dashboard */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;