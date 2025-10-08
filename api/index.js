import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint working'
  });
});

// Catch all
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

export default app;
