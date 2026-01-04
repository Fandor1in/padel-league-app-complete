import express from 'express';
import bodyParser from 'body-parser';
import playersRouter from './routes/players';
import pairsRouter from './routes/pairs';
import matchesRouter from './routes/matches';

const app = express();

// Parse JSON bodies
app.use(bodyParser.json());

// Mount API routes
app.use('/players', playersRouter);
app.use('/pairs', pairsRouter);
app.use('/matches', matchesRouter);

// Health check endpoint
app.get('/', (_req, res) => {
  res.send('Padel League backend is running');
});

export default app;
