import styles from './HomePage.module.css';
import Card from '../components/ui/Card/Card';
import UserCard from '../components/cards/UserCard';
import OfflineCard from '../components/cards/OfflineCard';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../store/slices/userSlice';
import HomePageBg from '../components/ui/Backgrounds/HomePageBg';
import OnlineCard from '../components/cards/OnlineCard';
import { useGetHealthQuery } from '../store/slices/apiSlice';
import MatchHistory from '../components/cards/MatchHistory';

const HomePage = () => {
  const user = useAppSelector(selectUser);
  const { error, isLoading } = useGetHealthQuery();

  return (
    <div className={`${styles.content} flex flex-col h-full`}>
      <HomePageBg />
      {!user?.username && (
        <div className={`${styles.welcomeWrapper} container mx-auto`}>
          <div className={styles.welcomeCard}>
            <div className={styles.welcomeOverlay}>
              {/* Left — pixel-art tetrominoes */}
              <div className={styles.welcomeArt}>
                {/* I-piece (cyan) */}
                <div className={`${styles.tetromino} ${styles.tetrominoI}`}>
                  {['#00cfff', '#00cfff', '#00cfff', '#00cfff'].map((c, i) => (
                    <div key={i} className={styles.tc} style={{ background: c }} />
                  ))}
                </div>
                {/* T-piece (purple) */}
                <div className={`${styles.tetromino} ${styles.tetrominoT}`}>
                  {['#a855f7', '#a855f7', '#a855f7', null, '#a855f7', null].map((c, i) => (
                    <div key={i} className={c ? styles.tc : styles.tcEmpty} style={c ? { background: c } : {}} />
                  ))}
                </div>
                {/* O-piece (yellow) */}
                <div className={`${styles.tetromino} ${styles.tetrominoO}`}>
                  {['#eab308', '#eab308', '#eab308', '#eab308'].map((c, i) => (
                    <div key={i} className={styles.tc} style={{ background: c }} />
                  ))}
                </div>
                {/* L-piece (orange) */}
                <div className={`${styles.tetromino} ${styles.tetrominoL}`}>
                  {[null, null, '#ff6b35', '#ff6b35', '#ff6b35', '#ff6b35'].map((c, i) => (
                    <div key={i} className={c ? styles.tc : styles.tcEmpty} style={c ? { background: c } : {}} />
                  ))}
                </div>
              </div>

              {/* Center — title & tagline */}
              <div className={styles.welcomeCenter}>
                <span className={styles.welcomeRedLabel}>◼ RED</span>
                <h1 className={styles.welcomeTitle}>TETRIS</h1>
                <p className={styles.welcomeTagline}>Drop · Clear · Dominate</p>
              </div>

              <div className={styles.welcomeDivider} />

              {/* Right — onboarding steps */}
              <div className={styles.welcomeRight}>
                <p className={styles.welcomeStepTitle}>Get started</p>
                <div className={`${styles.welcomeStep} ${styles.welcomeStepActive}`}>
                  <span className={`${styles.welcomeStepNum} ${styles.welcomeStepNumActive}`}>1</span>
                  Set your username &amp; avatar
                </div>
                <div className={styles.welcomeStep}>
                  <span className={styles.welcomeStepNum}>2</span>
                  Create or join a match room
                </div>
                <div className={styles.welcomeStep}>
                  <span className={styles.welcomeStepNum}>3</span>
                  Outlast every opponent
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`${styles.grid} container grid mx-auto grid-cols-3 gap-8 flex-1 pt-8 pb-1 w-full min-h-0`}>
        <div className={`${styles.userCardContainer} grid grid-rows-12 gap-4 min-h-0`}>
          <Card className={`row-span-3`}>
            <UserCard />
          </Card>
          <Card className={`${styles.historyCard} row-span-9 flex flex-col min-h-0`}>
            <MatchHistory />
          </Card>
        </div>
        <Card isUsernameRequired={true} className="min-h-0 h-full">
          <OfflineCard />
        </Card>
        <Card
          isUsernameRequired={true}
          greyScale={error}
          message="Multiplayer not available"
          loading={isLoading}
          className="min-h-0 h-full">
          <OnlineCard />
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
