import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, BookOpen } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(loginData.email, loginData.password);

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        toast({
          title: 'Login Successful',
          description: `Welcome back, ${response.user.name}!`
        });

        // Redirect based on role
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
        address: registerData.address
      });

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        toast({
          title: 'Registration Successful',
          description: 'Your account has been created!'
        });

        navigate('/');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-full">
              <BookOpen className="text-white" size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Library System</h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Login/Register Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Toggle Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                isLogin
                  ? 'bg-white text-blue-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                !isLogin
                  ? 'bg-white text-blue-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Register
            </button>
          </div>

          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <LogIn size={20} />
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="08123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, password: e.target.value })
                    }
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Register'}
                </button>
              </div>
            </form>
          )}

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;