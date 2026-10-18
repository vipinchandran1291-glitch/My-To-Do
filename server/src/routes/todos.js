import { Router } from 'express';
import {
  listTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteCompletedTodos,
} from '../db.js';

const router = Router();
const MAX_TEXT_LENGTH = 500;

function validateText(text) {
  if (typeof text !== 'string' || !text.trim()) return 'Text is required';
  if (text.trim().length > MAX_TEXT_LENGTH) return `Text must be ${MAX_TEXT_LENGTH} characters or fewer`;
  return null;
}

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Invalid id' });
    return null;
  }
  return id;
}

// GET /api/todos
router.get('/', (req, res) => {
  res.json(listTodos());
});

// POST /api/todos  { text }
router.post('/', (req, res) => {
  const error = validateText(req.body?.text);
  if (error) return res.status(400).json({ error });
  res.status(201).json(createTodo(req.body.text.trim()));
});

// PATCH /api/todos/:id  { text?, completed? }
router.patch('/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;

  const { text, completed } = req.body ?? {};
  const changes = {};

  if (text !== undefined) {
    const error = validateText(text);
    if (error) return res.status(400).json({ error });
    changes.text = text.trim();
  }
  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'completed must be a boolean' });
    }
    changes.completed = completed;
  }

  const todo = updateTodo(id, changes);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// DELETE /api/todos/completed  (clear all completed)
router.delete('/completed', (req, res) => {
  res.json({ deleted: deleteCompletedTodos() });
});

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  if (!deleteTodo(id)) return res.status(404).json({ error: 'Todo not found' });
  res.status(204).end();
});

export default router;
