import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import todoService from '../services/todoService';
import './Dashboard.css';

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingId) {
        const editTodo = todos.find((t) => t.id === editingId);
        await todoService.updateTodo(editingId, {
          title,
          description,
          completed: editTodo.completed,
        });
      } else {
        await todoService.createTodo({ title, description, completed: false });
      }
      setTitle('');
      setDescription('');
      setEditingId(null);
      await fetchTodos();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setEditingId(todo.id);
  };

  const handleCancelEdit = () => {
    setTitle('');
    setDescription('');
    setEditingId(null);
  };

  const handleToggleComplete = async (todo) => {
    try {
      await todoService.updateTodo(todo.id, {
        title: todo.title,
        description: todo.description,
        completed: !todo.completed,
      });
      await fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoService.deleteTodo(id);
        await fetchTodos();
      } catch (err) {
        setError('Failed to delete todo');
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Todos</h1>
        <div className="user-info">
          <span>Welcome, {user?.email}</span>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="todo-form-card">
          <h2>{editingId ? 'Edit Todo' : 'Add New Todo'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter todo title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter todo description (optional)"
                rows="3"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Todo' : 'Add Todo'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="todos-list">
          <h2>All Todos ({todos.length})</h2>
          {todos.length === 0 ? (
            <p className="no-todos">No todos yet. Create one above!</p>
          ) : (
            <div className="todos-grid">
              {todos.map((todo) => (
                <div key={todo.id} className={`todo-card ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-content">
                    <h3>{todo.title}</h3>
                    {todo.description && <p>{todo.description}</p>}
                    <span className="todo-date">
                      Created: {new Date(todo.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="todo-actions">
                    <button
                      onClick={() => handleToggleComplete(todo)}
                      className={`btn-toggle ${todo.completed ? 'completed' : ''}`}
                    >
                      {todo.completed ? '✓ Completed' : 'Mark Complete'}
                    </button>
                    <button
                      onClick={() => handleEdit(todo)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
