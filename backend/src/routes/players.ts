import { Router } from 'express';
import { getPlayers, createPlayer } from '../services/airtable';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from '../config';
import axios from 'axios';

const router = Router();

// GET /players – returns a list of player records from Airtable
router.get('/', async (_req, res) => {
  try {
    const players = await getPlayers();
    res.json({ players });
  } catch (err) {
    console.error('Error fetching players', err);
    res.status(500).json({ message: 'Failed to fetch players' });
  }
});

// POST /players – create a new player in Airtable
router.post('/', async (req, res) => {
  const { telegramId, name, username } = req.body;
  if (!telegramId || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const record = await createPlayer({ telegramId, name, username });
    res.status(201).json({ message: 'Player created', record });
  } catch (err) {
    console.error('Error creating player', err);
    res.status(500).json({ message: 'Failed to create player' });
  }
});

// Temporary route for testing Airtable connectivity
router.get('/test', async (_req, res) => {
  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return res.status(500).json({ error: 'Airtable configuration is missing' });
    }
    const response = await axios.get(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Players?maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      },
    );
    res.json(response.data);
  } catch (err: any) {
    console.error('Error testing Airtable connection', err);
    res.status(500).json({
      error: err.response?.data || err.message || 'Unknown error',
    });
  }
});


export default router;
