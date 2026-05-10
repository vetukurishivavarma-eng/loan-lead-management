import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.routes';
import leadsRoutes from './routes/leads.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('__dirname:', __dirname);
console.log('cwd:', process.cwd());

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000', 'https://loan-lead-management.onrender.com', 'https://loan-lead-management.netlify.app', process.env.FRONTEND_URL].filter(Boolean) as string[],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Frontend is copied to backend/dist/frontend by build command
// __dirname = backend/dist, so frontend is at __dirname + frontend/browser
const frontendPath = path.join(__dirname, 'frontend', 'browser');
console.log('Frontend path:', frontendPath);
console.log('index.html exists:', fs.existsSync(path.join(frontendPath, 'index.html')));

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/') || req.path === '/health') {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;