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

console.log('=== Server Starting ===');
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

// Find frontend path - check many possible locations
const possiblePaths = [
  path.join(__dirname, 'frontend', 'browser'),
  path.join(__dirname, '..', 'frontend', 'browser'),
  path.join(__dirname, '..', '..', 'frontend', 'browser'),
  path.join(process.cwd(), 'frontend', 'browser'),
  path.join(process.cwd(), '..', 'frontend', 'browser'),
  '/opt/render/project/src/frontend/dist/loan-leads-frontend/browser',
  '/opt/render/project/src/backend/dist/frontend/browser',
  path.join(__dirname, '..', '..', 'frontend', 'dist', 'loan-leads-frontend', 'browser'),
];

let frontendPath = '';
for (const p of possiblePaths) {
  console.log('Checking:', p);
  const indexPath = path.join(p, 'index.html');
  if (fs.existsSync(indexPath)) {
    frontendPath = p;
    console.log('FOUND frontend at:', frontendPath);
    break;
  }
}

if (!frontendPath) {
  console.log('ERROR: Frontend not found! Checking parent directories...');
  const parentCheck = path.join(__dirname, '..', '..');
  console.log('Parent contents:', fs.readdirSync(parentCheck));
}

app.use(express.static(frontendPath || path.join(__dirname, 'frontend', 'browser')));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/') || req.path === '/health') {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(frontendPath || path.join(__dirname, 'frontend', 'browser'), 'index.html'));
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;