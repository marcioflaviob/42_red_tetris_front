import { useState, useCallback } from 'react';

const useGameState = ({ initialLevel = 1, matchId }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(initialLevel);
  const [rowsCleared, setRowsCleared] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [accuracy, setAccuracy] = useState(100);

  const getGameState = useCallback(
    () => ({
      score,
      level,
      rowsCleared,
      gameOver,
      matchId,
      accuracy,
      updatedAt: new Date().toISOString(),
    }),
    [score, level, rowsCleared, gameOver, matchId, accuracy]
  );

  return {
    score,
    setScore,
    level,
    setLevel,
    rowsCleared,
    setRowsCleared,
    setAccuracy,
    gameOver,
    setGameOver,
    getGameState,
    accuracy,
  };
};

export default useGameState;
