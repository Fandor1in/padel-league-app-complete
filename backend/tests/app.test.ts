import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../src/app';
import * as airtable from '../src/services/airtable';

vi.mock('../src/services/airtable', () => ({
  getPlayers: vi.fn(),
  createPlayer: vi.fn(),
  getPairs: vi.fn(),
  createPair: vi.fn(),
  getMatches: vi.fn(),
  createMatch: vi.fn(),
}));

const mockGetPlayers = vi.mocked(airtable.getPlayers);
const mockCreatePlayer = vi.mocked(airtable.createPlayer);
const mockGetPairs = vi.mocked(airtable.getPairs);
const mockCreatePair = vi.mocked(airtable.createPair);
const mockGetMatches = vi.mocked(airtable.getMatches);
const mockCreateMatch = vi.mocked(airtable.createMatch);

beforeEach(() => {
  vi.resetAllMocks();
});

describe('players routes', () => {
  it('GET /players returns players from Airtable', async () => {
    mockGetPlayers.mockResolvedValue([{ id: 'rec1' }]);

    const response = await request(app).get('/players');

    expect(response.status).toBe(200);
    expect(response.body.players).toEqual([{ id: 'rec1' }]);
  });

  it('POST /players rejects missing required fields', async () => {
    const response = await request(app).post('/players').send({ name: 'Player One' });

    expect(response.status).toBe(400);
  });

  it('POST /players creates a player with valid payload', async () => {
    mockCreatePlayer.mockResolvedValue({ id: 'rec1' });

    const response = await request(app)
      .post('/players')
      .send({ telegramId: '123', name: 'Player One' });

    expect(response.status).toBe(201);
    expect(mockCreatePlayer).toHaveBeenCalledWith({
      telegramId: '123',
      name: 'Player One',
      username: undefined,
    });
  });
});

describe('pairs routes', () => {
  it('GET /pairs returns pairs from Airtable', async () => {
    mockGetPairs.mockResolvedValue([{ id: 'pair1' }]);

    const response = await request(app).get('/pairs');

    expect(response.status).toBe(200);
    expect(response.body.pairs).toEqual([{ id: 'pair1' }]);
  });

  it('POST /pairs accepts playerIds array', async () => {
    mockCreatePair.mockResolvedValue({ id: 'pair1' });

    const response = await request(app)
      .post('/pairs')
      .send({ playerIds: ['player1', 'player2'] });

    expect(response.status).toBe(201);
    expect(mockCreatePair).toHaveBeenCalledWith({
      player1Id: 'player1',
      player2Id: 'player2',
    });
  });

  it('POST /pairs rejects same player IDs', async () => {
    const response = await request(app)
      .post('/pairs')
      .send({ player1Id: 'player1', player2Id: 'player1' });

    expect(response.status).toBe(400);
    expect(mockCreatePair).not.toHaveBeenCalled();
  });
});

describe('matches routes', () => {
  it('GET /matches returns matches from Airtable', async () => {
    mockGetMatches.mockResolvedValue([{ id: 'match1' }]);

    const response = await request(app).get('/matches');

    expect(response.status).toBe(200);
    expect(response.body.matches).toEqual([{ id: 'match1' }]);
  });

  it('POST /matches rejects invalid scores', async () => {
    const response = await request(app)
      .post('/matches')
      .send({ pair1Id: 'pair1', pair2Id: 'pair2', scores: ['6-4', '7'] });

    expect(response.status).toBe(400);
    expect(mockCreateMatch).not.toHaveBeenCalled();
  });

  it('POST /matches creates a match with valid payload', async () => {
    mockCreateMatch.mockResolvedValue({ id: 'match1' });

    const response = await request(app)
      .post('/matches')
      .send({ pair1Id: 'pair1', pair2Id: 'pair2', scores: ['6-4', '6-4'] });

    expect(response.status).toBe(201);
    expect(mockCreateMatch).toHaveBeenCalledWith({
      pair1Id: 'pair1',
      pair2Id: 'pair2',
      scores: ['6-4', '6-4'],
    });
  });
});
