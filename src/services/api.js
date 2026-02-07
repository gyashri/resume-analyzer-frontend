import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data.message || 'Something went wrong';
      console.error('API Error:', message);

      const isAuthEndpoint = error.config.url.includes('/auth/login') ||
                             error.config.url.includes('/auth/register') ||
                             error.config.url.includes('/auth/me');
      const isOnAuthPage = window.location.pathname === '/login' ||
                           window.location.pathname === '/register';

      if (error.response.status === 401 && !isAuthEndpoint && !isOnAuthPage) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Resume API calls
export const resumeAPI = {
  upload: (formData) =>
    api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getMyResumes: () => api.get('/resumes'),
  getResumeById: (id) => api.get(`/resumes/${id}`),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
};

// Job API calls
export const jobAPI = {
  getMatchedJobs: (params) => api.get('/jobs/match', { params }),
  getMatchedJobsForResume: (resumeId, params) =>
    api.get(`/jobs/match/${resumeId}`, { params }),
};

// Admin API calls
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  getResumes: () => api.get('/admin/resumes'),
};

export default api;
