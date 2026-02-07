import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Send cookies with requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Cookies are automatically sent with withCredentials: true
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
      // Server responded with error status
      const message = error.response.data.message || 'Something went wrong';
      console.error('API Error:', message);

      // Redirect to login if unauthorized, BUT NOT if:
      // 1. The error came from login/register endpoints, OR
      // 2. We're already on the login/register page
      const isAuthEndpoint = error.config.url.includes('/auth/login') ||
                             error.config.url.includes('/auth/register') ||
                             error.config.url.includes('/auth/me');
      const isOnAuthPage = window.location.pathname === '/login' ||
                           window.location.pathname === '/register';

      if (error.response.status === 401 && !isAuthEndpoint && !isOnAuthPage) {
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
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
