import { ZodError } from 'zod';

/**
 * Factory: returns an Express middleware that validates the request body
 * against the given Zod schema.
 */
export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    next(err);
  }
};

/**
 * Factory: validates req.query against the given Zod schema.
 * NOTE: req.query is a read-only getter in Express 5+, so we cannot
 * reassign it. Instead, we mutate its properties in-place via Object.assign
 * and store the full parsed result on req.parsedQuery for safe access.
 */
export const validateQuery = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.query);
    // Mutate in-place (safe) rather than reassigning the getter
    Object.assign(req.query, parsed);
    // Also expose on req.parsedQuery for unambiguous controller access
    req.parsedQuery = parsed;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    next(err);
  }
};
