import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import todoRoutes from './src/routes/todo.routes.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    // Allow any localhost/127.0.0.1 origin (handles Vite port variations)
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
        .split(',')
        .map((s) => s.trim());
      // Allow requests with no origin (curl, mobile, Postman), localhost, vercel preview, or configured CLIENT_URL
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.onrender.com')
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date() });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/todos', todoRoutes);

// ─── Error handling (must be last) ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Connect DB then start server ────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV}`);
  });
});
