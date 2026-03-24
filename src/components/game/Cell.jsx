import { memo } from 'react';
import { CLASS, COLOR, GARBAGE_COLOR } from '../../utils/constants';
import styles from '../cards/GameCard.module.css';

const Cell = memo(({ index, type, color }) => {
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
      case GARBAGE_COLOR:
        return styles.garbageCell;
    }
  };

  const getCellClassName = (index, type, color) => {
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

  return <div className={getCellClassName(index, type, color)} />;
});

export default Cell;
