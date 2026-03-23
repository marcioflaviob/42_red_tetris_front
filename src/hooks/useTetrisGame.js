import { useState, useCallback, useEffect } from 'react';
import { BOARD_COLS } from '../utils/constants';
import { hasCollided } from '../utils/helper';
import useBoard from './useBoard';
import useRotation from './useRotation';
import useMovement from './useMovement';
import useGameLoop from './useGameLoop';
import usePieceGenerator from './usePieceGenerator';
import { Tetromino } from '../utils/tetromino';

const useTetrisGame = ({ player, level, startGame, matchData, onPieceLocked, onGameStateChange, emit }) => {
  const [gameOver, setGameOver] = useState(false);

  const { board, boardRef, setBoard, activePiece, activePieceRef, setActivePiece, savedPiece, setSavedPiece } =
    useBoard();

  const { nextPieces, getNextPiece } = usePieceGenerator(startGame, matchData?.id);

  const rotatePiece = useRotation({ hasCollided, boardRef });

  const { movePiece } = useMovement({
    boardRef,
    activePieceRef,
    setActivePiece,
    rotatePiece,
  });

  const updateBoard = useCallback(
    (coords, color) => {
      setBoard((prev) => {
        const newBoard = [...prev];
        coords.forEach(([row, col]) => {
          newBoard[row * BOARD_COLS + col] = color;
        });
        return newBoard;
      });
    },
    [setBoard]
  );

  const spawnTetromino = useCallback(
    (tetromino) => {
      setActivePiece(tetromino);
    },
    [setActivePiece]
  );

  const lockPiece = useCallback(() => {
    const piece = activePieceRef?.current;
    if (!piece) return;

    const coords = piece.getPredictCoords(boardRef.current);
    updateBoard(coords, piece.color);
    setActivePiece(null);

    if (coords.some(([r]) => r === 0)) {
      setGameOver(true);
      return;
    }

    if (savedPiece.disabled) {
      setSavedPiece({ ...savedPiece, disabled: false });
    }

    const nextPiece = getNextPiece();
    spawnTetromino(nextPiece);

    if (onPieceLocked) {
      onPieceLocked({
        board: boardRef.current,
        nextPieces,
        savedPiece,
      });
    }
  }, [
    activePieceRef,
    boardRef,
    updateBoard,
    setActivePiece,
    savedPiece,
    getNextPiece,
    spawnTetromino,
    nextPieces,
    onPieceLocked,
  ]);

  const updateSavedPiece = () => {
    if (savedPiece.disabled) return;

    setSavedPiece({ tetromino: activePiece, disabled: true });
    if (savedPiece.tetromino) {
      spawnTetromino(
        new Tetromino({
          shape: savedPiece?.tetromino?.shape,
          color: savedPiece?.tetromino?.color,
        })
      );
    } else {
      spawnTetromino(getNextPiece());
    }
  };

  const lastDrop = useGameLoop(
    () => {},
    player,
    movePiece,
    lockPiece,
    updateSavedPiece,
    startGame,
    gameOver,
    level,
    matchData?.increasedGravity,
    emit
  );

  useEffect(() => {
    if (onGameStateChange) {
      onGameStateChange({
        board,
        activePiece,
        nextPieces,
        savedPiece,
        gameOver,
      });
    }
  }, [board, activePiece, nextPieces, savedPiece, gameOver, onGameStateChange]);

  const getFullGameState = useCallback(
    () => ({
      board,
      activePiece,
      nextPieces,
      savedPiece,
      gameOver,
    }),
    [board, activePiece, nextPieces, savedPiece, gameOver]
  );

  return {
    board,
    boardRef,
    setBoard,
    activePiece,
    activePieceRef,
    gameOver,
    nextPieces,
    lastDrop,
    savedPiece,
    spawnTetromino,
    getNextPiece,
    getFullGameState,
  };
};

export default useTetrisGame;
