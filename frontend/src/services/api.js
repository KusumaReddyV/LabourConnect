import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('lc_user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      const isPublic =
        path === '/' ||
        path.startsWith('/login') ||
        path.startsWith('/register') ||
        path === '/services' ||
        path === '/helpdesk' ||
        path === '/start' ||
        path === '/about';
      if (!isPublic) {
        localStorage.removeItem('lc_user');
        const from = path + window.location.search;
        window.location.href = `/login?from=${encodeURIComponent(from)}`;
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  registerLabour: (formData) =>
    api.post('/auth/register/labour', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  registerClient: (data) => api.post('/auth/register/client', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const labourAPI = {
  search: (params) => api.get('/labour/search', { params }),
  getPublic: (id) => api.get(`/labour/public/${id}`),
  getProfile: () => api.get('/labour/profile/me'),
  updateProfile: (formData) =>
    api.put('/labour/profile/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getJobRequests: (status) =>
    api.get('/labour/jobs/requests', { params: status ? { status } : {} }),
  acceptJob: (id) => api.patch(`/jobs/${id}/accept`),
  rejectJob: (id) => api.put(`/labour/jobs/${id}/reject`),
  startJob: (id) => api.patch(`/jobs/${id}/start`),
  finishWork: (id) => api.patch(`/jobs/${id}/complete`),
  completeJob: (id) => api.put(`/jobs/complete/${id}`),
  getCompletedJobs: () => api.get('/labour/jobs/completed'),
  getEarnings: () => api.get('/labour/earnings/me'),
  getEarningsByLabourId: (labourId) => api.get(`/labour/earnings/${labourId}`),
};

export const clientAPI = {
  getProfile: () => api.get('/client/profile/me'),
  updateProfile: (data) => api.put('/client/profile/me', data),
  hire: (data) => api.post('/client/hire', data),
  getJobs: (status) => api.get('/client/jobs', { params: status ? { status } : {} }),
  getPendingVerifications: () => api.get('/client/jobs/pending-verification'),
  confirmComplete: (id, data) => api.put(`/client/jobs/${id}/confirm-complete`, data),
  getFavourites: () => api.get('/client/favourites'),
  toggleFavourite: (labourId) => api.post(`/client/favourites/${labourId}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const reviewAPI = {
  getForLabour: (labourId) => api.get(`/reviews/labour/${labourId}`),
  create: (data) => api.post('/reviews', data),
};

export const jobsAPI = {
  create: (data) => api.post('/jobs', data),
  getAll: () => api.get('/jobs'),
  accept: (id) => api.patch(`/jobs/${id}/accept`),
  start: (id) => api.patch(`/jobs/${id}/start`),
  complete: (id) => api.patch(`/jobs/${id}/complete`),
  sendMessage: (id, message) => api.post(`/jobs/${id}/message`, { message }),
  getMessages: (id) => api.get(`/jobs/${id}/messages`),
};

export const helpdeskAPI = {
  submit: (data) => api.post('/helpdesk', data),
};

export const adminAPI = {
  getUsers: (role) => api.get('/admin/users', { params: role ? { role } : {} }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  blockUser: (id, isBlocked) => api.put(`/admin/users/${id}/block`, { isBlocked }),
  getAnalytics: () => api.get('/admin/analytics'),
  getHelpdesk: () => api.get('/admin/helpdesk'),
  updateHelpdeskStatus: (id, status) => api.patch(`/admin/helpdesk/${id}`, { status }),
  getJobs: () => api.get('/admin/jobs'),
};

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  return `${base}${path}`;
};

export default api;
