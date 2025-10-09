// API Configuration and Helper Functions

// ✅ Hilangkan trailing slash
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-publisher-abn.vercel.app';

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

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid, redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response;
};

// ✅ Helper untuk request tanpa auth
const publicFetch = async (url: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response;
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
      const response = await publicFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Gagal mendaftar' };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await publicFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Gagal login' };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await authFetch('/auth/me');
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
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.order) queryParams.append('order', params.order);

      const url = queryParams.toString() ? `/books?${queryParams}` : '/books';
      const response = await publicFetch(url);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get books error:', error);
      return { success: false, message: 'Gagal mengambil data buku', data: { books: [], total: 0 } };
    }
  },

  getById: async (id: string) => {
    try {
      const response = await publicFetch(`/books/${id}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get book by ID error:', error);
      return { success: false, message: 'Gagal mengambil detail buku' };
    }
  },

  getFeatured: async () => {
    try {
      const response = await publicFetch('/books/featured/list');
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get featured books error:', error);
      return { success: false, message: 'Gagal mengambil buku featured', data: [] };
    }
  },

  getCategories: async () => {
    try {
      const response = await publicFetch('/books/categories/list');
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get categories error:', error);
      return { success: false, message: 'Gagal mengambil kategori', data: [] };
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

      const url = queryParams.toString() ? `/admin/books?${queryParams}` : '/admin/books';
      const response = await authFetch(url);
      return response.json();
    } catch (error) {
      console.error('Admin get books error:', error);
      return { success: false, message: 'Gagal mengambil data buku' };
    }
  },

  create: async (bookData: any) => {
    try {
      const response = await authFetch('/admin/books', {
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
      const response = await authFetch(`/admin/books/${id}`, {
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
      const response = await authFetch(`/admin/books/${id}`, {
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

      const url = queryParams.toString() ? `/admin/users?${queryParams}` : '/admin/users';
      const response = await authFetch(url);
      return response.json();
    } catch (error) {
      console.error('Admin get users error:', error);
      return { success: false, message: 'Gagal mengambil data user' };
    }
  },

  updateStatus: async (id: string, status: string) => {
    try {
      const response = await authFetch(`/admin/users/${id}/status`, {
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
      const response = await authFetch(`/admin/users/${id}`, {
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
      const response = await authFetch('/admin/stats');
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