// server/app.ts
import express from 'express';
import authRoutes from './routes/auth';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); // API base path

export default app;
