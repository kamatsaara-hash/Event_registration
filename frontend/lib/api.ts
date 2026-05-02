import axios from 'axios';

// 🔥 IMPORTANT: use backend URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ⚠️ REMOVE JWT (you said no JWT)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Basic error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

//////////////////////////////////////////////////////
// 🔐 AUTH API
//////////////////////////////////////////////////////

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  signup: (data: {
    fullName: string;
    email: string;
    phone: string;
    college: string;
    password: string;
  }) => api.post('/auth/signup', data),

  adminLogin: (email: string, password: string) =>
    api.post('/auth/admin/login', { email, password }),

  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),

  resendVerification: () =>
    api.post('/auth/resend-verification'),

  getProfile: () =>
    api.get('/auth/profile'),
};

//////////////////////////////////////////////////////
// 🎯 EVENTS API
//////////////////////////////////////////////////////

export const eventsAPI = {
  getAll: () => api.get('/events'),

  getById: (id: string) => api.get(`/events/${id}`),

  getGroupEvents: () => api.get('/events?type=group'),

  getSoloEvents: () => api.get('/events?type=solo'),

  register: (eventId: string) =>
    api.post(`/events/${eventId}/register`),

  unregister: (eventId: string) =>
    api.delete(`/events/${eventId}/register`),

  getRegisteredEvents: () =>
    api.get('/events/registered'),
};

//////////////////////////////////////////////////////
// 👥 TEAMS API
//////////////////////////////////////////////////////

export const teamsAPI = {
  create: (data: {
    eventId: string;
    teamName: string;
    teamSize: number;
  }) => api.post('/teams', data),

  join: (teamCode: string) =>
    api.post('/teams/join', { teamCode }),

  leave: (teamId: string) =>
    api.post(`/teams/${teamId}/leave`),

  getMyTeams: () =>
    api.get('/teams/my-teams'),

  getTeamById: (teamId: string) =>
    api.get(`/teams/${teamId}`),
};

//////////////////////////////////////////////////////
// 👤 USER API
//////////////////////////////////////////////////////

export const userAPI = {
  getDashboard: () =>
    api.get('/user/dashboard'),

  getQRPass: () =>
    api.get('/user/qr-pass'),
};

//////////////////////////////////////////////////////
// 🛠 ADMIN API
//////////////////////////////////////////////////////

export const adminAPI = {
  getParticipants: () =>
    api.get('/admin/participants'),

  getEvents: () =>
    api.get('/admin/events'),

  createEvent: (data: {
    name: string;
    type: 'solo' | 'group';
    description: string;
    maxTeamSize?: number;
  }) => api.post('/admin/events', data),

  getAllTeams: () =>
    api.get('/admin/teams'),

  scanQR: (qrData: string) =>
    api.post('/admin/attendance/scan', { qrData }),

  getAnalytics: () =>
    api.get('/admin/analytics'),

  updateEvent: (id: string, data: any) =>
    api.put(`/admin/events/${id}`, data),

  deleteEvent: (id: string) =>
    api.delete(`/admin/events/${id}`),

  deleteParticipant: (id: string) =>
    api.delete(`/admin/participants/${id}`),
};

export default api;