import axios from 'axios';
import {
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID,
  AIRTABLE_MATCHES_TABLE,
  AIRTABLE_MATCH_PAIR1_FIELD,
  AIRTABLE_MATCH_PAIR2_FIELD,
  AIRTABLE_MATCH_SCORES_FIELD,
  AIRTABLE_PAIRS_TABLE,
  AIRTABLE_PAIR_PLAYER1_FIELD,
  AIRTABLE_PAIR_PLAYER2_FIELD,
  AIRTABLE_PLAYERS_TABLE,
} from '../config';

/**
 * Airtable configuration
 * The API uses a base ID and table names to construct endpoints.  This helper
 * centralises the base URL and headers so that functions below can be concise.
 */
const airtableBaseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

const defaultHeaders = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

const PLAYERS_TABLE = AIRTABLE_PLAYERS_TABLE;
const PAIRS_TABLE = AIRTABLE_PAIRS_TABLE;
const MATCHES_TABLE = AIRTABLE_MATCHES_TABLE;

export interface PlayerInput {
  telegramId: string;
  name: string;
  username?: string;
}

export interface PairInput {
  player1Id: string;
  player2Id: string;
}

export interface MatchInput {
  pair1Id: string;
  pair2Id: string;
  scores: string[];
}

const ensureAirtableConfig = () => {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable configuration is missing');
  }
};

/**
 * Retrieve all players from the Airtable `Players` table.
 * Returns raw Airtable record objects. You can map these to your own shape on
 * the caller side if needed.
 */
export const getPlayers = async () => {
  ensureAirtableConfig();
  const url = `${airtableBaseUrl}/${PLAYERS_TABLE}`;
  const response = await axios.get(url, { headers: defaultHeaders });
  return response.data.records;
};

/**
 * Create a new player in the Airtable `Players` table. Accepts an object with
 * Telegram identifiers and names. Additional numeric/statistical fields are
 * initialised to zero so the front‑end can display default values immediately.
 *
 * @param player – the player details extracted from Telegram
 */
export const createPlayer = async (player: PlayerInput) => {
  ensureAirtableConfig();
  const url = `${airtableBaseUrl}/${PLAYERS_TABLE}`;
  const data = {
    records: [
      {
        fields: {
          'Telegram ID': player.telegramId,
          Name: player.name,
          'Telegram Username': player.username || '',
          'Games Played': 0,
          'Individual Rating': 0,
          Wins: 0,
          Losses: 0,
        },
      },
    ],
  };
  const response = await axios.post(url, data, { headers: defaultHeaders });
  return response.data;
};

/**
 * Retrieve all pairs from the Airtable `Pairs` table.
 */
export const getPairs = async () => {
  ensureAirtableConfig();
  const url = `${airtableBaseUrl}/${PAIRS_TABLE}`;
  const response = await axios.get(url, { headers: defaultHeaders });
  return response.data.records;
};

/**
 * Create a new pair in the Airtable `Pairs` table.
 */
export const createPair = async (pair: PairInput) => {
  ensureAirtableConfig();
  const url = `${airtableBaseUrl}/${PAIRS_TABLE}`;
  const data = {
    records: [
      {
        fields: {
          [AIRTABLE_PAIR_PLAYER1_FIELD]: [pair.player1Id],
          [AIRTABLE_PAIR_PLAYER2_FIELD]: [pair.player2Id],
        },
      },
    ],
  };
  const response = await axios.post(url, data, { headers: defaultHeaders });
  return response.data;
};

/**
 * Retrieve all matches from the Airtable `Matches` table.
 */
export const getMatches = async () => {
  ensureAirtableConfig();
  const url = `${airtableBaseUrl}/${MATCHES_TABLE}`;
  const response = await axios.get(url, { headers: defaultHeaders });
  return response.data.records;
};

/**
 * Create a new match in the Airtable `Matches` table.
 */
export const createMatch = async (match: MatchInput) => {
  ensureAirtableConfig();
  const url = `${airtableBaseUrl}/${MATCHES_TABLE}`;
  const data = {
    records: [
      {
        fields: {
          [AIRTABLE_MATCH_PAIR1_FIELD]: [match.pair1Id],
          [AIRTABLE_MATCH_PAIR2_FIELD]: [match.pair2Id],
          [AIRTABLE_MATCH_SCORES_FIELD]: match.scores.join(', '),
        },
      },
    ],
  };
  const response = await axios.post(url, data, { headers: defaultHeaders });
  return response.data;
};
