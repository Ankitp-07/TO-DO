import Todo from '../models/Todo.js';
import { querySchema } from '../validators/todo.validator.js';

// GET /api/todos
export const getTodos = async (req, res, next) => {
  try {
    const { status, search, sort } = req.query;

    // Build filter
    const filter = {};

    if (status === 'active') filter.completed = false;
    else if (status === 'completed') filter.completed = true;

    if (search && search.trim()) {
      // Use regex search on title and description
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    // Build sort
    const sortMap = {
      createdAt_desc: { createdAt: -1 },
      createdAt_asc: { createdAt: 1 },
      dueDate_asc: { dueDate: 1 },
      priority_desc: { priority: -1 },
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    const todos = await Todo.find(filter).sort(sortObj).lean();

    res.json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/todos/:id 
export const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id).lean();

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/todos ─────────────────────────────────────────────────────────
export const createTodo = async (req, res, next) => {
  try {
    const todo = await Todo.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo,
    });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/todos/:id ──────────────────────────────────────────────────────
export const updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: todo,
    });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/todos/:id/toggle ────────────────────────────────────────────
export const toggleTodo = async (req, res, next) => {
  try {
    const existing = await Todo.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    existing.completed = !existing.completed;
    await existing.save();

    res.json({
      success: true,
      message: `Todo marked as ${existing.completed ? 'completed' : 'active'}`,
      data: existing.toObject(),
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/todos/completed ────────────────────────────────────────────
// NOTE: This route MUST be registered BEFORE /:id in the router
export const deleteCompleted = async (req, res, next) => {
  try {
    const result = await Todo.deleteMany({ completed: true });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} completed todo(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/todos/:id ───────────────────────────────────────────────────
export const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id).lean();

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully',
      data: todo,
    });
  } catch (err) {
    next(err);
  }
};
