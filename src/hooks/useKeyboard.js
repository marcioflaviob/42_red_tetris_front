import { useEffect, useRef } from 'react';

const useKeyboard = () => {
    const keysPressed = useRef(new Set());

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
                event.preventDefault();
            }
            keysPressed.current.add(event.key);
        };

        const handleKeyUp = (event) => {
            keysPressed.current.delete(event.key);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return keysPressed;
};

export default useKeyboard;