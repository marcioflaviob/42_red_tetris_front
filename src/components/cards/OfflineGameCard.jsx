import Avatar from '../ui/Avatar/Avatar';
import Card from '../ui/Card/Card';
import Title from '../ui/Titles/Title';
import styles from './GameCard.module.css';
import React, { useMemo, useEffect } from 'react';
import { CLASS } from '../../utils/constants';
import useTetrisGame from '../../hooks/useTetrisGame';
import useScoreManager from '../../hooks/useScoreManager';
import { getCellClassName, getColorHex, getIndex } from '../../utils/helper';
import LegoPiece from '../ui/Backgrounds/LegoPiece';

const Cell = React.memo(({ index, type, color }) => {
  return <div className={getCellClassName(index, type, color)} />;
});

const GameCard = ({
  player,
  setScore,
  level,
  setLevel,
  setRowsCleared,
  gameOver,
  setGameOver,
  startGame,
  piecePrediction,
  increasedGravity,
  invisiblePieces,
  onPieceLocked,
  onGameOver,
}) => {
  const {
    board,
    setBoard,
    activePiece,
    nextPieces,
    lastDrop,
    savedPiece,
    spawnTetromino,
    getNextPiece,
    getFullGameState,
  } = useTetrisGame({
    level,
    increasedGravity,
    onPieceLocked: () => {
      onPieceLocked(getFullGameState());
    },
    onGameStateChange: (state) => {
      if (state.gameOver && !gameOver) {
        setGameOver(true);
        onGameOver();
      }
    },
  });

  const clearedRows = useScoreManager({
    setScore,
    level,
    setLevel,
    board,
    setBoard,
    lastDrop,
  });

  useEffect(() => {
    setRowsCleared(clearedRows);
  }, [clearedRows, setRowsCleared]);

  const boardCells = useMemo(() => {
    return board.map((filled, idx) => ({ idx, filled }));
  }, [board]);

  const cells = useMemo(() => {
    const activePieceIndices = new Set(
      activePiece?.coords?.map((coords) => getIndex(coords)) || []
    );

    const predictCoords =
      piecePrediction && activePiece ? activePiece.getPredictCoords(board) : [];
    const predictIndices = new Set(
      predictCoords.map((coords) => getIndex(coords))
    );

    return boardCells.map(({ idx, filled }) => {
      const isActivePiece = activePieceIndices.has(idx);

      let type = CLASS.EMPTY;
      if (isActivePiece || (filled && !invisiblePieces)) type = CLASS.TILE;
      else if (predictIndices.has(idx)) type = CLASS.PREDICT;

      return (
        <Cell
          key={idx}
          index={idx}
          color={isActivePiece ? activePiece?.color : filled}
          type={type}
        />
      );
    });
  }, [boardCells, activePiece, invisiblePieces, piecePrediction, board]);

  useEffect(() => {
    if (startGame) spawnTetromino(getNextPiece());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startGame]);

  return (
    <Card greyScale={gameOver} message="Game over">
      <Avatar avatar={player.avatar} />
      <Title>{player.username}</Title>
      <div className="flex flex-row gap-4">
        <div className="gap-5 bg-gray-800 p-4 rounded-lg border-2 border-gray-700 shadow-lg">
          <h3 className="text-white text-sm font-semibold text-center mb-2 uppercase tracking-wide">
            Piece Saved
          </h3>
          {savedPiece?.tetromino && (
            <LegoPiece
              color={getColorHex(savedPiece?.tetromino?.color)}
              shape={savedPiece?.tetromino?.shape}
              disabled={savedPiece?.disabled}
              size={20}
            />
          )}
        </div>
        <div className={styles.gameGrid}>
          <div className={styles.tetrisBoard}>{cells}</div>
        </div>
        <div className="flex flex-col gap-5 bg-gray-800 p-4 rounded-lg border-2 border-gray-700 shadow-lg min-w-[120px]">
          <h3 className="text-white text-sm font-semibold text-center mb-2 uppercase tracking-wide">
            Next Pieces
          </h3>
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
