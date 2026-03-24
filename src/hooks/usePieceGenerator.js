import { useCallback, useEffect, useRef, useState } from 'react';
import seedrandom from 'seedrandom';
import { PieceBag, Tetromino } from '../utils/tetromino';

const usePieceGenerator = (startGame, seed) => {
  const rngRef = useRef(null);
  const colorRngRef = useRef(null);
  const colorBagRef = useRef(null);
  const pieceCountRef = useRef(0);
  // Keep a ref that always mirrors the latest nextPieces so getNextPiece
  // doesn't close over a stale state snapshot.
  const nextPiecesRef = useRef([]);
  const [nextPieces, setNextPieces] = useState([]);

  const addPieces = useCallback(() => {
    if (!rngRef.current || !colorBagRef.current) return [];
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
      const initial = addPieces();
      nextPiecesRef.current = initial;
      setNextPieces(initial);
    }
  }, [seed, addPieces, startGame]);

  // Stable callback — reads from the ref so it never captures a stale state snapshot.
  const getNextPiece = useCallback(() => {
    const current = nextPiecesRef.current;
    const [firstPiece, ...rest] = current;
    const refilled = rest.length < 6 ? [...rest, ...addPieces()] : rest;
    nextPiecesRef.current = refilled;
    setNextPieces(refilled);
    return firstPiece;
  }, [addPieces]);

  return {
    nextPieces,
    getNextPiece,
  };
};

export default usePieceGenerator;
