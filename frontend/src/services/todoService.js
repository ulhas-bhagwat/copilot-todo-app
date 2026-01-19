import api from '../utils/api';

const todoService = {
  getTodos: async () => {
    try {
      const response = await api.get('/todos');
      return response.data.todos;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch todos';
    }
  },

  createTodo: async (todoData) => {
    try {
      const response = await api.post('/todos', todoData);
      return response.data.todo;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to create todo';
    }
  },

  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return response.data.todo;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to update todo';
    }
  },

  deleteTodo: async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to delete todo';
    }
  },
};

export default todoService;
