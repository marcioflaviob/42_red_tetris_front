import { useState, useCallback } from 'react';

const useGameState = ({ initialLevel = 1, matchId }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(initialLevel);
  const [rowsCleared, setRowsCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const getGameState = useCallback(
    () => ({
      score,
      level,
      rowsCleared,
      gameOver,
      matchId,
      updatedAt: new Date().toISOString(),
    }),
    [score, level, rowsCleared, gameOver, matchId]
  );

  return {
    score,
    setScore,
    level,
    setLevel,
    rowsCleared,
    setRowsCleared,
    gameOver,
    setGameOver,
    getGameState,
  };
};

export default useGameState;
