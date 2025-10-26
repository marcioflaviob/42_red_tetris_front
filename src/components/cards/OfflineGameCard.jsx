import Avatar from "../ui/Avatar/Avatar";
import Card from "../ui/Card/Card";
import Title from "../ui/Titles/Title";
import styles from './GameCard.module.css';
import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { SHAPES, Tetromino } from "../../utils/tetromino";
import useGameLoop from "../../hooks/useGameLoop";
import { BOARD_COLS, BOARD_ROWS, BUFFER_ZONE_ROWS, COLLISION, MOVES, SPAWN_CELL_COL } from "../../utils/constants";
import useBoard from "../../hooks/useBoard";

const getCellClassName = (index, filled) => {
    if (index < 20 && !filled) return styles.bufferZoneCell;
    return filled ? styles.filled : styles.cell;
}

const Cell = React.memo(({ index, filled }) => {
    return <div className={getCellClassName(index, filled)} />;
});

const GameCard = ({ player }) => {
    const { board, boardRef, setBoard, activePiece, activePieceRef, setActivePiece } = useBoard();

    const getCell = (coords) => {
        const board = boardRef.current;
        const idx = getIndex(coords);
        return board[idx];
    }

    const spawnTetromino = (shape) => {
        let coords = [];
        shape.map((row, rowIdx) => (
            row.map((cell, cellIdx) => {
                if (cell) coords.push([rowIdx, SPAWN_CELL_COL + cellIdx]);
            })
        ))
        const tetromino = new Tetromino(
            shape,
            'red',
            coords
        )
        setActivePiece(tetromino);
    }

    const updateBoard = (coords) => {
        setBoard(prev => {
            const newBoard = [...prev];
            coords.forEach(([row, col]) => {
                newBoard[row * BOARD_COLS + col] = 1;
            });
            return newBoard;
        });
    }

    const lockPiece = () => {
        const coords = activePieceRef?.current?.coords;
        if (!coords) return;
        updateBoard(coords)
        setActivePiece(null);
        spawnTetromino(getRandomShape())
    }

    const hasCollided = (move, coords) => {
        if (!coords) return COLLISION.NO;

        for (const [r, c] of coords) {
            if (c < 0 || c >= BOARD_COLS) return COLLISION.CONTINUE;

            if (move === MOVES.DOWN) {
                // Bottom collision
                if (r >= (BUFFER_ZONE_ROWS + BOARD_ROWS)) return COLLISION.LOCK;
                
                // Cell collision
                if (getCell([r, c])) return COLLISION.LOCK;
            } else {
                if (r >= (BUFFER_ZONE_ROWS + BOARD_ROWS) || getCell([r, c]))
                    return COLLISION.CONTINUE;
            }
        }
        return COLLISION.NO;
    };

    const rotatePiece = (piece, coords, shape) => {
        const rows = shape.length;
        const cols = shape[0].length;
        
        const newShape = [];
        for (let c = 0; c < cols; c++) {
            const newRow = [];
            for (let r = rows - 1; r >= 0; r--) {
                newRow.push(shape[r][c]);
            }
            newShape.push(newRow);
        }
        
        const minRow = Math.min(...piece.coords.map(([r]) => r));
        const minCol = Math.min(...piece.coords.map(([, c]) => c));
        
        newShape.forEach((row, rowIdx) => {
            row.forEach((cell, colIdx) => {
                if (cell) {
                    coords.push([minRow + rowIdx, minCol + colIdx]);
                }
            });
        });
        
        shape = newShape;
        return { coords, shape };
    }

    const movePiece = (move) => {
        const piece = activePieceRef.current;
        if (!piece) return COLLISION.NO;
        let coords = [];
        let shape = piece.shape;
        switch(move) {
            case MOVES.DOWN:
                coords = piece.coords?.map(([r, c]) => [r + 1, c]);
                break;
            case MOVES.RIGHT:
                coords = piece.coords?.map(([r, c]) => [r, c + 1]);
                break;
            case MOVES.LEFT:
                coords = piece.coords?.map(([r, c]) => [r, c - 1]);
                break;
            case MOVES.ROTATE:
                ({ coords, shape } = rotatePiece(piece, coords, shape));
                break;
            default:
                return COLLISION.NO;

        }
        const collision = hasCollided(move, coords);
        if (!collision) setActivePiece(new Tetromino(shape, piece.color, coords));
        return collision;
    };

    const getIndex = (coords) => {
        return coords[0] * BOARD_COLS + coords[1];
    }

    const boardCells = useMemo(() => {
        return board.map((filled, idx) => ({ idx, filled }));
    }, [board]);

    const cells = useMemo(() => {
        const activePieceIndices = new Set(
            activePiece?.coords?.map(coords => getIndex(coords)) || []
        );
        
        return boardCells.map(({ idx, filled }) => (
            <Cell 
                key={idx} 
                index={idx} 
                filled={activePieceIndices.has(idx) || filled} 
            />
        ));
    }, [boardCells, activePiece]);

    const getRandomShape = () => {
        const shapes = Object.values(SHAPES);
        const randomIndex = Math.floor(Math.random() * shapes.length);
        return shapes[randomIndex];
    };

    useGameLoop(() => {
    }, movePiece, lockPiece);

    useEffect(() => {
        spawnTetromino(getRandomShape());
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