import { useEffect, useRef } from 'react';
import { COLLISION, FRAMES_PER_SECOND, MOVE_DELAY, MOVES } from '../utils/constants';
import useKeyboard from './useKeyboard';

const useGameLoop = (callback, movePiece, lockPiece, level = 1) => {
    const callbackRef = useRef(callback);
    const lastMoveTime = useRef({ left: 0, right: 0, down: 0, up: 0 });
    const lastGravityTime = useRef(0);
    const frameInterval = 1000 / FRAMES_PER_SECOND;
    const keysPressed = useKeyboard();

    const getGravityDelay = (currentLevel) => {
        return Math.max(100, 1000 - (currentLevel - 1) * 100);
    };

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const loop = () => {
            const now = Date.now();
            const gravityDelay = getGravityDelay(level);
            callbackRef.current();

            if (now - lastGravityTime.current > gravityDelay) {
                if (movePiece(MOVES.DOWN) === COLLISION.LOCK) lockPiece();
                lastGravityTime.current = now;
            }

            if (keysPressed.current.has('ArrowLeft') && now - lastMoveTime.current.left > MOVE_DELAY) {
                movePiece(MOVES.LEFT);
                lastMoveTime.current.left = now;
            }
            if (keysPressed.current.has('ArrowRight') && now - lastMoveTime.current.right > MOVE_DELAY) {
                movePiece(MOVES.RIGHT);
                lastMoveTime.current.right = now;
            }
            if (keysPressed.current.has('ArrowDown') && now - lastMoveTime.current.down > MOVE_DELAY) {
                movePiece(MOVES.DOWN);
                lastMoveTime.current.down = now;
            }
            if (keysPressed.current.has('ArrowUp')) {
                if (lastMoveTime.current.up === 0) {
                    movePiece(MOVES.ROTATE);
                    lastMoveTime.current.up = now;
                }
            } else
                lastMoveTime.current.up = 0;
        };

        const intervalId = setInterval(loop, frameInterval);

        return () => {
            clearInterval(intervalId);
        };
    }, [frameInterval]);
};

export default useGameLoop;