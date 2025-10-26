import Avatar from '../ui/Avatar/Avatar';
import Card from '../ui/Card/Card';
import Title from '../ui/Titles/Title';
import styles from './GameCard.module.css';

const GameCard = ({ player }) => {
  return (
    <Card>
      <Avatar avatar={player.avatar} />
      <Title>{player.username}</Title>
      <div className={styles.gameGrid}></div>
    </Card>
  );
};

export default GameCard;
