const { validationResult } = require('express-validator');
const pool = require('../config/database');

// Get all todos for authenticated user
const getTodos = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json({
      todos: result.rows
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Server error fetching todos' });
  }
};

// Create new todo
const createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, completed } = req.body;

    const result = await pool.query(
      'INSERT INTO todos (user_id, title, description, completed) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, title, description || '', completed || false]
    );

    res.status(201).json({
      message: 'Todo created successfully',
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Server error creating todo' });
  }
};

// Update todo
const updateTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, completed } = req.body;

    // Check if todo exists and belongs to user
    const todoCheck = await pool.query(
      'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (todoCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Update todo
    const result = await pool.query(
      'UPDATE todos SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, description, completed, id, req.userId]
    );

    res.json({
      message: 'Todo updated successfully',
      todo: result.rows[0]
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Server error updating todo' });
  }
};

// Delete todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if todo exists and belongs to user
    const todoCheck = await pool.query(
      'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (todoCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Delete todo
    await pool.query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    res.json({
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Server error deleting todo' });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
