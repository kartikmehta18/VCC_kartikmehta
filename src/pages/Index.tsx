
import React from 'react';
import { GameProvider } from '../contexts/GameContext';
import BubblePopGame from '../components/BubblePopGame';

const Index = () => {
  return (
    <GameProvider>
      <BubblePopGame />
    </GameProvider>
  );
};

export default Index;
