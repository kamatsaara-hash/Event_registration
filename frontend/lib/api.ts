import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ cookies (sessions)
});

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
  }) =>
    api.post('/auth/signup', {
      ...data,
      confirmPassword: data.password, // ✅ REQUIRED by backend
    }),

  // ❗ FIXED ROUTE
  adminLogin: (email: string, password: string) =>
    api.post('/auth/admin-login', { email, password }),

  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

//////////////////////////////////////////////////////
// 🎯 EVENTS API
//////////////////////////////////////////////////////

export const eventsAPI = {
  getAll: () => api.get('/events'),

  register: (eventId: string) => 
    api.post('/user/register', { eventId }),

  // ✅ matches backend
  getRegisteredEvents: () =>
    api.get('/user/my-registrations'),
};

//////////////////////////////////////////////////////
// 👥 TEAMS API
//////////////////////////////////////////////////////

export const teamsAPI = {
  create: (data: {
    eventId: string;
    teamName: string;
    teamSize?: number;
  }) =>
    api.post('/team/create', data),

  join: (data: {
    eventId: string;
    teamCode: string;
  }) =>
    api.post('/team/join', data),

  leave: (teamId: string) =>
    api.post(`/team/leave/${teamId}`),

  // ✅ correct endpoint
  getMyTeam: (eventId: string) =>
    api.get(`/team/my/${eventId}`),
};

//////////////////////////////////////////////////////
// 👤 USER API
//////////////////////////////////////////////////////

export const userAPI = {
  updateProfile: (data: {
    fullName: string;
    phone: string;
    college: string;
  }) => api.put('/user/profile', data),
};

//////////////////////////////////////////////////////
// 👑 ADMIN API
//////////////////////////////////////////////////////

export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getParticipants: () => api.get('/admin/participants'),
  deleteParticipant: (id: string) => api.delete(`/admin/participants/${id}`),
  getAllTeams: () => api.get('/admin/teams'),
  getEvents: () => api.get('/events'), // Reusing events endpoint for reading
  createEvent: (data: any) => api.post('/admin/events', data),
  updateEvent: (id: string, data: any) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/admin/events/${id}`),
  scanQR: (registrationId: string) => api.post('/admin/scan', { registrationId }),
};

export default api;