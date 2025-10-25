import Avatar from "../ui/Avatar/Avatar";
import Card from "../ui/Card/Card";
import Title from "../ui/Titles/Title";
import styles from './GameCard.module.css';
import React, { useState, useCallback, useMemo, useEffect } from "react";

const Cell = React.memo(({ filled }) => {
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

    const cells = useMemo(() => {
        return board.map((filled, idx) => (
            <Cell key={idx} filled={filled} />
        ));
    }, [board]);

    useEffect(() => {
        updateCell(19, 4, 1);
    }, []);

    return (
        <Card>
            <Avatar avatar={player.avatar} />
            <Title>{player.username}</Title>
            <div className={styles.gameGrid}>
                <div className={styles.tetrisBoard}>
                    {cells}
                </div>
            </div>
        </Card>
    );
};

export default GameCard;