import { BOARD_ROWS } from '../../utils/constants';
import styles from '../cards/GameCard.module.css';

const GarbagePreviewBar = ({ pendingGarbage }) => (
  <div className={styles.garbagePreviewBar}>
    {Array.from({ length: BOARD_ROWS }, (_, i) => (
      <div key={i} className={i < pendingGarbage ? styles.garbageSegmentFilled : styles.garbageSegmentEmpty} />
    ))}
  </div>
);

export default GarbagePreviewBar;
