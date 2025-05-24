
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GameState, Player, Bubble } from '../types/game';

interface GameContextType {
  gameState: GameState;
  joinGame: (playerName: string) => void;
  toggleReady: () => void;
  startGame: () => void;
  popBubble: (bubbleId: string, playerId: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

const initialState: GameState = {
  players: [
    {
      id: 'computer-player',
      name: 'Computer AI',
      score: 0,
      isReady: true,
      color: '#ef4444',
    }
  ],
  bubbles: [],
  gameStatus: 'waiting',
  timeRemaining: 60,
  winner: null,
  roomCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
};

type GameAction = 
  | { type: 'JOIN_GAME'; payload: { playerName: string } }
  | { type: 'TOGGLE_READY'; payload: { playerId: string } }
  | { type: 'START_GAME' }
  | { type: 'POP_BUBBLE'; payload: { bubbleId: string; playerId: string } }
  | { type: 'UPDATE_TIMER'; payload: { timeRemaining: number } }
  | { type: 'ADD_BUBBLE'; payload: { bubble: Bubble } }
  | { type: 'UPDATE_BUBBLES'; payload: { bubbles: Bubble[] } }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'JOIN_GAME':
      if (state.players.length >= 2) return state;
      const newPlayer: Player = {
        id: Math.random().toString(36).substring(2, 9),
        name: action.payload.playerName,
        score: 0,
        isReady: false,
        color: '#3b82f6',
      };
      return {
        ...state,
        players: [...state.players, newPlayer],
        gameStatus: state.players.length === 1 ? 'ready' : 'waiting',
      };

    case 'TOGGLE_READY':
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload.playerId
            ? { ...player, isReady: !player.isReady }
            : player
        ),
      };

    case 'START_GAME':
      if (state.players.length === 2 && state.players.every(p => p.isReady)) {
        return {
          ...state,
          gameStatus: 'playing',
          timeRemaining: 60,
          players: state.players.map(p => ({ ...p, score: 0 })),
        };
      }
      return state;

    case 'POP_BUBBLE':
      return {
        ...state,
        bubbles: state.bubbles.filter(bubble => bubble.id !== action.payload.bubbleId),
        players: state.players.map(player =>
          player.id === action.payload.playerId
            ? { ...player, score: player.score + 10 }
            : player
        ),
      };

    case 'UPDATE_TIMER':
      if (action.payload.timeRemaining <= 0) {
        const winner = state.players.reduce((prev, current) =>
          prev.score > current.score ? prev : current
        );
        return {
          ...state,
          timeRemaining: 0,
          gameStatus: 'finished',
          winner,
        };
      }
      return {
        ...state,
        timeRemaining: action.payload.timeRemaining,
      };

    case 'ADD_BUBBLE':
      return {
        ...state,
        bubbles: [...state.bubbles, action.payload.bubble],
      };

    case 'UPDATE_BUBBLES':
      return {
        ...state,
        bubbles: action.payload.bubbles,
      };

    case 'END_GAME':
      const gameWinner = state.players.reduce((prev, current) =>
        prev.score > current.score ? prev : current
      );
      return {
        ...state,
        gameStatus: 'finished',
        winner: gameWinner,
      };

    case 'RESET_GAME':
      return {
        ...initialState,
        roomCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      };

    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const joinGame = useCallback((playerName: string) => {
    dispatch({ type: 'JOIN_GAME', payload: { playerName } });
  }, []);

  const toggleReady = useCallback(() => {
    const humanPlayer = gameState.players.find(p => p.id !== 'computer-player');
    if (humanPlayer) {
      dispatch({ type: 'TOGGLE_READY', payload: { playerId: humanPlayer.id } });
    }
  }, [gameState.players]);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const popBubble = useCallback((bubbleId: string, playerId: string) => {
    console.log(`Player ${playerId} popped bubble ${bubbleId}`);
    dispatch({ type: 'POP_BUBBLE', payload: { bubbleId, playerId } });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  // Enhanced Computer AI - more competitive bubble popping
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.bubbles.length > 0) {
      const computerPlayer = gameState.players.find(p => p.id === 'computer-player');
      if (computerPlayer) {
        // Computer AI with variable reaction time (0.5-1.5 seconds)
        const reactionTime = Math.random() * 1000 + 500;
        
        const timeout = setTimeout(() => {
          const availableBubbles = gameState.bubbles;
          if (availableBubbles.length > 0) {
            // Computer prefers larger bubbles (worth more points)
            const sortedBubbles = availableBubbles.sort((a, b) => b.size - a.size);
            const targetBubble = sortedBubbles[0]; // Go for the largest bubble
            
            console.log(`Computer AI targeting bubble ${targetBubble.id} with size ${targetBubble.size}`);
            popBubble(targetBubble.id, 'computer-player');
          }
        }, reactionTime);

        return () => clearTimeout(timeout);
      }
    }
  }, [gameState.gameStatus, gameState.bubbles, gameState.players, popBubble]);

  // Game timer
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.timeRemaining > 0) {
      const timer = setInterval(() => {
        dispatch({
          type: 'UPDATE_TIMER',
          payload: { timeRemaining: gameState.timeRemaining - 1 },
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.gameStatus, gameState.timeRemaining]);

  // Enhanced bubble spawning - more bubbles for competitive gameplay
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      const spawnBubble = () => {
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316'];
        const bubble: Bubble = {
          id: Math.random().toString(36).substring(2, 9),
          x: Math.random() * (window.innerWidth - 100) + 50,
          y: Math.random() * (window.innerHeight - 300) + 150,
          size: Math.random() * 40 + 30, // Bubbles between 30-70px
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 2 + 1,
          direction: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
          },
        };
        console.log(`Spawned bubble ${bubble.id} at position (${bubble.x}, ${bubble.y})`);
        dispatch({ type: 'ADD_BUBBLE', payload: { bubble } });
      };

      // Spawn bubbles every 600ms for more action
      const spawnInterval = setInterval(spawnBubble, 600);
      return () => clearInterval(spawnInterval);
    }
  }, [gameState.gameStatus]);

  // Bubble movement with enhanced physics
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      const moveBubbles = () => {
        const updatedBubbles = gameState.bubbles.map(bubble => {
          let newX = bubble.x + bubble.direction.x * bubble.speed;
          let newY = bubble.y + bubble.direction.y * bubble.speed;
          let newDirection = { ...bubble.direction };

          // Bounce off walls
          if (newX <= 0 || newX >= window.innerWidth - bubble.size) {
            newDirection.x *= -1;
            newX = Math.max(0, Math.min(window.innerWidth - bubble.size, newX));
          }
          if (newY <= 100 || newY >= window.innerHeight - bubble.size) {
            newDirection.y *= -1;
            newY = Math.max(100, Math.min(window.innerHeight - bubble.size, newY));
          }

          return {
            ...bubble,
            x: newX,
            y: newY,
            direction: newDirection,
          };
        });

        dispatch({ type: 'UPDATE_BUBBLES', payload: { bubbles: updatedBubbles } });
      };

      const moveInterval = setInterval(moveBubbles, 16); // 60 FPS
      return () => clearInterval(moveInterval);
    }
  }, [gameState.bubbles, gameState.gameStatus]);

  return (
    <GameContext.Provider value={{
      gameState,
      joinGame,
      toggleReady,
      startGame,
      popBubble,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
