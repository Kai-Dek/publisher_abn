// API Configuration and Helper Functions

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-publisher-abn.vercel.app';

console.log('🌐 API Base URL:', API_BASE_URL);

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const fullUrl = `${API_BASE_URL}${url}`;
    console.log('🔐 Auth Fetch:', fullUrl);
    
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Non-JSON response:', text.substring(0, 200));
      throw new Error('Server returned non-JSON response');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response;
  } catch (error) {
    console.error('❌ Auth Fetch Error:', error);
    throw error;
  }
};

// Helper untuk request tanpa auth
const publicFetch = async (url: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const fullUrl = `${API_BASE_URL}${url}`;
    console.log('🔍 Public Fetch:', fullUrl);
    
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      mode: 'cors', // Explicitly set CORS mode
    });

    console.log('📡 Response status:', response.status, response.statusText);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Non-JSON response (first 200 chars):', text.substring(0, 200));
      
      // If it's HTML, likely 404 or wrong endpoint
      if (text.includes('<!doctype') || text.includes('<html')) {
        throw new Error(`Endpoint not found: ${url}. Backend might not be deployed correctly.`);
      }
      
      throw new Error('Server returned non-JSON response');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response;
  } catch (error) {
    console.error('❌ Public Fetch Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => {
    try {
      const response = await publicFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Gagal mendaftar' 
      };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await publicFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Gagal login' 
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await authFetch('/api/auth/me');
      return response.json();
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false, message: 'Gagal mengambil data user' };
    }
  },
};

// Books API (Public)
export const booksAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    order?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category && params.category !== 'all') queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.order) queryParams.append('order', params.order);

      const url = queryParams.toString() ? `/api/books?${queryParams}` : '/api/books';
      const response = await publicFetch(url);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get books error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Gagal mengambil data buku',
        data: { books: [], total: 0 } 
      };
    }
  },

  getById: async (id: string) => {
    try {
      const response = await publicFetch(`/api/books/${id}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get book by ID error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Gagal mengambil detail buku'
      };
    }
  },

  getFeatured: async () => {
    try {
      console.log('🌟 Fetching featured books...');
      const response = await publicFetch('/api/books/featured/list');
      const result = await response.json();
      console.log('✅ Featured books result:', result);
      return result;
    } catch (error) {
      console.error('Get featured books error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Gagal mengambil buku featured',
        data: [] 
      };
    }
  },

  getCategories: async () => {
    try {
      console.log('📚 Fetching categories...');
      const response = await publicFetch('/api/books/categories/list');
      const result = await response.json();
      console.log('✅ Categories result:', result);
      return result;
    } catch (error) {
      console.error('Get categories error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Gagal mengambil kategori',
        data: [] 
      };
    }
  },
};

// Admin Books API
export const adminBooksAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);

      const url = queryParams.toString() ? `/api/admin/books?${queryParams}` : '/api/admin/books';
      const response = await authFetch(url);
      return response.json();
    } catch (error) {
      console.error('Admin get books error:', error);
      return { success: false, message: 'Gagal mengambil data buku' };
    }
  },

  create: async (bookData: any) => {
    try {
      const response = await authFetch('/api/admin/books', {
        method: 'POST',
        body: JSON.stringify(bookData),
      });
      return response.json();
    } catch (error) {
      console.error('Create book error:', error);
      return { success: false, message: 'Gagal membuat buku' };
    }
  },

  update: async (id: string, bookData: any) => {
    try {
      const response = await authFetch(`/api/admin/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(bookData),
      });
      return response.json();
    } catch (error) {
      console.error('Update book error:', error);
      return { success: false, message: 'Gagal mengupdate buku' };
    }
  },

  delete: async (id: string) => {
    try {
      const response = await authFetch(`/api/admin/books/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    } catch (error) {
      console.error('Delete book error:', error);
      return { success: false, message: 'Gagal menghapus buku' };
    }
  },
};

// Admin Users API
export const adminUsersAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);

      const url = queryParams.toString() ? `/api/admin/users?${queryParams}` : '/api/admin/users';
      const response = await authFetch(url);
      return response.json();
    } catch (error) {
      console.error('Admin get users error:', error);
      return { success: false, message: 'Gagal mengambil data user' };
    }
  },

  updateStatus: async (id: string, status: string) => {
    try {
      const response = await authFetch(`/api/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return response.json();
    } catch (error) {
      console.error('Update user status error:', error);
      return { success: false, message: 'Gagal mengupdate status user' };
    }
  },

  delete: async (id: string) => {
    try {
      const response = await authFetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    } catch (error) {
      console.error('Delete user error:', error);
      return { success: false, message: 'Gagal menghapus user' };
    }
  },
};

// Admin Stats API
export const adminStatsAPI = {
  getStats: async () => {
    try {
      const response = await authFetch('/api/admin/stats');
      return response.json();
    } catch (error) {
      console.error('Get stats error:', error);
      return { success: false, message: 'Gagal mengambil statistik' };
    }
  },
};

export default {
  auth: authAPI,
  books: booksAPI,
  adminBooks: adminBooksAPI,
  adminUsers: adminUsersAPI,
  adminStats: adminStatsAPI,
};