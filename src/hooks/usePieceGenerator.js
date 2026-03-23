import { useCallback, useEffect, useRef, useState } from 'react';
import seedrandom from 'seedrandom';
import { PieceBag, Tetromino } from '../utils/tetromino';

const usePieceGenerator = (startGame, seed) => {
  const rngRef = useRef(null);
  const colorRngRef = useRef(null);
  const colorBagRef = useRef(null);
  const pieceCountRef = useRef(0);
  const nextPiecesLengthRef = useRef(0);
  const [nextPieces, setNextPieces] = useState([]);

  const addPieces = useCallback(() => {
    if (!rngRef.current || !colorBagRef.current || nextPiecesLengthRef.current >= 6) return [];
    const pieces = Array.from({ length: 6 }, () => {
      pieceCountRef.current += 1;
      return new Tetromino({
        rng: rngRef.current,
        colorRng: colorRngRef.current,
        colorBag: colorBagRef.current,
      });
    });
    return pieces;
  }, []);

  useEffect(() => {
    if (seed && !rngRef.current) {
      colorBagRef.current = new PieceBag();
      rngRef.current = seedrandom(seed);
      colorRngRef.current = seedrandom(seed + '-color');
      setNextPieces(addPieces);
      nextPiecesLengthRef.current = 6;
      console.log('Next pieces initially set to 6', nextPiecesLengthRef.current);
    }
  }, [seed, addPieces, startGame]);

  const getNextPiece = () => {
    let pieces = [];
    console.log('herere');
    if (nextPiecesLengthRef.current < 6) {
      console.log('Next pieces is below 6, adding it', nextPiecesLengthRef.current);
      pieces = addPieces();
    }
    const [firstPiece, ...rest] = nextPieces;
    nextPiecesLengthRef.current = [...rest, ...pieces].length;
    setNextPieces([...rest, ...pieces]);
    return firstPiece;
  };

  return {
    nextPieces,
    getNextPiece,
  };
};

export default usePieceGenerator;
