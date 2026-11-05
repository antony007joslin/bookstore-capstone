import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (data) => apiClient.post('/auth/register', data),
  getProfile: (userId) => apiClient.get(`/auth/profile/${userId}`),
};

export const bookApi = {
  getBooks: (params) => apiClient.get('/books', { params }),
  getFeaturedBooks: () => apiClient.get('/books/featured'),
  getBookById: (id) => apiClient.get(`/books/${id}`),
  getRelatedBooks: (id) => apiClient.get(`/books/${id}/related`),
  getRecommendations: (userId) => apiClient.get(`/recommendations/user/${userId}`),
};

export const taxonomyApi = {
  getCategories: () => apiClient.get('/categories'),
  getCategoryById: (id) => apiClient.get(`/categories/${id}`),
  getBrands: () => apiClient.get('/brands'),
  getBrandById: (id) => apiClient.get(`/brands/${id}`),
};

export const addressApi = {
  getUserAddresses: (userId) => apiClient.get(`/addresses/user/${userId}`),
  createAddress: (userId, address) => apiClient.post(`/addresses/user/${userId}`, address),
};

export const orderApi = {
  createOrder: (orderData) => apiClient.post('/orders', orderData),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  getUserOrders: (userId) => apiClient.get(`/orders/user/${userId}`),
  cancelOrder: (orderId, userId) => apiClient.post(`/orders/${orderId}/cancel`, null, { params: { userId } }),
};

export default apiClient;
