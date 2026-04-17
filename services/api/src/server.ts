import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.routes';
import { mapRouter } from './routes/map.routes';
import { queueRouter } from './routes/queue.routes';
import { orderRouter } from './routes/orders.routes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'stadiumiq-api', version: '1.0.0' });
});

// Routers
app.use('/api/auth', authRouter);
app.use('/api/venues', mapRouter);
app.use('/api/queue', queueRouter);
app.use('/api/orders', orderRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 StadiumIQ API Server running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(` - GET  /health`);
  console.log(` - POST /api/auth/login`);
  console.log(` - GET  /api/auth/me`);
  console.log(` - GET  /api/venues/:id/map`);
  console.log(` - POST /api/venues/:id/route`);
  console.log(` - GET  /api/venues/:id/heatmap`);
  console.log(` - POST /api/queue/join`);
  console.log(` - GET  /api/queue/status`);
  console.log(` - GET  /api/orders/menu/:venue_id`);
  console.log(` - POST /api/orders`);
  console.log(` - GET  /api/orders/:id`);
});
