import { useEffect, useMemo, useState } from 'react';
import Avatar from '../ui/Avatar/Avatar';
import Card from '../ui/Card/Card';
import styles from './GameCard.module.css';
import useSocket from '../../hooks/useSocket';
import { getColorHex, getIndex } from '../../utils/helper';
import { CLASS } from '../../utils/constants';
import Cell from '../game/Cell';
import LegoPiece from '../ui/Backgrounds/LegoPiece';

const DebugServerGameCard = ({ player, compact = false, playerCount = 1 }) => {
  const showNextOnSide = compact && playerCount === 3;
  const [board, setBoard] = useState(Array(200).fill(null));
  const [activePiece, setActivePiece] = useState(null);
  const [savedPiece, setSavedPiece] = useState({ tetromino: null, disabled: false });
  const [nextPieces, setNextPieces] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const { on, off } = useSocket();

  useEffect(() => {
    const handleBoardUpdate = (data) => {
      if (data?.board) {
        setBoard(data.board);
      }
      if (data?.activePiece !== undefined) {
        setActivePiece(data.activePiece);
      }
      if (data?.savedPiece !== undefined) {
        setSavedPiece(data.savedPiece);
      }
      if (data?.nextPieces) {
        setNextPieces(data.nextPieces);
      }
      if (data?.gameOver !== undefined) {
        setGameOver(data.gameOver);
      }
    };

    on('board', handleBoardUpdate);

    return () => {
      off('board', handleBoardUpdate);
    };
  }, [on, off]);

  const cells = useMemo(() => {
    const activePieceIndices = new Set(activePiece?.coords?.map((coords) => getIndex(coords)) || []);

    return board.map((filled, idx) => {
      const isActivePiece = activePieceIndices.has(idx);

      let type = CLASS.EMPTY;
      if (isActivePiece || filled) type = CLASS.TILE;

      return <Cell key={idx} index={idx} color={isActivePiece ? activePiece?.color : filled} type={type} />;
    });
  }, [board, activePiece]);

  return (
    <Card greyScale={gameOver} message="Game over">
      <div className="flex flex-col gap-2 h-full overflow-hidden">
        <div
          className={`flex items-center ${compact ? 'gap-2 p-1' : 'gap-3 p-2'} bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20 shadow-lg flex-shrink-0`}>
          <Avatar avatar={player.avatar} size={compact ? 'small' : 'large'} />
          <div
            className={`${compact ? 'text-sm' : 'text-xl'} font-bold text-white tracking-wide flex-1`}
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {player.username}
          </div>
          <div
            className={`bg-gradient-to-b from-gray-800/80 to-gray-900/90 rounded-lg ${compact ? 'p-1' : 'p-2'} border border-cyan-500/20 shadow-md flex-shrink-0`}>
            <h3
              className={`${compact ? 'text-[8px]' : 'text-xs'} font-bold text-cyan-400 uppercase tracking-widest text-center mb-1 pb-1 border-b border-cyan-500/20`}
              style={{ textShadow: '0 0 10px rgba(100, 200, 150, 0.5)' }}>
              Hold
            </h3>
            <div
              className={`flex items-center justify-center ${compact ? 'min-h-[40px]' : 'min-h-[70px]'} bg-black/30 rounded-md border border-gray-700/50 ${compact ? 'p-1' : 'p-2'}`}>
              {savedPiece.tetromino ? (
                <LegoPiece
                  color={getColorHex(savedPiece.tetromino.color)}
                  shape={savedPiece.tetromino.shape}
                  disabled={savedPiece.disabled}
                  size={compact ? 12 : 20}
                />
              ) : (
                <div className={`text-white/30 ${compact ? 'text-[8px]' : 'text-xs'} text-center italic`}>No piece</div>
              )}
            </div>
          </div>
        </div>

        <div className={`flex ${showNextOnSide ? 'flex-row gap-2' : 'flex-col gap-2'} flex-1 min-h-0 overflow-hidden`}>
          <div className={`${styles.gameBoardWrapper} ${compact ? 'p-1' : 'p-2'} flex-1 min-h-0`}>
            <div className={styles.gameGrid}>
              <div className={styles.tetrisBoard}>{cells}</div>
            </div>
          </div>

          {showNextOnSide && (
            <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 rounded-lg p-1 border border-cyan-500/20 shadow-md flex-shrink-0 w-16">
              <h3
                className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest text-center mb-1 pb-1 border-b border-cyan-500/20"
                style={{ textShadow: '0 0 10px rgba(100, 200, 150, 0.5)' }}>
                Next
              </h3>
              <div className="flex flex-col gap-1 overflow-y-auto max-h-full">
                {nextPieces?.slice(0, 3).map((piece, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center min-h-[40px] bg-black/20 rounded-md border border-gray-700/30 p-1">
                    <LegoPiece color={getColorHex(piece.color)} shape={piece.shape} size={12} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!showNextOnSide && (
          <div
            className={`bg-gradient-to-b from-gray-800/80 to-gray-900/90 rounded-lg ${compact ? 'p-1' : 'p-2'} border border-cyan-500/20 shadow-md flex-shrink-0`}>
            <h3
              className={`${compact ? 'text-[8px]' : 'text-xs'} font-bold text-cyan-400 uppercase tracking-widest text-center mb-1 pb-1 border-b border-cyan-500/20`}
              style={{ textShadow: '0 0 10px rgba(100, 200, 150, 0.5)' }}>
              Next
            </h3>
            <div className={`flex ${compact ? 'gap-1' : 'gap-2'} overflow-x-auto pb-1 ${styles.nextPiecesScroll}`}>
              {nextPieces?.slice(0, compact ? 3 : 5).map((piece, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center ${compact ? 'min-w-[40px] min-h-[40px] p-1' : 'min-w-[60px] min-h-[60px] p-2'} bg-black/20 rounded-md border border-gray-700/30 hover:bg-black/30 hover:border-cyan-500/30 transition-all`}>
                  <LegoPiece color={getColorHex(piece.color)} shape={piece.shape} size={compact ? 12 : 18} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DebugServerGameCard;
