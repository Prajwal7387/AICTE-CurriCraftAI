import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import curriculumRoutes from './routes/curriculum.routes';
import aiRoutes from './routes/ai.routes';
import nepRoutes from './routes/nep.routes';
import versionRoutes from './routes/version.routes';
import reviewRoutes from './routes/review.routes';
import commentRoutes from './routes/comment.routes';
import analyticsRoutes from './routes/analytics.routes';
import resourceRoutes from './routes/resource.routes';

const app = express();
const server = http.createServer(app);

// Initialize Socket.io (no external Redis/server needed)
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, error: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);

// Socket.io Real-time Event Listener
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join_curriculum_room', (curriculumId: string) => {
    socket.join(`curriculum_${curriculumId}`);
    console.log(`[Socket.io] Socket ${socket.id} joined room curriculum_${curriculumId}`);
  });

  socket.on('send_live_comment', (data: { curriculumId: string; comment: any }) => {
    io.to(`curriculum_${data.curriculumId}`).emit('receive_live_comment', data.comment);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Attach Socket.io to Express App
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/curricula', curriculumRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/nep', nepRoutes);
app.use('/api/versions', versionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/resources', resourceRoutes);

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'CurriCraft AI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start Server & DB Connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 CurriCraft AI Server running on port ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`==================================================`);
  });
};

startServer();
