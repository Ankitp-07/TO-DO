import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters'),

  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .default(''),

  priority: z
    .enum(['low', 'medium', 'high'], {
      errorMap: () => ({ message: 'Priority must be low, medium, or high' }),
    })
    .optional()
    .default('medium'),

  dueDate: z
    .string({ required_error: 'Due date is required' })
    .min(1, 'Due date is required')
    .datetime({ message: 'Invalid date format (ISO 8601 expected)' })
    .transform((val) => new Date(val)),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters')
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),

  priority: z
    .enum(['low', 'medium', 'high'], {
      errorMap: () => ({ message: 'Priority must be low, medium, or high' }),
    })
    .optional(),

  completed: z.boolean().optional(),

  dueDate: z
    .string()
    .min(1, 'Due date cannot be empty')
    .datetime({ message: 'Invalid date format (ISO 8601 expected)' })
    .transform((val) => new Date(val))
    .optional(),
});

export const querySchema = z.object({
  status: z.enum(['all', 'active', 'completed']).optional().default('all'),
  search: z.string().trim().optional(),
  sort: z
    .enum(['createdAt_desc', 'createdAt_asc', 'dueDate_asc', 'priority_desc'])
    .optional()
    .default('createdAt_desc'),
});
