import { useCallback, useEffect, useState } from 'react';
import {
  BOARD_COLS,
  BOARD_ROWS,
  BUFFER_ZONE_ROWS,
  LEVEL,
  MOVES,
  SCORE,
  SCORED_ACTION,
} from '../utils/constants';

const useScoreManager = ({
  setScore,
  level,
  setLevel,
  board,
  setBoard,
  lastDrop,
  setAccuracy,
}) => {
  const [rowsCleared, setRowsCleared] = useState(0);
  const [lastScoredAction, setLastScoredAction] = useState(null);

  const calculateAccuracy = useCallback(
    (holes) => {
      const newAccuracy = Math.max(1, 100 * Math.exp(-holes / 20));
      setAccuracy(Math.round(newAccuracy * 100) / 100);
    },
    [setAccuracy]
  );

  const calculateScore = useCallback(
    (rows) => {
      let sum = 0;

      switch (rows) {
        case 1:
          sum = SCORE.SINGLE * level;
          break;
        case 2:
          sum = SCORE.DOUBLE * level;
          break;
        case 3:
          sum = SCORE.TRIPLE * level;
          break;
        case 4:
          if (
            lastScoredAction !== SCORED_ACTION.TETRIS &&
            lastScoredAction !== SCORED_ACTION.TETRIS_B2B
          ) {
            sum = SCORE.TETRIS * level;
            setLastScoredAction(SCORED_ACTION.TETRIS);
          } else {
            sum = SCORE.TETRIS_B2B * level;
            setLastScoredAction(SCORED_ACTION.TETRIS_B2B);
          }
          break;
        default:
          if (lastDrop === SCORED_ACTION.SOFT_DROP) {
            sum = SCORE.SOFT_DROP;
            setLastScoredAction(SCORED_ACTION.SOFT_DROP);
          } else if (lastDrop === SCORED_ACTION.HARD_DROP) {
            sum = SCORE.HARD_DROP;
            setLastScoredAction(SCORED_ACTION.HARD_DROP);
          }
      }

      setScore((prev) => prev + sum);
    },
    [lastDrop, lastScoredAction, level, setScore]
  );

  useEffect(() => {
    const linesToNext = LEVEL[level];
    if (rowsCleared >= linesToNext) {
      if (level !== 9) {
        setLevel((prev) => prev + 1);
      }
    }
  }, [rowsCleared, level, setLevel]);

  const checkHole = useCallback(
    (row, col) => {
      const rowArray = board.slice(
        row * BOARD_COLS,
        row * BOARD_COLS + BOARD_COLS
      );
      const totalRows = BUFFER_ZONE_ROWS + BOARD_ROWS;
      const colArray = Array.from(
        { length: totalRows },
        (_, r) => board[r * BOARD_COLS + col]
      );
      const leftSlice = rowArray.slice(0, col);
      const rightSlice = rowArray.slice(col + 1);
      const aboveSlice = colArray.slice(0, row);

      const hasLeft = leftSlice.length === 0 || leftSlice.some((v) => v !== 0);
      const hasRight =
        rightSlice.length === 0 || rightSlice.some((v) => v !== 0);
      const hasAbove =
        aboveSlice.length == 0 || aboveSlice.some((v) => v !== 0);

      if ((hasAbove && hasLeft) || (hasAbove && hasRight)) {
        return 1;
      }
      return 0;
    },
    [board]
  );

  // Clear rows
  useEffect(() => {
    const fullRows = [];
    const startRow = BUFFER_ZONE_ROWS;
    const endRow = BUFFER_ZONE_ROWS + BOARD_ROWS - 1;
    let holes = 0;
    let isRowAboveEmpty = false;

    for (let r = endRow; r >= startRow; r--) {
      let full = true;
      const rowAbove =
        r > 0
          ? board.slice((r - 1) * BOARD_COLS, (r - 1) * BOARD_COLS + BOARD_COLS)
          : null;
      isRowAboveEmpty = rowAbove ? rowAbove.every((v) => v === 0) : false;
      if (isRowAboveEmpty) break;
      for (let c = 0; c < BOARD_COLS; c++) {
        if (!board[r * BOARD_COLS + c]) {
          full = false;
          holes += checkHole(r, c);
        }
      }
      if (full) fullRows.push(r);
    }
    const rowsClearedNow = fullRows.length;
    calculateScore(rowsClearedNow);
    calculateAccuracy(holes);

    if (rowsClearedNow === 0) return;

    setBoard((prev) => {
      const newBoard = [...prev];
      fullRows
        .sort((a, b) => a - b)
        .forEach((row) => {
          newBoard.splice(row * BOARD_COLS, BOARD_COLS);
          const emptyRow = new Array(BOARD_COLS).fill(0);
          newBoard.unshift(...emptyRow);
        });
      return newBoard;
    });

    setRowsCleared((prev) => prev + rowsClearedNow);
  }, [board, setBoard, calculateScore, checkHole, calculateAccuracy]);

  return rowsCleared;
};

export default useScoreManager;
