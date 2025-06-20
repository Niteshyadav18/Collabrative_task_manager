import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Task operations
export const TaskService = {
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async getTasks(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  async updateTask(id, updates) {
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
  },

  async deleteTask(id) {
    await api.delete(`/tasks/${id}`);
  },

  async getTeamMembers() {
    const response = await api.get('/tasks/team-members');
    return response.data;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Server is not responding');
  }
};