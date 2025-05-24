
import React from 'react';
import { Clock, Trophy, Zap } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const GameArena = () => {
  const { gameState, popBubble } = useGame();

  const handleBubbleClick = (bubbleId: string) => {
    // Find the human player (not the computer)
    const humanPlayer = gameState.players.find(p => p.id !== 'computer-player');
    if (humanPlayer) {
      popBubble(bubbleId, humanPlayer.id);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-gray-800/80 rounded-lg px-4 py-2">
            <Clock className="text-blue-400" size={20} />
            <span className="text-white font-mono text-xl">
              {formatTime(gameState.timeRemaining)}
            </span>
          </div>

          {/* Scores */}
          <div className="flex gap-4">
            {gameState.players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-3 bg-gray-800/80 rounded-lg px-4 py-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: player.color }}
                />
                <span className="text-white font-semibold">{player.name}</span>
                <div className="flex items-center gap-1">
                  <Trophy className="text-yellow-400" size={16} />
                  <span className="text-white font-mono text-lg">
                    {player.score}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Game Status */}
          <div className="flex items-center gap-2 bg-green-600/80 rounded-lg px-4 py-2">
            <Zap className="text-white" size={20} />
            <span className="text-white font-semibold">LIVE</span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="pt-20 relative w-full h-screen">
        {/* Bubbles */}
        {gameState.bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute cursor-pointer transition-transform duration-75 hover:scale-110 animate-pulse"
            style={{
              left: bubble.x,
              top: bubble.y,
              width: bubble.size,
              height: bubble.size,
            }}
            onClick={() => handleBubbleClick(bubble.id)}
          >
            <div
              className="w-full h-full rounded-full shadow-lg border-2 border-white/30"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${bubble.color}40, ${bubble.color})`,
                boxShadow: `0 0 20px ${bubble.color}40, inset 0 0 20px rgba(255,255,255,0.3)`,
              }}
            >
              {/* Highlight effect */}
              <div
                className="absolute top-2 left-2 w-3 h-3 bg-white/60 rounded-full blur-sm"
                style={{
                  width: bubble.size * 0.15,
                  height: bubble.size * 0.15,
                }}
              />
            </div>
          </div>
        ))}

        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameArena;
