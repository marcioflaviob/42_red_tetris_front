import {
  BOARD_COLS,
  BOARD_ROWS,
  BUFFER_ZONE_ROWS,
  CLASS,
  COLLISION,
  COLOR,
  MOVES,
} from './constants';
import styles from '../components/cards/GameCard.module.css';

export const getRandom = (array) => {
  const values = Object.values(array);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
};

export const hasCollided = (move, coords, board) => {
  if (!coords) return COLLISION.NO;

  for (const [r, c] of coords) {
    if (c < 0 || c >= BOARD_COLS) return COLLISION.CONTINUE;

    if (move === MOVES.DOWN) {
      // Bottom collision
      if (r >= BUFFER_ZONE_ROWS + BOARD_ROWS) return COLLISION.LOCK;

      // Cell collision
      if (getCell([r, c], board)) return COLLISION.LOCK;
    } else {
      if (r >= BUFFER_ZONE_ROWS + BOARD_ROWS || getCell([r, c], board))
        return COLLISION.CONTINUE;
    }
  }
  return COLLISION.NO;
};

export const getIndex = (coords) => {
  return coords[0] * BOARD_COLS + coords[1];
};

export const getCell = (coords, board) => {
  const idx = getIndex(coords);
  return board[idx];
};

export const getCellClassName = (index, type, color) => {
  if (index < 20 && !type) return styles.bufferZoneCell;

  switch (type) {
    case CLASS.TILE:
      return `${getColorClassName(color)}`;
    case CLASS.PREDICT:
      return styles.predict;
    case CLASS.EMPTY:
      return styles.cell;
  }
};

const getColorClassName = (color) => {
  switch (color) {
    case COLOR.PURPLE:
      return 'bg-(--purple)';
    case COLOR.MUSTARD:
      return 'bg-(--mustard)';
    case COLOR.PANTHER:
      return 'bg-(--panther)';
    case COLOR.WINE:
      return 'bg-(--wine)';
    case COLOR.GRASS:
      return 'bg-(--grass)';
    case COLOR.ROYAL:
      return 'bg-(--royal)';
    case COLOR.TURK:
      return 'bg-(--turk)';
  }
};

export const getColorHex = (color) => {
  const root = document.documentElement;
  const style = getComputedStyle(root);

  switch (color) {
    case COLOR.PURPLE:
      return style.getPropertyValue('--purple').trim();
    case COLOR.MUSTARD:
      return style.getPropertyValue('--mustard').trim();
    case COLOR.PANTHER:
      return style.getPropertyValue('--panther').trim();
    case COLOR.WINE:
      return style.getPropertyValue('--wine').trim();
    case COLOR.GRASS:
      return style.getPropertyValue('--grass').trim();
    case COLOR.ROYAL:
      return style.getPropertyValue('--royal').trim();
    case COLOR.TURK:
      return style.getPropertyValue('--turk').trim();
    default:
      return style.getPropertyValue('--mustard').trim();
  }
};
