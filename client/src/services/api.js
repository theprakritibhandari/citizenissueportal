const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Helper to get auth header with token
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

// Generic fetch wrapper with clean error extraction
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, options);

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { success: false, message: 'Invalid response from server' };
  }

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Authentication
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  adminLogin: (email, password) =>
    request('/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password, phone) =>
    request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    }),

  getMe: () =>
    request('/auth/me', {
      method: 'GET',
      headers: getAuthHeaders(),
    }),

  // Citizen Issues
  createIssue: (formData) =>
    request('/issues', {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData, // FormData handles its own boundary
    }),

  getAllIssues: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/issues${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  getMyIssues: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/issues/my${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getIssueById: (id) =>
    request(`/issues/${id}`, {
      method: 'GET',
    }),

  updateIssue: (id, formData) =>
    request(`/issues/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: formData,
    }),

  deleteIssue: (id) =>
    request(`/issues/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),

  // Admin APIs
  getAdminStats: () =>
    request('/admin/stats', {
      method: 'GET',
      headers: getAuthHeaders(),
    }),

  getAdminIssues: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/issues${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  updateIssueStatus: (id, status, adminRemark) =>
    request(`/admin/issues/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, adminRemark }),
    }),

  deleteIssueAdmin: (id) =>
    request(`/admin/issues/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),

  getAdminUsers: () =>
    request('/admin/users', {
      method: 'GET',
      headers: getAuthHeaders(),
    }),

  updateAdminProfile: (data) =>
    request('/admin/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }),

  updateAdminPassword: (data) =>
    request('/admin/password', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }),
};
