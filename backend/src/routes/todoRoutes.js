const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');

const router = express.Router();

// Validation rules
const todoValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title must not exceed 255 characters'),
  body('description')
    .optional()
    .trim(),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean')
];

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', getTodos);
router.post('/', todoValidation, createTodo);
router.put('/:id', todoValidation, updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
