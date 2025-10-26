import { useEffect, useMemo, useRef, useState } from 'react';
import {
  COLLISION,
  FRAMES_PER_SECOND,
  MOVE_DELAY,
  MOVES,
  SCORED_ACTION,
} from '../utils/constants';
import useKeyboard from './useKeyboard';

const useGameLoop = (callback, movePiece, lockPiece, level = 1) => {
  const callbackRef = useRef(callback);
  const lastMoveTime = useRef({ left: 0, right: 0, down: 0, up: 0, drop: 0 });
  const lastGravityTime = useRef(0);
  const frameInterval = 1000 / FRAMES_PER_SECOND;
  const keysPressed = useKeyboard();
  const [lastDrop, setLastDrop] = useState(null);

  const getGravityDelay = useMemo(() => {
    const timePerRow = Math.pow(0.8 - (level - 1) * 0.007, level - 1);
    return Math.max(16.67, timePerRow * 1000);
  }, [level]);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const loop = () => {
      const now = Date.now();
      callbackRef.current();

      if (now - lastGravityTime.current > getGravityDelay) {
        if (movePiece(MOVES.DOWN) === COLLISION.LOCK) {
          setLastDrop(SCORED_ACTION.SOFT_DROP);
          lockPiece();
        }
        lastGravityTime.current = now;
      }

      if (
        keysPressed.current.has('ArrowLeft') &&
        now - lastMoveTime.current.left > MOVE_DELAY
      ) {
        // Only move left if right is not pressed, or if left was pressed more recently
        if (
          !keysPressed.current.has('ArrowRight') ||
          lastMoveTime.current.left > lastMoveTime.current.right
        ) {
          movePiece(MOVES.LEFT);
          lastMoveTime.current.left = now;
        }
      }
      if (
        keysPressed.current.has('ArrowRight') &&
        now - lastMoveTime.current.right > MOVE_DELAY
      ) {
        // Only move right if left is not pressed, or if right was pressed more recently
        if (
          !keysPressed.current.has('ArrowLeft') ||
          lastMoveTime.current.right > lastMoveTime.current.left
        ) {
          movePiece(MOVES.RIGHT);
          lastMoveTime.current.right = now;
        }
      }
      if (
        keysPressed.current.has('ArrowDown') &&
        now - lastMoveTime.current.down > MOVE_DELAY
      ) {
        movePiece(MOVES.DOWN);
        lastMoveTime.current.down = now;
      }
      if (keysPressed.current.has(' ')) {
        if (lastMoveTime.current.drop === 0) {
          setLastDrop(SCORED_ACTION.HARD_DROP);
          lockPiece();
          lastMoveTime.current.drop = now;
        }
      } else lastMoveTime.current.drop = 0;
      if (keysPressed.current.has('ArrowUp')) {
        if (lastMoveTime.current.up === 0) {
          movePiece(MOVES.ROTATE);
          lastMoveTime.current.up = now;
        }
      } else lastMoveTime.current.up = 0;
    };

    const intervalId = setInterval(loop, frameInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [frameInterval, getGravityDelay, keysPressed, lockPiece, movePiece]);

  return lastDrop;
};

export default useGameLoop;
