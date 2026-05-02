import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import categoryRoutes       from './routes/categoryRoutes';
import productRoutes         from './routes/productRoutes';
import authRoutes            from './routes/authRoutes';
import adminRoutes           from './routes/adminRoutes';
import configurationRoutes   from './routes/configurationRoutes';
import { errorHandler }      from './middleware/errorHandler';

export const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ── Public routes ─────────────────────────────────────────────────────────────
app.use('/api/categories',    categoryRoutes);
app.use('/api/products',      productRoutes);
app.use('/api/auth',          authRoutes);
app.use('/api/configuration', configurationRoutes);

// ── Admin routes (all require JWT — handled inside adminRoutes) ───────────────
app.use('/api/admin', adminRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server only when running locally (not in Lambda) ───────────────────
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => {
    console.log(`✓ Server running at http://localhost:${PORT}`);
  });
}
