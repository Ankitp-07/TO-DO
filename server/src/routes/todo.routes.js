import { Router } from 'express';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteCompleted,
  deleteTodo,
} from '../controllers/todo.controller.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  createTodoSchema,
  updateTodoSchema,
  querySchema,
} from '../validators/todo.validator.js';

const router = Router();

// IMPORTANT: /completed must come before /:id to avoid "completed" being
// treated as an ObjectId parameter.

router.get('/', validateQuery(querySchema), getTodos);
router.post('/', validateBody(createTodoSchema), createTodo);

router.delete('/completed', deleteCompleted);

router.get('/:id', getTodoById);
router.put('/:id', validateBody(updateTodoSchema), updateTodo);
router.patch('/:id/toggle', toggleTodo);
router.delete('/:id', deleteTodo);

export default router;
