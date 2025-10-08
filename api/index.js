// /api/index.js
import express from 'express';
import cors from 'cors';
import appBackend from '../backend/server.js'; // opsional: kalau kamu mau rute ke backend utama

const app = express();
app.use(cors());
app.use(express.json());

// endpoint tes
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString(),
  });
});

export default app;
