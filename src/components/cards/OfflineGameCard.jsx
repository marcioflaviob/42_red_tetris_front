import Avatar from '../ui/Avatar/Avatar';
import Card from '../ui/Card/Card';
import Title from '../ui/Titles/Title';
import styles from './GameCard.module.css';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Tetromino } from '../../utils/tetromino';
import useGameLoop from '../../hooks/useGameLoop';
import useRotation from '../../hooks/useRotation';
import { BOARD_COLS, CLASS, COLLISION, MOVES } from '../../utils/constants';
import useBoard from '../../hooks/useBoard';
import useScoreManager from '../../hooks/useScoreManager';
import { useLocation } from 'react-router-dom';
import {
  getCellClassName,
  getColorHex,
  getIndex,
  hasCollided,
} from '../../utils/helper';
import LegoPiece from '../ui/Backgrounds/LegoPiece';
import usePieceGenerator from '../../hooks/usePieceGenerator';

const Cell = React.memo(({ index, type, color }) => {
  return <div className={getCellClassName(index, type, color)} />;
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
  const { nextPieces, getNextPiece } = usePieceGenerator();

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
          new Tetromino({
            shape: proposed.shape,
            color: piece.color,
            coords: proposed.coords,
            pivot: proposed.pivot,
            rotation: proposed.rotation,
          })
        );
        return COLLISION.NO;
      default:
        return COLLISION.NO;
    }
    const collision = hasCollided(move, proposed.coords, boardRef?.current);
    if (!collision)
      setActivePiece(
        new Tetromino({
          shape: proposed.shape,
          color: piece.color,
          coords: proposed.coords,
          pivot: proposed.pivot,
          rotation: proposed.rotation,
        })
      );
    return collision;
  };

  const lockPiece = () => {
    const piece = activePieceRef?.current;
    if (!piece) return;
    const coords = piece.getPredictCoords(boardRef.current);
    updateBoard(coords, piece.color);
    setActivePiece(null);
    if (coords.some(([r]) => r === 0)) {
      setGameOver(true);
      return;
    }
    spawnTetromino(getNextPiece());
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

  const spawnTetromino = useCallback(
    (tetromino) => {
      setActivePiece(tetromino);
    },
    [setActivePiece]
  );

  const updateBoard = (coords, color) => {
    setBoard((prev) => {
      const newBoard = [...prev];
      coords.forEach(([row, col]) => {
        newBoard[row * BOARD_COLS + col] = color;
      });
      return newBoard;
    });
  };

  const rotatePiece = useRotation({ hasCollided, boardRef });

  const boardCells = useMemo(() => {
    return board.map((filled, idx) => ({ idx, filled }));
  }, [board]);

  const cells = useMemo(() => {
    const activePieceIndices = new Set(
      activePiece?.coords?.map((coords) => getIndex(coords)) || []
    );

    const predictCoords =
      piecePrediction && activePiece
        ? activePiece.getPredictCoords(boardRef.current)
        : [];
    const predictIndices = new Set(
      predictCoords.map((coords) => getIndex(coords))
    );

    return boardCells.map(({ idx, filled }) => {
      const isActivePiece = activePieceIndices.has(idx);
      const type =
        isActivePiece || filled
          ? CLASS.TILE
          : predictIndices.has(idx)
            ? CLASS.PREDICT
            : CLASS.EMPTY;
      return (
        <Cell
          key={idx}
          index={idx}
          color={isActivePiece ? activePiece?.color : filled}
          type={type}
        />
      );
    });
  }, [boardCells, activePiece, piecePrediction, boardRef]);

  useEffect(() => {
    spawnTetromino(getNextPiece());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spawnTetromino]);

  return (
    <Card greyScale={gameOver}>
      <Avatar avatar={player.avatar} />
      <Title>{player.username}</Title>
      <p>Rows cleared: {rowsCleared}</p>
      <div className="flex flex-row gap-4">
        <div className={styles.gameGrid}>
          <div className={styles.tetrisBoard}>{cells}</div>
        </div>
        <div className="flex flex-col gap-5 bg-gray-800 p-4 rounded-lg border-2 border-gray-700 shadow-lg min-w-[120px]">
          {/* <h3 className='text-white text-sm font-semibold text-center mb-2 uppercase tracking-wide'>Next Pieces</h3> */}
          {nextPieces?.slice(0, 5).map((piece, index) => {
            return (
              <LegoPiece
                key={index}
                color={getColorHex(piece?.color)}
                shape={piece.shape}
                size={20}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default GameCard;
