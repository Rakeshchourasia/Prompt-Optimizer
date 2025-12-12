import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import promptRoutes from './routes/prompt.routes.js';
import collectionRoutes from './routes/collection.routes.js';
import workflowRoutes from './routes/workflow.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';
import shareRoutes from './routes/share.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined,
    });
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/prompts', apiLimiter, promptRoutes);
app.use('/api/collections', apiLimiter, collectionRoutes);
app.use('/api/workflows', apiLimiter, workflowRoutes);
app.use('/api/workspaces', apiLimiter, workspaceRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
