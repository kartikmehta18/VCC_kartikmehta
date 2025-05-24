
import React, { useState } from 'react';
import { Users, Play, Copy, Check, Bot } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const GameLobby = () => {
  const { gameState, joinGame, toggleReady, startGame } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [copied, setCopied] = useState(false);

  const handleJoinGame = () => {
    if (playerName.trim()) {
      joinGame(playerName.trim());
      setPlayerName('');
    }
  };

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(gameState.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const humanPlayer = gameState.players.find(p => p.id !== 'computer-player');
  const canStartGame = gameState.players.length === 2 && 
                      gameState.players.every(p => p.isReady);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Bubble Pop Arena
          </h1>
          <p className="text-gray-300 text-xl">
            Fast-paced multiplayer bubble popping action vs Computer
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Room Info */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="text-blue-400" />
                Game Room
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                  <span className="text-gray-300">Room Code:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-lg">
                      {gameState.roomCode}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyRoomCode}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-white font-semibold">Players ({gameState.players.length}/2)</h3>
                  {gameState.players.map((player, index) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        {player.id === 'computer-player' && (
                          <Bot className="text-red-400" size={16} />
                        )}
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="text-white">{player.name}</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          player.isReady
                            ? 'bg-green-600 text-green-100'
                            : 'bg-yellow-600 text-yellow-100'
                        }`}
                      >
                        {player.isReady ? 'Ready' : 'Not Ready'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Join Game */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Join the Battle vs Computer
              </h2>
              
              {!humanPlayer ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Your Name
                    </label>
                    <Input
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-gray-700 border-gray-600 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && handleJoinGame()}
                    />
                  </div>
                  <Button
                    onClick={handleJoinGame}
                    disabled={!playerName.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Join Game vs Computer
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-green-400 text-xl font-semibold mb-2">
                      Ready to Battle!
                    </div>
                    <p className="text-gray-300">
                      You're about to face the Computer AI. Get ready!
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={toggleReady}
                      variant="outline"
                      className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                    >
                      {humanPlayer.isReady ? 'Cancel Ready' : 'Ready Up'}
                    </Button>

                    <Button
                      onClick={startGame}
                      disabled={!canStartGame}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                    >
                      <Play className="mr-2" size={16} />
                      Start Game
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Game Rules</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• 60 seconds to pop as many bubbles as possible</li>
                  <li>• Each bubble = 10 points</li>
                  <li>• Beat the Computer AI to win!</li>
                  <li>• Click bubbles to pop them</li>
                  <li>• Computer will compete against you</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
