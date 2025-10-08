// /api/index.js
import express from 'express';
import cors from 'cors';
import appBackend from '../backend/server.js'; // backend utama kamu

const app = express();
app.use(cors());
app.use(express.json());

// (Opsional) Gunakan semua route dari server utama
app.use(appBackend);

// Tes endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API is working on Vercel!',
    timestamp: new Date().toISOString(),
  });
});

// Export handler agar dikenali oleh Vercel
export default app;
export const config = {
  api: {
    bodyParser: false, // biarkan Express yang handle body parsing
  },
};
