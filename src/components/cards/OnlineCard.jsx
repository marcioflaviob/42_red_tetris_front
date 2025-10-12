import { useNavigate } from "react-router-dom";
import useDifficultySelector from "../../hooks/useDifficultySelector";
import { useAppSelector } from "../../store/hooks";
import { useCreateRoomMutation } from "../../store/slices/apiSlice";
import Button from "../ui/Buttons/Button";
import InfoCard from "../ui/Card/InfoCard";
import InputSwitch from "../ui/Inputs/InputSwitch";
import Title from "../ui/Titles/Title";
import styles from './PlayCards.module.css';

const OnlineCard = () => {
	const {difficulty, invisiblePieces, setInvisiblePieces, increasedGravity, setIncreasedGravity} = useDifficultySelector();
	const [createRoom, { isLoading }] = useCreateRoomMutation();
	const user = useAppSelector(state => state.user);
	const navigate = useNavigate();

  const handleRoomCreation = async () => {
		try {
			console.log(user);
			const room = await createRoom({
				user,
				room: {
					invisiblePieces,
					increasedGravity
				}
			}).unwrap();
			navigate(`/${room.id}/${room.players[0].username}`);
		} catch (error) {
			console.error('Error creating room', error);
		}
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title>Multiplayer</Title>
        <p className={styles.subtitle}>Challenge your friends</p>
      </div>

      <div className={styles.options}>
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
          onClick={handleRoomCreation}
          className={styles.playButton}
					loading={isLoading}
        >
          <span className={styles.playIcon}>▶</span>
          Create room
        </Button>
      </div>
    </div>
  );
};

export default OnlineCard;