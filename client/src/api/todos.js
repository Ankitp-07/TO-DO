import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ─── Interceptors ─────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ─── Todo API ─────────────────────────────────────────────────────────────────
export const todosApi = {
  /**
   * GET /todos — fetch all todos with optional filters
   * @param {{ status?: string, search?: string, sort?: string }} params
   */
  getAll: (params = {}) =>
    api.get('/todos', { params }).then((r) => r.data),

  /**
   * GET /todos/:id
   */
  getById: (id) =>
    api.get(`/todos/${id}`).then((r) => r.data),

  /**
   * POST /todos
   */
  create: (payload) =>
    api.post('/todos', payload).then((r) => r.data),

  /**
   * PUT /todos/:id
   */
  update: (id, payload) =>
    api.put(`/todos/${id}`, payload).then((r) => r.data),

  /**
   * PATCH /todos/:id/toggle
   */
  toggle: (id) =>
    api.patch(`/todos/${id}/toggle`).then((r) => r.data),

  /**
   * DELETE /todos/:id
   */
  remove: (id) =>
    api.delete(`/todos/${id}`).then((r) => r.data),

  /**
   * DELETE /todos/completed
   */
  removeCompleted: () =>
    api.delete('/todos/completed').then((r) => r.data),
};
