import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import githubRoutes from './routes/github.js';
import insightsRoutes from './routes/insights.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/github', githubRoutes);
app.use('/api/insights', insightsRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`DevPulse backend running on port ${PORT}`));
