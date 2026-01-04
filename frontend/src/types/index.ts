// Shared TypeScript types for the mini app
export interface Player {
  id: string;
  name: string;
  username: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
}

export interface Pair {
  id: string;
  players: [Player, Player];
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
}