import { Router } from 'express';
import { requireTelegramAuth } from '../middleware/requireTelegramAuth';
import { createMatch, getMatches } from '../services/airtable';
import { validatePadelScore } from '../utils/validateScore';

const router = Router();
router.use(requireTelegramAuth);

// GET /matches
router.get('/', async (_req, res) => {
  try {
    const matches = await getMatches();
    res.json({ matches });
  } catch (err: any) {
    console.error('Error fetching matches', err);
    res.status(500).json({ message: 'Failed to fetch matches', error: err.response?.data || err.message });
  }
});

// POST /matches
router.post('/', async (req, res) => {
  try {
    const { pair1Id, pair2Id, scores } = req.body || {};

    if (!pair1Id || !pair2Id) {
      return res.status(400).json({ message: 'pair1Id and pair2Id are required' });
    }

    if (pair1Id === pair2Id) {
      return res.status(400).json({ message: 'You cannot record a match against the same pair' });
    }

    if (!Array.isArray(scores) || !validatePadelScore(scores)) {
      return res.status(400).json({ message: 'Invalid scores format' });
    }

    const match = await createMatch({ pair1Id, pair2Id, scores });
    res.status(201).json({ message: 'Match created', match });
  } catch (err: any) {
    console.error('Error creating match', err);
    res.status(500).json({ message: 'Failed to create match', error: err.response?.data || err.message });
  }
});

export default router;
