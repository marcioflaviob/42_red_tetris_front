import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { COLLISION, FRAMES_PER_SECOND, GRAVITY_DELAY, MOVE_DELAY, MOVES, SCORED_ACTION } from '../utils/constants';
import useKeyboard from './useKeyboard';

const useGameLoop = (
  callback,
  player,
  movePiece,
  lockPiece,
  updateSavedPiece,
  startGame,
  gameOver,
  level = 1,
  increasedGravity = false,
  emit
) => {
  const callbackRef = useRef(callback);
  const lastMoveTime = useRef({ left: 0, right: 0, down: 0, up: 0, drop: 0 });
  const lastGravityTime = useRef(0);
  const frameInterval = 1000 / FRAMES_PER_SECOND;
  const keysPressed = useKeyboard();
  const [lastDrop, setLastDrop] = useState(null);

  const broadcast = useCallback(
    (event, data) => {
      const shortId = player?.sessionId?.slice(0, 8);
      if (emit) emit(shortId, { event, ...data });
    },
    [emit, player]
  );

  const getGravityDelay = useMemo(() => {
    const timePerRow = Math.pow(0.8 - (level - 1) * 0.007, level - 1);
    const baseDelay = Math.max(16.67, timePerRow * GRAVITY_DELAY);

    if (increasedGravity) {
      const multiplier = Math.max(0.4, 0.55 - (level - 1) * 0.015);
      return baseDelay * multiplier;
    }

    return baseDelay;
  }, [level, increasedGravity]);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!startGame || gameOver) return;

    const loop = () => {
      const now = Date.now();
      callbackRef.current();

      if (now - lastGravityTime.current > getGravityDelay) {
        if (movePiece(MOVES.DOWN) === COLLISION.LOCK) {
          setLastDrop(SCORED_ACTION.SOFT_DROP);
          broadcast('active-piece', {
            action: 'soft-drop',
          });
          lockPiece();
        } else {
          broadcast('active-piece', {
            action: 'move-down',
          });
        }
        lastGravityTime.current = now;
      }

      if (keysPressed.current.has('ArrowLeft') && now - lastMoveTime.current.left > MOVE_DELAY) {
        // Only move left if right is not pressed, or if left was pressed more recently
        if (!keysPressed.current.has('ArrowRight') || lastMoveTime.current.left > lastMoveTime.current.right) {
          if (movePiece(MOVES.LEFT) !== COLLISION.CONTINUE)
            broadcast('active-piece', {
              action: 'move-left',
            });
          lastMoveTime.current.left = now;
        }
      }
      if (keysPressed.current.has('ArrowRight') && now - lastMoveTime.current.right > MOVE_DELAY) {
        // Only move right if left is not pressed, or if right was pressed more recently
        if (!keysPressed.current.has('ArrowLeft') || lastMoveTime.current.right > lastMoveTime.current.left) {
          if (movePiece(MOVES.RIGHT) !== COLLISION.CONTINUE)
            broadcast('active-piece', {
              action: 'move-right',
            });
          lastMoveTime.current.right = now;
        }
      }
      if (keysPressed.current.has('ArrowDown') && now - lastMoveTime.current.down > MOVE_DELAY) {
        if (movePiece(MOVES.DOWN) !== COLLISION.LOCK)
          broadcast('active-piece', {
            action: 'move-down',
          });
        lastMoveTime.current.down = now;
      }
      if (keysPressed.current.has(' ')) {
        if (lastMoveTime.current.drop === 0) {
          setLastDrop(SCORED_ACTION.HARD_DROP);
          broadcast('active-piece', {
            action: 'hard-drop',
          });
          lockPiece();
          lastMoveTime.current.drop = now;
        }
      } else lastMoveTime.current.drop = 0;
      if (keysPressed.current.has('ArrowUp')) {
        if (lastMoveTime.current.up === 0) {
          broadcast('active-piece', {
            action: 'rotate',
          });
          movePiece(MOVES.ROTATE);
          lastMoveTime.current.up = now;
        }
      } else lastMoveTime.current.up = 0;
      if (keysPressed.current.has('C') || keysPressed.current.has('c')) {
        broadcast('active-piece', {
          action: 'save',
        });
        updateSavedPiece();
      }
    };

    const intervalId = setInterval(loop, frameInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    frameInterval,
    getGravityDelay,
    keysPressed,
    lockPiece,
    movePiece,
    updateSavedPiece,
    gameOver,
    broadcast,
    startGame,
  ]);

  return lastDrop;
};

export default useGameLoop;
