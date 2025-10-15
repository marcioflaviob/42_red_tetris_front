import Avatar from "../ui/Avatar/Avatar";
import Card from "../ui/Card/Card";
import Title from "../ui/Titles/Title";
import styles from './GameCard.module.css';
import React, { useState, useCallback, useMemo, useContext, createContext, useEffect } from "react";

const BoardContext = createContext();

const Cell = React.memo(({ row, col }) => {
    const board = useContext(BoardContext);
    const filled = board[row * 10 + col];
    return <div className={filled ? styles.filled : styles.cell} />;
});

const BOARD_ROWS = 20;
const BOARD_COLS = 10;

const GameCard = ({ player }) => {
    const [board, setBoard] = useState(
        new Array(BOARD_ROWS * BOARD_COLS).fill(0)
    );

    const updateCell = useCallback((row, col, value) => {
        setBoard(prev => {
            const newBoard = [...prev];
            newBoard[row * BOARD_COLS + col] = value;
            return newBoard;
        });
    }, []);

    // Generate cells ONCE - never recreate
    const cells = useMemo(() => {
        const allCells = [];
        for (let row = 0; row < BOARD_ROWS; row++) {
            for (let col = 0; col < BOARD_COLS; col++) {
                allCells.push(<Cell key={`${row}-${col}`} row={row} col={col} />);
            }
        }
        return allCells;
    }, []); // Empty deps - only create once!

    useEffect(() => {
        updateCell(19, 4, 1);
    }, []);

    return (
        <BoardContext.Provider value={board}>
            <Card>
                <Avatar avatar={player.avatar} />
                <Title>{player.username}</Title>
                <div className={styles.gameGrid}>
                    <div className={styles.tetrisBoard}>
                        {cells}
                    </div>
                </div>
            </Card>
        </BoardContext.Provider>
    );
};

export default GameCard;