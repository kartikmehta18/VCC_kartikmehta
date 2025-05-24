
import React from 'react';
import { Trophy, Medal, RotateCcw, Home } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const GameResults = () => {
  const { gameState, resetGame } = useGame();
  const { winner, players } = gameState;

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Winner Announcement */}
        <div className="text-center mb-12">
          <div className="relative">
            <Trophy className="mx-auto text-yellow-400 mb-4" size={80} />
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl" />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-2">
            Game Over!
          </h1>
          
          {winner && (
            <div className="text-center">
              <p className="text-gray-300 text-xl mb-2">Winner:</p>
              <p
                className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
              >
                {winner.name}
              </p>
              <p className="text-gray-300 text-lg">
                with {winner.score} points!
              </p>
            </div>
          )}
        </div>

        {/* Final Scores */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Final Scores
            </h2>
            
            <div className="space-y-4">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border border-yellow-500/50'
                      : 'bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {index === 0 ? (
                        <Trophy className="text-yellow-400" size={24} />
                      ) : (
                        <Medal className="text-gray-400" size={24} />
                      )}
                      <span className="text-2xl font-bold text-white">
                        #{index + 1}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                      <span className="text-white text-xl font-semibold">
                        {player.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {player.score}
                    </div>
                    <div className="text-gray-400 text-sm">
                      points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Game Stats */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Match Statistics
            </h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-400">
                  {players.reduce((sum, p) => sum + p.score, 0)}
                </div>
                <div className="text-gray-300 text-sm">Total Bubbles</div>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">
                  60s
                </div>
                <div className="text-gray-300 text-sm">Game Duration</div>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-400">
                  {Math.max(...players.map(p => p.score))}
                </div>
                <div className="text-gray-300 text-sm">High Score</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={resetGame}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
          >
            <RotateCcw className="mr-2" size={20} />
            Play Again
          </Button>
          
          <Button
            onClick={resetGame}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8 py-3"
          >
            <Home className="mr-2" size={20} />
            New Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameResults;
