
export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
  color: string;
}

export interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  direction: { x: number; y: number };
}

export interface GameState {
  players: Player[];
  bubbles: Bubble[];
  gameStatus: 'waiting' | 'ready' | 'playing' | 'finished';
  timeRemaining: number;
  winner: Player | null;
  roomCode: string;
}
