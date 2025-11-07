import Avatar from '../ui/Avatar/Avatar';
import Card from '../ui/Card/Card';
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
      <div className="flex flex-col gap-3 h-full overflow-hidden">
        <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20 shadow-lg flex-shrink-0">
          <Avatar avatar={player.avatar} size="large" />
          <div
            className="text-xl font-bold text-white tracking-wide flex-1"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            {player.username}
          </div>
        </div>

        <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 rounded-lg p-2 border border-cyan-500/20 shadow-md flex-shrink-0">
          <h3
            className="text-xs font-bold text-cyan-400 uppercase tracking-widest text-center mb-1 pb-1 border-b border-cyan-500/20"
            style={{ textShadow: '0 0 10px rgba(100, 200, 150, 0.5)' }}
          >
            Hold
          </h3>
          <div className="flex items-center justify-center min-h-[70px] bg-black/30 rounded-md border border-gray-700/50 p-2">
            {savedPiece?.tetromino ? (
              <LegoPiece
                color={getColorHex(savedPiece.tetromino.color)}
                shape={savedPiece.tetromino.shape}
                disabled={savedPiece.disabled}
                size={20}
              />
            ) : (
              <div className="text-white/30 text-xs text-center italic">
                No piece
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.gameBoardWrapper} p-2 flex-1 min-h-0`}>
          <div className={styles.gameGrid}>
            <div className={styles.tetrisBoard}>{cells}</div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 rounded-lg p-2 border border-cyan-500/20 shadow-md flex-shrink-0">
          <h3
            className="text-xs font-bold text-cyan-400 uppercase tracking-widest text-center mb-1 pb-1 border-b border-cyan-500/20"
            style={{ textShadow: '0 0 10px rgba(100, 200, 150, 0.5)' }}
          >
            Next
          </h3>
          <div
            className={`flex gap-2 overflow-x-auto pb-1 ${styles.nextPiecesScroll}`}
          >
            {nextPieces?.slice(0, 5).map((piece, index) => (
              <div
                key={index}
                className="flex items-center justify-center min-w-[60px] min-h-[60px] bg-black/20 rounded-md border border-gray-700/30 p-2 hover:bg-black/30 hover:border-cyan-500/30 transition-all"
              >
                <LegoPiece
                  color={getColorHex(piece.color)}
                  shape={piece.shape}
                  size={18}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GameCard;
