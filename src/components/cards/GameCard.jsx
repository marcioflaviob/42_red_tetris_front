import Avatar from "../ui/Avatar/Avatar";
import Card from "../ui/Card/Card";
import Title from "../ui/Titles/Title";
import styles from './GameCard.module.css';

const GameCard = ({player}) => {
    const ROW = 20;
    const COLS = 10;
    const BUFFER_ZONE = 2;

    const renderBoard = () => {
        const cells = [];
        for (let i = 0; i < BUFFER_ZONE * COLS; i++) {
            cells.push(
                <div className={styles.bufferZoneCell}></div>
            )
        }
        for (let i = 0; i < ROW * COLS; i++) {
            cells.push(
                <div className={styles.cell}></div>
            )
        }
        return cells;
    }

    return (
        <Card>
            <Avatar  avatar={player.avatar} />
            <Title>{player.username}</Title>
            <div className={styles.gameGrid}>
                <div className={styles.tetrisBoard}>
                    {renderBoard()}
                </div>
            </div>
        </Card>
    )
}

export default GameCard;