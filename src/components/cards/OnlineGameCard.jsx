import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Avatar from '../ui/Avatar/Avatar';
import Card from '../ui/Card/Card';
import styles from './GameCard.module.css';
import useSocket from '../../hooks/useSocket';
import { getColorHex, getIndex, hasCollided } from '../../utils/helper';
import { BOARD_COLS, BOARD_ROWS, CLASS, MOVES } from '../../utils/constants';
import GarbagePreviewBar from '../game/GarbagePreviewBar';
import useBoard from '../../hooks/useBoard';
import Cell from '../game/Cell';
import usePieceGenerator from '../../hooks/usePieceGenerator';
import LegoPiece from '../ui/Backgrounds/LegoPiece';
import useRotation from '../../hooks/useRotation';
import useMovement from '../../hooks/useMovement';
import { Tetromino } from '../../utils/tetromino';

const OnlineGameCard = ({
  player,
  matchData,
  startGame,
  compact = false,
  playerCount = 1,
  isTargeted = false,
  eliminated = false,
}) => {
  const showNextOnSide = compact && playerCount === 3;
  const [gameOver, setGameOver] = useState(false);
  const isEliminated = eliminated || gameOver;
  const [pendingGarbage, setPendingGarbage] = useState(0);
  const pendingGarbageRef = useRef(0);
  const {
    board,
    boardRef,
    setBoard,
    activePiece,
    activePieceRef,
    setActivePiece,
    savedPiece,
    savedPieceRef,
    setSavedPiece,
  } = useBoard();
  const { nextPieces, getNextPiece } = usePieceGenerator(startGame, matchData?.id);
  const rotatePiece = useRotation({ hasCollided, boardRef });
  const { movePiece } = useMovement({
    boardRef,
    activePieceRef,
    setActivePiece,
    rotatePiece,
  });
  const shortSessionId = player?.sessionId?.slice(0, 8);

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

  // Decrement the pending garbage bar when the player's board receives garbage.
  // Board state comes from board-sync snapshots — no local mutation needed here.
  const decrementPendingGarbage = useCallback((lines) => {
    if (!lines || lines <= 0) return;
    const linesToRemove = Math.min(lines, BOARD_ROWS);
    pendingGarbageRef.current = Math.max(0, pendingGarbageRef.current - linesToRemove);
    setPendingGarbage(pendingGarbageRef.current);
  }, []);

  // Uses refs for board and savedPiece so this callback is stable across renders
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

    if (savedPieceRef.current.disabled) {
      setSavedPiece({ ...savedPieceRef.current, disabled: false });
    }

    const nextPiece = getNextPiece();
    spawnTetromino(nextPiece);
  }, [
    activePieceRef,
    boardRef,
    savedPieceRef,
    updateBoard,
    setActivePiece,
    setSavedPiece,
    getNextPiece,
    spawnTetromino,
  ]);

  // Uses refs for savedPiece and activePiece so this callback is stable across renders
  const updateSavedPiece = useCallback(() => {
    const sp = savedPieceRef.current;
    if (sp.disabled) return;

    setSavedPiece({ tetromino: activePieceRef.current, disabled: true });
    if (sp.tetromino) {
      spawnTetromino(
        new Tetromino({
          shape: sp.tetromino.shape,
          color: sp.tetromino.color,
        })
      );
    } else {
      spawnTetromino(getNextPiece());
    }
  }, [savedPieceRef, setSavedPiece, activePieceRef, spawnTetromino, getNextPiece]);

  const { on, off } = useSocket();

  const eventReceived = useCallback(
    (data) => {
      console.log(`OnlineGameCard (${shortSessionId}): received event:`, data);
      switch (data?.action) {
        case MOVES.DOWN:
          movePiece(MOVES.DOWN);
          break;
        case MOVES.LEFT:
          movePiece(MOVES.LEFT);
          break;
        case MOVES.RIGHT:
          movePiece(MOVES.RIGHT);
          break;
        case MOVES.ROTATE:
          movePiece(MOVES.ROTATE);
          break;
        case MOVES.SAVE:
          updateSavedPiece();
          break;
        case MOVES.SOFT_DROP:
        case MOVES.HARD_DROP:
          lockPiece();
          break;
        case 'board-sync':
          // Replace board with the authoritative snapshot from the player's frontend.
          // This is the permanent fix for event-replay drift.
          if (Array.isArray(data?.board)) setBoard(data.board);
          break;
        case 'clear-row':
          // Board state comes from board-sync; clear-row is kept for future animation hooks.
          break;
        case 'add-garbage':
          // Decrement the pending bar — board state comes from board-sync.
          decrementPendingGarbage(data?.lines);
          break;
        default:
          console.error('An error has occurred: Unknown move.');
      }
    },
    [movePiece, updateSavedPiece, lockPiece, decrementPendingGarbage, setBoard, shortSessionId]
  ); // Intentionally exclude shortSessionId from deps

  // Listen for garbage-pending events so the preview bar fills before rows are applied
  useEffect(() => {
    const handleGarbagePending = ({ targetId, lines }) => {
      if (targetId !== player.sessionId) return;
      pendingGarbageRef.current += lines;
      setPendingGarbage(pendingGarbageRef.current);
    };

    on('garbage-pending', handleGarbagePending);
    return () => off('garbage-pending', handleGarbagePending);
  }, [on, off, player.sessionId]);

  useEffect(() => {
    if (nextPieces.length === 6 && !activePieceRef.current) spawnTetromino(getNextPiece());
  }, [startGame, nextPieces, activePieceRef, getNextPiece, spawnTetromino]);

  // Register socket event listener
  useEffect(() => {
    if (!shortSessionId) {
      console.log(`OnlineGameCard: Skipping listener setup - no shortSessionId`);
      return;
    }
    console.log(`OnlineGameCard: Setting up listener for opponent ${player.username} (${shortSessionId})`);
    on(shortSessionId, eventReceived);

    return () => {
      console.log(`OnlineGameCard: Removing listener for opponent ${player.username} (${shortSessionId})`);
      off(shortSessionId, eventReceived);
    };
  }, [on, off, shortSessionId, player.username, eventReceived]);

  const boardCells = useMemo(() => {
    return board.map((filled, idx) => ({ idx, filled }));
  }, [board]);

  const cells = useMemo(() => {
    const activePieceIndices = new Set(activePiece?.coords?.map((coords) => getIndex(coords)) || []);

    return boardCells.map(({ idx, filled }) => {
      const isActivePiece = activePieceIndices.has(idx);

      let type = CLASS.EMPTY;
      if (isActivePiece || filled) type = CLASS.TILE;

      return <Cell key={idx} index={idx} color={isActivePiece ? activePiece?.color : filled} type={type} />;
    });
  }, [boardCells, activePiece]);

  return (
    <div className="h-full">
      <Card greyScale={isEliminated} message="Game over">
        <div className="flex flex-col gap-2 h-full">
          <div
            className={`flex items-center ${compact ? 'gap-2 pl-1 pr-1' : 'gap-3 pl-2 pr-2'} rounded-xl border shadow-lg flex-shrink-0 transition-all duration-300 ${
              isTargeted
                ? 'bg-gradient-to-r from-red-500/20 via-red-400/10 to-red-500/20 border-red-500/40'
                : 'bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-purple-500/10 border-cyan-500/20'
            }`}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={`${compact ? 'text-sm' : 'text-xl'} font-bold text-white tracking-wide truncate`}
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {player.username}
              </div>
              {isTargeted && (
                <span
                  className={`${compact ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'} font-bold uppercase tracking-wider rounded bg-red-500 text-white flex-shrink-0 animate-pulse`}
                  style={{ textShadow: 'none' }}>
                  TARGET
                </span>
              )}
            </div>
            <div
              className={`bg-gradient-to-b from-gray-800/80 to-gray-900/90 rounded-lg ${compact ? 'p-1' : 'p-2'} border border-cyan-500/20 shadow-md flex-shrink-0 scale-80`}>
              <h3
                className={`${compact ? 'text-[8px]' : 'text-xs'} font-bold text-cyan-400 uppercase tracking-widest text-center mb-1 pb-1 border-b border-cyan-500/20`}
                style={{ textShadow: '0 0 10px rgba(100, 200, 150, 0.5)' }}>
                Hold
              </h3>
              <div
                className={`flex items-center justify-center w-[100px] ${compact ? 'min-h-[40px]' : 'min-h-[70px]'} bg-black/30 rounded-md border border-gray-700/50 ${compact ? 'p-1' : 'p-2'}`}>
                {savedPiece?.tetromino ? (
                  <LegoPiece
                    color={getColorHex(savedPiece.tetromino.color)}
                    shape={savedPiece.tetromino.shape}
                    disabled={savedPiece.disabled}
                    size={compact ? 12 : 20}
                  />
                ) : (
                  <div className={`text-white/30 ${compact ? 'text-[8px]' : 'text-xs'} text-center italic`}>
                    No piece
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={`flex ${showNextOnSide ? 'flex-row gap-2' : 'flex-col gap-2'} flex-1 min-h-0 overflow-hidden`}>
            <div className="flex gap-1 flex-1 min-h-0">
              <GarbagePreviewBar pendingGarbage={pendingGarbage} />
              <div className={`${styles.gameBoardWrapper} ${compact ? 'p-1' : 'p-2'} flex-1 min-h-0`}>
                <div className={styles.gameGrid}>
                  <div className={styles.tetrisBoard}>{cells}</div>
                </div>
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
        <Avatar editable={false} className={styles.onlineAvatar} avatar={player.avatar} />
      </Card>
    </div>
  );
};

export default OnlineGameCard;
