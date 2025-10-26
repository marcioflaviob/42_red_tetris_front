import Avatar from '../ui/Avatar/Avatar';
import Card from '../ui/Card/Card';
import Title from '../ui/Titles/Title';
import styles from './GameCard.module.css';
import React, { useMemo, useEffect, useCallback } from 'react';
import { SHAPES, Tetromino } from '../../utils/tetromino';
import useRotation from '../../hooks/useRotation';
import useGameLoop from '../../hooks/useGameLoop';
import {
  BOARD_COLS,
  BOARD_ROWS,
  BUFFER_ZONE_ROWS,
  COLLISION,
  MOVES,
  SPAWN_CELL_COL,
} from '../../utils/constants';
import useBoard from '../../hooks/useBoard';

const getCellClassName = (index, filled) => {
  if (index < 20 && !filled) return styles.bufferZoneCell;
  return filled ? styles.filled : styles.cell;
};

const Cell = React.memo(({ index, filled }) => {
  return <div className={getCellClassName(index, filled)} />;
});

const GameCard = ({ player }) => {
  const {
    board,
    boardRef,
    setBoard,
    activePiece,
    activePieceRef,
    setActivePiece,
  } = useBoard();

  const getCell = (coords) => {
    const board = boardRef.current;
    const idx = getIndex(coords);
    return board[idx];
  };

  const spawnTetromino = useCallback(
    (shape) => {
      let coords = [];
      shape.map((row, rowIdx) =>
        row.map((cell, cellIdx) => {
          if (cell) coords.push([rowIdx, SPAWN_CELL_COL + cellIdx]);
        })
      );
      const tetromino = new Tetromino(shape, 'red', coords);
      setActivePiece(tetromino);
    },
    [setActivePiece]
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

  const lockPiece = () => {
    const coords = activePieceRef?.current?.coords;
    if (!coords) return;
    updateBoard(coords);
    setActivePiece(null);
    spawnTetromino(getRandomShape());
  };

  const hasCollided = (move, coords) => {
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
  };

  const rotatePiece = useRotation({ hasCollided });

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
          proposed.pivot,
          proposed.rotation
        )
      );
    return collision;
  };

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

    return boardCells.map(({ idx, filled }) => (
      <Cell
        key={idx}
        index={idx}
        filled={activePieceIndices.has(idx) || filled}
      />
    ));
  }, [boardCells, activePiece]);

  const getRandomShape = useCallback(() => {
    const shapes = Object.values(SHAPES);
    const randomIndex = Math.floor(Math.random() * shapes.length);
    return shapes[randomIndex];
  }, []);

  useGameLoop(() => {}, movePiece, lockPiece);

  useEffect(() => {
    spawnTetromino(getRandomShape());
  }, [spawnTetromino, getRandomShape]);

  return (
    <Card>
      <Avatar avatar={player.avatar} />
      <Title>{player.username}</Title>
      <div className={styles.gameGrid}>
        <div className={styles.tetrisBoard}>{cells}</div>
      </div>
    </Card>
  );
};

export default GameCard;
