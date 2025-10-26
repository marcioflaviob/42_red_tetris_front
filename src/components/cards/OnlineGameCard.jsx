import Avatar from "../ui/Avatar/Avatar";
import Card from "../ui/Card/Card";
import Title from "../ui/Titles/Title";
import styles from './GameCard.module.css';
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { SHAPES } from "../../utils/tetromino";

const getCellClassName = (index, filled) => {
    if (index < 20 && !filled) return styles.bufferZoneCell;
    return filled ? styles.filled : styles.cell;
}

const Cell = React.memo(({ index, filled }) => {
    return <div className={getCellClassName(index, filled)} />;
});

const BUFFER_ZONE = 20;
const BOARD_ROWS = 20;
const BOARD_COLS = 10;
const SPAWN_CELL = 3;

const GameCard = ({ player }) => {
    const [board, setBoard] = useState(
        new Array(BUFFER_ZONE + (BOARD_ROWS * BOARD_COLS)).fill(0)
    );

    const spawnTetromino = (shape) => {
        shape.forEach((row, rowIdx) => {
            row.forEach((cell, cellIdx) => {
                updateCell(rowIdx, SPAWN_CELL + cellIdx, cell);
            })
        })
    }

    const updateCell = useCallback((row, col, value) => {
        setBoard(prev => {
            const newBoard = [...prev];
            newBoard[row * BOARD_COLS + col] = value;
            return newBoard;
        });
    }, []);

    const cells = useMemo(() => {
        return board.map((filled, idx) => (
            <Cell key={idx} index={idx} filled={filled} />
        ));
    }, [board]);

    useEffect(() => {
        updateCell(19, 4, 1);
        spawnTetromino(SHAPES.L);
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