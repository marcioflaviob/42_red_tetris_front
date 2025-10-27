import { CLASS, COLOR } from './constants';
import styles from '../components/cards/GameCard.module.css';

export const getRandom = (array) => {
  const values = Object.values(array);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
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
