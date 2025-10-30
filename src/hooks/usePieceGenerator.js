import { useCallback, useState } from 'react';
import { Tetromino } from '../utils/tetromino';

const usePieceGenerator = () => {
  const addPieces = useCallback(() => {
    const pieces = Array.from({ length: 6 }, () => new Tetromino({}));
    return pieces;
  }, []);

  const [nextPieces, setNextPieces] = useState(addPieces());

  const getNextPiece = () => {
    let pieces = [];
    if (nextPieces.length < 6) pieces = addPieces();
    const [firstPiece, ...rest] = nextPieces;
    setNextPieces([...rest, ...pieces]);
    return firstPiece;
  };

  return {
    nextPieces,
    getNextPiece,
  };
};

export default usePieceGenerator;
