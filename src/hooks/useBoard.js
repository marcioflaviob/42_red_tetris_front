import { useCallback, useEffect, useRef, useState } from 'react';
import { BOARD_COLS, BOARD_ROWS, BUFFER_ZONE_ROWS } from '../utils/constants';

const useBoard = () => {
  const [board, setBoardState] = useState(new Array(BUFFER_ZONE_ROWS * BOARD_COLS + BOARD_ROWS * BOARD_COLS).fill(0));
  const boardRef = useRef(board);
  const [activePiece, setActivePieceState] = useState(null);
  const activePieceRef = useRef(activePiece);
  const [savedPiece, setSavedPieceState] = useState({
    tetromino: null,
    disabled: false,
  });
  const savedPieceRef = useRef({ tetromino: null, disabled: false });

  const setSavedPiece = useCallback((next) => {
    if (typeof next === 'function') {
      setSavedPieceState((prev) => {
        const resolved = next(prev);
        savedPieceRef.current = resolved;
        return resolved;
      });
      return;
    }
    savedPieceRef.current = next;
    setSavedPieceState(next);
  }, []);

  const setBoard = useCallback((nextBoard) => {
    if (typeof nextBoard === 'function') {
      setBoardState((prevBoard) => {
        const resolvedBoard = nextBoard(prevBoard);
        boardRef.current = resolvedBoard;
        return resolvedBoard;
      });
      return;
    }

    boardRef.current = nextBoard;
    setBoardState(nextBoard);
  }, []);

  const setActivePiece = useCallback((nextPiece) => {
    if (typeof nextPiece === 'function') {
      setActivePieceState((prevPiece) => {
        const resolvedPiece = nextPiece(prevPiece);
        activePieceRef.current = resolvedPiece;
        return resolvedPiece;
      });
      return;
    }

    activePieceRef.current = nextPiece;
    setActivePieceState(nextPiece);
  }, []);

  useEffect(() => {
    if (activePiece) activePieceRef.current = activePiece;
  }, [activePiece]);

  useEffect(() => {
    if (board) boardRef.current = board;
  }, [board]);

  return {
    board,
    boardRef,
    setBoard,
    activePiece,
    activePieceRef,
    setActivePiece,
    savedPiece,
    savedPieceRef,
    setSavedPiece,
  };
};

export default useBoard;
