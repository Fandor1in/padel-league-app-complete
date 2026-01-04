import dotenv from 'dotenv';

// Load .env before reading environment variables.
dotenv.config();

// Configuration and environment variables
export const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
export const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';
export const AIRTABLE_PLAYERS_TABLE =
  process.env.AIRTABLE_PLAYERS_TABLE || 'Players';
export const AIRTABLE_PAIRS_TABLE = process.env.AIRTABLE_PAIRS_TABLE || 'Pairs';
export const AIRTABLE_MATCHES_TABLE =
  process.env.AIRTABLE_MATCHES_TABLE || 'Matches';
export const AIRTABLE_PAIR_PLAYER1_FIELD =
  process.env.AIRTABLE_PAIR_PLAYER1_FIELD || 'Player 1';
export const AIRTABLE_PAIR_PLAYER2_FIELD =
  process.env.AIRTABLE_PAIR_PLAYER2_FIELD || 'Player 2';
export const AIRTABLE_MATCH_PAIR1_FIELD =
  process.env.AIRTABLE_MATCH_PAIR1_FIELD || 'Pair 1';
export const AIRTABLE_MATCH_PAIR2_FIELD =
  process.env.AIRTABLE_MATCH_PAIR2_FIELD || 'Pair 2';
export const AIRTABLE_MATCH_SCORES_FIELD =
  process.env.AIRTABLE_MATCH_SCORES_FIELD || 'Scores';
