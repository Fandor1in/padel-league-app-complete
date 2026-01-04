import { Router } from 'express';
import { getPlayers, createPlayer } from '../services/airtable';
import {
  ALLOW_UNVERIFIED_TELEGRAM,
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID,
  AIRTABLE_PLAYERS_TABLE,
} from '../config';
import axios from 'axios';
import { requireTelegramAuth, TelegramRequest } from '../middleware/requireTelegramAuth';

const router = Router();
router.use(requireTelegramAuth);
const REQUIRED_PLAYER_FIELDS = [
  'Telegram ID',
  'Name',
  'Telegram Username',
  'Games Played',
  'Individual Rating',
  'Wins',
  'Losses',
];

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
router.post('/', async (req: TelegramRequest, res) => {
  const { telegramId, name, username } = req.body || {};
  const parsedTelegramId =
    typeof telegramId === 'number' ? telegramId : Number(telegramId);
  try {
    if (req.telegramUser) {
      const resolvedName =
        `${req.telegramUser.first_name || ''} ${req.telegramUser.last_name || ''}`.trim() ||
        req.telegramUser.username ||
        'Telegram User';
      const record = await createPlayer({
        telegramId: req.telegramUser.id,
        name: resolvedName,
        username: req.telegramUser.username,
      });
      return res.status(201).json({ message: 'Player created', record });
    }

    if (!ALLOW_UNVERIFIED_TELEGRAM) {
      return res.status(401).json({ message: 'Telegram initData is required' });
    }

    if (!Number.isFinite(parsedTelegramId) || !name) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const record = await createPlayer({
      telegramId: parsedTelegramId,
      name,
      username,
    });
    res.status(201).json({ message: 'Player created', record });
  } catch (err) {
    console.error('Error creating player', err);
    res.status(500).json({
      message: 'Failed to create player',
      error: (err as any)?.response?.data || (err as Error).message || 'Unknown error',
    });
  }
});

// GET /players/health – checks Airtable connectivity and schema
router.get('/health', async (_req, res) => {
  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return res.status(500).json({ ok: false, error: 'Airtable configuration is missing' });
    }
    const response = await axios.get(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PLAYERS_TABLE}?maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      },
    );
    const records = response.data?.records || [];
    if (records.length === 0) {
      return res.json({
        ok: true,
        table: AIRTABLE_PLAYERS_TABLE,
        warnings: ['No records found to validate schema'],
      });
    }
    const fields = records[0]?.fields || {};
    const missingFields = REQUIRED_PLAYER_FIELDS.filter((field) => !(field in fields));
    return res.json({
      ok: missingFields.length === 0,
      table: AIRTABLE_PLAYERS_TABLE,
      missingFields,
    });
  } catch (err: any) {
    console.error('Error checking Airtable health', err);
    res.status(500).json({
      ok: false,
      error: err.response?.data || err.message || 'Unknown error',
    });
  }
});

// Temporary route for testing Airtable connectivity
router.get('/test', async (_req, res) => {
  try {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return res.status(500).json({ error: 'Airtable configuration is missing' });
    }
    const response = await axios.get(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_PLAYERS_TABLE}?maxRecords=1`,
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
