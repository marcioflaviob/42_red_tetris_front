import { useState } from 'react';

const useDifficultySelector = () => {
  const [invisiblePieces, setInvisiblePieces] = useState(false);
  const [increasedGravity, setIncreasedGravity] = useState(false);
  const [piecePrediction, setPiecePrediction] = useState(true);

  const getDifficulty = () => {
    const activeOptions = [
      invisiblePieces,
      increasedGravity,
      !piecePrediction,
    ].filter(Boolean).length;

    switch (activeOptions) {
      case 0:
        return { level: 'Normal', progress: 33, color: 'normal' };
      case 1:
        return { level: 'Medium', progress: 66, color: 'medium' };
      case 2:
      case 3:
        return { level: 'Hard', progress: 100, color: 'hard' };
      default:
        return { level: 'Normal', progress: 33, color: 'normal' };
    }
  };

  return {
    difficulty: getDifficulty(),
    invisiblePieces,
    setInvisiblePieces,
    increasedGravity,
    setIncreasedGravity,
    piecePrediction,
    setPiecePrediction,
  };
};

export default useDifficultySelector;
