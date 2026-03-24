import { useState, useCallback, useEffect, useRef } from 'react';
import { BOARD_COLS, BOARD_ROWS, GARBAGE_COLOR } from '../utils/constants';
import { hasCollided } from '../utils/helper';
import useBoard from './useBoard';
import useRotation from './useRotation';
import useMovement from './useMovement';
import useGameLoop from './useGameLoop';
import usePieceGenerator from './usePieceGenerator';
import { Tetromino } from '../utils/tetromino';

const useTetrisGame = ({ player, level, startGame, matchData, onPieceLocked, onGameStateChange, emit }) => {
  const [gameOver, setGameOver] = useState(false);
  const [pendingGarbage, setPendingGarbage] = useState(0);
  const pendingGarbageRef = useRef(0);

  // Stable ref so lockPiece can broadcast without needing emit/player in its deps
  const broadcastRef = useRef(null);
  const broadcast = useCallback(
    (event, data) => {
      const shortId = player?.sessionId?.slice(0, 8);
      if (emit) emit(shortId, { event, ...data });
    },
    [emit, player]
  );
  useEffect(() => {
    broadcastRef.current = broadcast;
  }, [broadcast]);

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

  const addGarbage = useCallback((lines) => {
    pendingGarbageRef.current += lines;
    setPendingGarbage((prev) => prev + lines);
  }, []);

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

    // Apply any queued garbage lines to the bottom of the board
    if (pendingGarbageRef.current > 0) {
      const linesToAdd = Math.min(pendingGarbageRef.current, BOARD_ROWS);
      pendingGarbageRef.current = 0;
      setPendingGarbage(0);
      setBoard((prev) => {
        const newBoard = [...prev];
        for (let i = 0; i < linesToAdd; i++) {
          newBoard.splice(0, BOARD_COLS); // drop top row to make room
          newBoard.push(...new Array(BOARD_COLS).fill(GARBAGE_COLOR));
        }
        return newBoard;
      });
      // Tell all spectators to apply the same grey rows on the opponent view
      broadcastRef.current?.('board', { action: 'add-garbage', lines: linesToAdd });
    }

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
    setBoard,
    savedPiece,
    setSavedPiece,
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

  // Board-sync: after every board change, broadcast the authoritative snapshot.
  // Spectator OnlineGameCards replace their local board with this, eliminating
  // cumulative event-replay drift permanently. React batches multiple setBoard
  // calls in one lock cycle into a single commit, so this fires once per lock.
  useEffect(() => {
    if (!startGame) return;
    broadcastRef.current?.('board', { action: 'board-sync', board });
  }, [board, startGame]);

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
    pendingGarbage,
    addGarbage,
  };
};

export default useTetrisGame;
