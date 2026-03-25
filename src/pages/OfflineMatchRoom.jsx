import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Countdown from '../components/ui/Countdown/Countdown';
import styles from './MatchRoom.module.css';
import statsStyles from '../components/cards/MatchStats.module.css';
import GameCard from '../components/cards/OfflineGameCard';
import MatchTopControls from '../components/cards/MatchTopControls';
import useAudioManager from '../hooks/useAudioManager';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../store/slices/userSlice';
import { createMatchService } from '../services/MatchService';
import useGameState from '../hooks/useGameState';
import useMatchPersistence from '../hooks/useMatchPersistence';
import HomePageBg from '../components/ui/Backgrounds/HomePageBg';
import MatchEndOverlay from '../components/ui/MatchEndOverlay/MatchEndOverlay';

// Inner component — fully remounted on every "Play Again" via key={gameKey} in parent.
// This resets all hooks (match, board, score, game state) without any manual state cleanup.
const OfflineGame = ({
  user,
  piecePrediction,
  increasedGravity,
  invisiblePieces,
  startGameTransition,
  onGameOver,
  onBackToMenu,
  isPlaying,
  play,
  pause,
}) => {
  const [showCountdown, setShowCountdown] = useState(true);
  const [match, setMatch] = useState(null);
  const matchService = useRef(createMatchService()).current;
  const isCreatingMatch = useRef(false);

  const {
    score,
    setScore,
    level,
    setLevel,
    rowsCleared,
    setRowsCleared,
    gameOver,
    setGameOver,
    getGameState,
    setAccuracy,
    accuracy,
  } = useGameState({ initialLevel: 1, matchId: match?.id });

  const { updateMatch, saveMatchImmediate } = useMatchPersistence(match?.id);

  const createMatch = useCallback(async () => {
    isCreatingMatch.current = true;
    const matchData = await matchService.createMatch({
      type: 'offline',
      user,
      piecePrediction,
      increasedGravity,
      invisiblePieces,
    });
    setMatch(matchData);
  }, [increasedGravity, invisiblePieces, matchService, piecePrediction, user]);

  useEffect(() => {
    if (!match && !isCreatingMatch.current) {
      createMatch();
    }
  }, [createMatch, match]);

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    startGameTransition();
  };

  const handlePieceLocked = useCallback(
    (tetrisGameState) => {
      if (!match) return;
      updateMatch({ ...getGameState(), ...tetrisGameState, type: 'offline' });
    },
    [match, getGameState, updateMatch]
  );

  const handleGameOver = useCallback(async () => {
    if (!match) return;
    await saveMatchImmediate({
      ...getGameState(),
      gameOver: true,
      endedAt: new Date().toISOString(),
      type: 'offline',
    });
    onGameOver();
  }, [match, getGameState, saveMatchImmediate, onGameOver]);

  return (
    <>
      <Countdown isVisible={showCountdown} onComplete={handleCountdownComplete} />
      <div className={`${styles.content} container mx-auto grid grid-cols-3 row-span-10 gap-8 flex-1 pt-8 pb-1`}>
        <div>
          <div className={statsStyles.statsContainer}>
            <MatchTopControls
              className="mb-1"
              onBackToMenu={onBackToMenu}
              isPlaying={isPlaying}
              onToggleAudio={isPlaying ? pause : play}
            />
            <div className={statsStyles.header}>
              <h2 className={statsStyles.title}>Match Info</h2>
              <div className={statsStyles.statusBadge} data-status={!gameOver ? 'running' : 'waiting'}>
                {!gameOver ? 'Live' : 'Game Over'}
              </div>
            </div>
            <div className={`${statsStyles.infoGrid} mt-4`}>
              <div className={statsStyles.infoItem}>
                <span className={statsStyles.label}>Score</span>
                <span className={statsStyles.value}>{score}</span>
              </div>
              <div className={statsStyles.infoItem}>
                <span className={statsStyles.label}>Accuracy</span>
                <span className={statsStyles.value}>{accuracy}%</span>
              </div>
              <div className={statsStyles.infoItem}>
                <span className={statsStyles.label}>Level</span>
                <span className={statsStyles.value}>{level}</span>
              </div>
              <div className={statsStyles.infoItem}>
                <span className={statsStyles.label}>Lines</span>
                <span className={statsStyles.value}>{rowsCleared}</span>
              </div>
            </div>
          </div>
        </div>
        {match && (
          <GameCard
            key={match.id}
            player={user}
            setScore={setScore}
            level={level}
            setLevel={setLevel}
            setRowsCleared={setRowsCleared}
            gameOver={gameOver}
            setGameOver={setGameOver}
            startGame={!showCountdown}
            matchData={match}
            onPieceLocked={handlePieceLocked}
            onGameOver={handleGameOver}
            setAccuracy={setAccuracy}
          />
        )}
      </div>
    </>
  );
};

// Outer shell — persists for the lifetime of the /offline route.
// Manages the overlay and the gameKey used to remount OfflineGame.
const OfflineMatchRoom = () => {
  const [gameKey, setGameKey] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();
  const { isPlaying, play, pause, startGameTransition } = useAudioManager(false);
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const { piecePrediction, increasedGravity, invisiblePieces } = location.state || {};

  const handlePlayAgain = useCallback(() => {
    setShowOverlay(false);
    setGameKey((k) => k + 1);
  }, []);

  return (
    <div className={`${styles.content} flex flex-col h-full`}>
      <HomePageBg />
      {showOverlay && (
        <MatchEndOverlay
          mode="offline"
          currentUser={user}
          isHost={true}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={() => navigate('/')}
        />
      )}
      <OfflineGame
        key={gameKey}
        user={user}
        piecePrediction={piecePrediction}
        increasedGravity={increasedGravity}
        invisiblePieces={invisiblePieces}
        startGameTransition={startGameTransition}
        onGameOver={() => setShowOverlay(true)}
        onBackToMenu={() => navigate('/')}
        isPlaying={isPlaying}
        play={play}
        pause={pause}
      />
    </div>
  );
};

export default OfflineMatchRoom;
