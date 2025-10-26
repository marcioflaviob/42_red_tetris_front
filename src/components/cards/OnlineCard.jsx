import { useNavigate } from "react-router-dom";
import useDifficultySelector from "../../hooks/useDifficultySelector";
import { useAppSelector } from "../../store/hooks";
import { useCreateRoomMutation } from "../../store/slices/apiSlice";
import Button from "../ui/Buttons/Button";
import InfoCard from "../ui/Card/InfoCard";
import InputSwitch from "../ui/Inputs/InputSwitch";
import Title from "../ui/Titles/Title";
import styles from './PlayCards.module.css';
import { selectUser } from "../../store/slices/userSlice";
import InputText from "../ui/Inputs/InputText";
import { useState } from "react";

const OnlineCard = () => {
	const {difficulty, invisiblePieces, setInvisiblePieces, increasedGravity, setIncreasedGravity} = useDifficultySelector();
	const [createRoom, { isLoading }] = useCreateRoomMutation();
	const [roomIdInput, setRoomIdInput] = useState('');
	const [isRoomIdValid, setIsRoomIdValid] = useState(false);
	const user = useAppSelector(selectUser);
	const navigate = useNavigate();
	const roomIdPattern = /^[a-z]+-[a-z]+$/;

  const handleRoomCreation = async () => {
		try {
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

	const handleRoomIdChange = (e) => {
		setRoomIdInput(e.target.value);
		setIsRoomIdValid(roomIdPattern.test(e.target.value))
	}
	
	const handleJoinRoom = () => {
		navigate(`/${roomIdInput}`);
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
			<div className="flex items-center w-full my-4">
				<hr className="flex-1 border-t border-white/10" />
				<span className="mx-4 text-gray-400 font-medium select-none">or</span>
				<hr className="flex-1 border-t border-white/10" />
			</div>
			<p className={styles.subtitle}>Join a friend's game</p>
			<div className={styles.playSection}>
				<InputText
					value={roomIdInput}
					onChange={handleRoomIdChange}
					placeholder="Type the room ID"
				/>
				<Button
					tooltip="Room ID is invalid"
					tooltipBool={!isRoomIdValid}
					variant="play"
					className={styles.playButton}
					onClick={handleJoinRoom}
					disabled={!isRoomIdValid}
				>
					Join Room
				</Button>
			</div>
    </div>
  );
};

export default OnlineCard;