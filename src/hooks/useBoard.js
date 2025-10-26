import { useEffect, useRef, useState } from "react";
import { BOARD_COLS, BOARD_ROWS, BUFFER_ZONE_ROWS } from "../utils/constants";

const useBoard = () => {
    const [board, setBoard] = useState(
        new Array((BUFFER_ZONE_ROWS * BOARD_COLS) + (BOARD_ROWS * BOARD_COLS)).fill(0)
    );
    const boardRef = useRef(board);
    const [activePiece, setActivePiece] = useState(null);
    const activePieceRef = useRef(activePiece);

    useEffect(() => {
        if (activePiece) activePieceRef.current = activePiece;
    }, [activePiece])

    useEffect(() => {
        if (board) boardRef.current = board;
    }, [board])

    return {
        board,
        boardRef,
        setBoard,
        activePiece,
        activePieceRef,
        setActivePiece
    };
}

export default useBoard;