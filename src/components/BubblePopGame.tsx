
import React from 'react';
import { useGame } from '../contexts/GameContext';
import GameLobby from './GameLobby';
import GameArena from './GameArena';
import GameResults from './GameResults';

const BubblePopGame = () => {
  const { gameState } = useGame();

  const renderGameState = () => {
    switch (gameState.gameStatus) {
      case 'waiting':
      case 'ready':
        return <GameLobby />;
      case 'playing':
        return <GameArena />;
      case 'finished':
        return <GameResults />;
      default:
        return <GameLobby />;
    }
  };

  return (
    <div className="relative">
      {renderGameState()}
      
      {/* Floating particles background effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <div
              className="w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
              style={{
                boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BubblePopGame;
