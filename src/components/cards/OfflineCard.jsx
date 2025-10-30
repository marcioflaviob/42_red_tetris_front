import styles from './PlayCards.module.css';
import InputSwitch from '../ui/Inputs/InputSwitch';
import Button from '../ui/Buttons/Button';
import Title from '../ui/Titles/Title';
import InfoCard from '../ui/Card/InfoCard';
import useDifficultySelector from '../../hooks/useDifficultySelector';
import { useNavigate } from 'react-router-dom';

const OfflineCard = () => {
  const navigate = useNavigate();
  const {
    difficulty,
    invisiblePieces,
    setInvisiblePieces,
    increasedGravity,
    setIncreasedGravity,
    piecePrediction,
    setPiecePrediction,
  } = useDifficultySelector();

  const handlePlayClick = () => {
    navigate('/offline', {
      state: {
        piecePrediction,
        invisiblePieces,
        increasedGravity,
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title>Solo Play</Title>
        <p className={styles.subtitle}>Challenge yourself in offline mode</p>
      </div>

      <div className={styles.options}>
        <InfoCard>
          <div className={styles.optionInfo}>
            <label className={styles.optionLabel}>Shadow Piece</label>
            <span className={styles.optionDescription}>
              Shows a preview of where the piece will land
            </span>
          </div>
          <InputSwitch
            checked={piecePrediction}
            onChange={() => setPiecePrediction(!piecePrediction)}
            className={styles.switch}
          />
        </InfoCard>

        <InfoCard>
          <div className={styles.optionInfo}>
            <label className={styles.optionLabel}>Invisible Pieces</label>
            <span className={styles.optionDescription}>
              Pieces become invisible after placement
            </span>
          </div>
          <InputSwitch
            checked={invisiblePieces}
            onChange={() => setInvisiblePieces(!invisiblePieces)}
            className={styles.switch}
          />
        </InfoCard>

        <InfoCard>
          <div className={styles.optionInfo}>
            <label className={styles.optionLabel}>Increased Gravity</label>
            <span className={styles.optionDescription}>
              Pieces fall faster for extra challenge
            </span>
          </div>
          <InputSwitch
            checked={increasedGravity}
            onChange={() => setIncreasedGravity(!increasedGravity)}
            className={styles.switch}
          />
        </InfoCard>
      </div>

      <div
        className={`${styles.difficultyInfo} ${difficulty.color === 'hard' ? styles.hardDifficulty : ''}`}
      >
        <div className={styles.difficultyLabel}>Difficulty Level</div>
        <div
          className={`${styles.difficultyValue} ${styles[difficulty.color + 'Text']}`}
        >
          {difficulty.level}
        </div>
        <div className={styles.difficultyBar}>
          <div
            className={`${styles.difficultyProgress} ${styles[difficulty.color]}`}
            style={{ width: `${difficulty.progress}%` }}
          ></div>
        </div>
      </div>

      <div className={styles.playSection}>
        <Button
          variant="play"
          size="large"
          onClick={handlePlayClick}
          className={styles.playButton}
        >
          <span className={styles.playIcon}>▶</span>
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default OfflineCard;
