import Avatar from '../ui/Avatar/Avatar';
import Card from '../ui/Card/Card';
import Title from '../ui/Titles/Title';
import styles from './GameCard.module.css';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { SHAPES, Tetromino } from '../../utils/tetromino';
import useGameLoop from '../../hooks/useGameLoop';
import useRotation from '../../hooks/useRotation';
import {
  BOARD_COLS,
  BOARD_ROWS,
  BUFFER_ZONE_ROWS,
  CLASS,
  COLLISION,
  MOVES,
  SPAWN_CELL_COL,
} from '../../utils/constants';
import useBoard from '../../hooks/useBoard';
import useScoreManager from '../../hooks/useScoreManager';
import { useLocation } from 'react-router-dom';

const getCellClassName = (index, type) => {
  if (index < 20 && !type) return styles.bufferZoneCell;
  return type === CLASS.YELLOW
    ? styles.filled
    : type === CLASS.PREDICT
      ? styles.predict
      : styles.cell;
};

const Cell = React.memo(({ index, type }) => {
  return <div className={getCellClassName(index, type)} />;
});

const GameCard = ({ player, setScore, level, setLevel }) => {
  const {
    board,
    boardRef,
    setBoard,
    activePiece,
    activePieceRef,
    setActivePiece,
  } = useBoard();
  // const [warningState, setWarningState] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const location = useLocation();
  const {
    piecePrediction,
    // invisiblePieces,
    // increasedGravity
  } = location.state || {};

  const movePiece = (move) => {
    const piece = activePieceRef.current;
    if (!piece) return COLLISION.NO;
    let proposed = null;
    let coords = [];
    let shape = piece.shape;
    switch (move) {
      case MOVES.DOWN:
        coords = piece.coords?.map(([r, c]) => [r + 1, c]);
        proposed = {
          coords,
          shape,
          pivot: piece.pivot,
          rotation: piece.rotation,
        };
        break;
      case MOVES.RIGHT:
        coords = piece.coords?.map(([r, c]) => [r, c + 1]);
        proposed = {
          coords,
          shape,
          pivot: piece.pivot,
          rotation: piece.rotation,
        };
        break;
      case MOVES.LEFT:
        coords = piece.coords?.map(([r, c]) => [r, c - 1]);
        proposed = {
          coords,
          shape,
          pivot: piece.pivot,
          rotation: piece.rotation,
        };
        break;
      case MOVES.ROTATE:
        proposed = rotatePiece(piece);
        if (!proposed) return COLLISION.CONTINUE;
        setActivePiece(
          new Tetromino(
            proposed.shape,
            piece.color,
            proposed.coords,
            getPredictCoords(proposed.coords),
            proposed.pivot,
            proposed.rotation
          )
        );
        return COLLISION.NO;
      default:
        return COLLISION.NO;
    }
    const collision = hasCollided(move, proposed.coords);
    if (!collision)
      setActivePiece(
        new Tetromino(
          proposed.shape,
          piece.color,
          proposed.coords,
          getPredictCoords(proposed.coords),
          proposed.pivot,
          proposed.rotation
        )
      );
    return collision;
  };

  const lockPiece = () => {
    const coords = activePieceRef?.current?.predictCoords;
    if (!coords) return;
    console.log(coords);
    updateBoard(coords);
    setActivePiece(null);
    if (coords.some(([r]) => r === 0)) {
      setGameOver(true);
      return;
    }
    spawnTetromino(getRandomShape());
  };

  const lastDrop = useGameLoop(() => {}, movePiece, lockPiece, level);
  const rowsCleared = useScoreManager({
    setScore,
    level,
    setLevel,
    board,
    setBoard,
    lastDrop,
  });

  const getCell = useCallback(
    (coords) => {
      const board = boardRef.current;
      const idx = getIndex(coords);
      return board[idx];
    },
    [boardRef]
  );

  const hasCollided = useCallback(
    (move, coords) => {
      if (!coords) return COLLISION.NO;

      for (const [r, c] of coords) {
        if (c < 0 || c >= BOARD_COLS) return COLLISION.CONTINUE;

        if (move === MOVES.DOWN) {
          // Bottom collision
          if (r >= BUFFER_ZONE_ROWS + BOARD_ROWS) return COLLISION.LOCK;

          // Cell collision
          if (getCell([r, c])) return COLLISION.LOCK;
        } else {
          if (r >= BUFFER_ZONE_ROWS + BOARD_ROWS || getCell([r, c]))
            return COLLISION.CONTINUE;
        }
      }
      return COLLISION.NO;
    },
    [getCell]
  );

  const getPredictCoords = useCallback(
    (coords) => {
      if (!coords) return [];
      let prediction = coords.map(([r, c]) => [r, c]);
      while (true) {
        const next = prediction.map(([r, c]) => [r + 1, c]);
        const collision = hasCollided(MOVES.DOWN, next);

        if (collision === COLLISION.LOCK || collision === COLLISION.CONTINUE)
          break;

        prediction = next;
      }
      return prediction;
    },
    [hasCollided]
  );

  const spawnTetromino = useCallback(
    (shape) => {
      let coords = [];
      shape.map((row, rowIdx) =>
        row.map((cell, cellIdx) => {
          if (cell) coords.push([rowIdx, SPAWN_CELL_COL + cellIdx]);
        })
      );
      const tetromino = new Tetromino(
        shape,
        'red',
        coords,
        getPredictCoords(coords)
      );
      setActivePiece(tetromino);
    },
    [getPredictCoords, setActivePiece]
  );

  const updateBoard = (coords) => {
    setBoard((prev) => {
      const newBoard = [...prev];
      coords.forEach(([row, col]) => {
        newBoard[row * BOARD_COLS + col] = 1;
      });
      return newBoard;
    });
  };

  const rotatePiece = useRotation({ hasCollided });

  const getIndex = (coords) => {
    return coords[0] * BOARD_COLS + coords[1];
  };

  const boardCells = useMemo(() => {
    return board.map((filled, idx) => ({ idx, filled }));
  }, [board]);

  const cells = useMemo(() => {
    const activePieceIndices = new Set(
      activePiece?.coords?.map((coords) => getIndex(coords)) || []
    );

    const predictIndices = new Set(
      piecePrediction
        ? activePiece?.predictCoords?.map((coords) => getIndex(coords))
        : []
    );

    return boardCells.map(({ idx, filled }) => (
      <Cell
        key={idx}
        index={idx}
        type={
          activePieceIndices.has(idx) || filled
            ? CLASS.YELLOW
            : predictIndices.has(idx)
              ? CLASS.PREDICT
              : CLASS.EMPTY
        }
      />
    ));
  }, [boardCells, activePiece, piecePrediction]);

  const getRandomShape = useCallback(() => {
    const shapes = Object.values(SHAPES);
    const randomIndex = Math.floor(Math.random() * shapes.length);
    return shapes[randomIndex];
  }, []);

  useEffect(() => {
    spawnTetromino(getRandomShape());
  }, [spawnTetromino, getRandomShape]);

  return (
    <Card greyScale={gameOver}>
      <Avatar avatar={player.avatar} />
      <Title>{player.username}</Title>
      <p>Rows cleared: {rowsCleared}</p>
      <div className={styles.gameGrid}>
        <div className={styles.tetrisBoard}>{cells}</div>
      </div>
    </Card>
  );
};

export default GameCard;
