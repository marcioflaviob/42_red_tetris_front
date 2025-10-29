import { useCallback, useState } from 'react';
import { getRandom } from '../utils/helper';
import { SHAPES } from '../utils/tetromino';

const usePieceGenerator = () => {
  const addPieces = useCallback(() => {
    const pieces = Array.from({ length: 6 }, () => getRandom(SHAPES));
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
