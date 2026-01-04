import { Router } from 'express';
import { requireTelegramAuth } from '../middleware/requireTelegramAuth';
import { createPair, getPairs } from '../services/airtable';

const router = Router();
router.use(requireTelegramAuth);

// GET /pairs
router.get('/', async (_req, res) => {
  try {
    const pairs = await getPairs();
    res.json({ pairs });
  } catch (err: any) {
    console.error('Error fetching pairs', err);
    res.status(500).json({ message: 'Failed to fetch pairs', error: err.response?.data || err.message });
  }
});

// POST /pairs
router.post('/', async (req, res) => {
  try {
    const { player1Id, player2Id, playerIds } = req.body || {};
    let resolvedPlayer1Id = player1Id;
    let resolvedPlayer2Id = player2Id;

    if ((!resolvedPlayer1Id || !resolvedPlayer2Id) && Array.isArray(playerIds)) {
      [resolvedPlayer1Id, resolvedPlayer2Id] = playerIds;
    }

    if (!resolvedPlayer1Id || !resolvedPlayer2Id) {
      return res.status(400).json({ message: 'player1Id and player2Id are required' });
    }

    if (resolvedPlayer1Id === resolvedPlayer2Id) {
      return res.status(400).json({ message: 'You cannot create a pair with the same player' });
    }

    const pair = await createPair({ player1Id: resolvedPlayer1Id, player2Id: resolvedPlayer2Id });
    res.status(201).json({ message: 'Pair created', pair });
  } catch (err: any) {
    console.error('Error creating pair', err);
    res.status(500).json({ message: 'Failed to create pair', error: err.response?.data || err.message });
  }
});

export default router;
