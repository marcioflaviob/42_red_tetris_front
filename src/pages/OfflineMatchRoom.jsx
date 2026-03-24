import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Countdown from '../components/ui/Countdown/Countdown';
import styles from './MatchRoom.module.css';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Buttons/Button';
import GameCard from '../components/cards/OfflineGameCard';
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
const OfflineGame = ({ user, piecePrediction, increasedGravity, invisiblePieces, startGameTransition, onGameOver }) => {
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
      <div className={`${styles.content} container mx-auto grid grid-cols-3 row-span-10 gap-8 flex-1 p-8`}>
        <div className="grid grid-rows-7 gap-4">
          <Card className="row-span-4">
            <p>Match ID: {match?.id}</p>
            <p>Score: {score}</p>
            <p>Level: {level}</p>
            <p>Rows Cleared: {rowsCleared}</p>
            <p>Accuracy: {accuracy}%</p>
          </Card>
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
      <div className="flex-shrink-0 p-4">
        <Button onClick={isPlaying ? pause : play} icon={isPlaying ? 'pi pi-volume-up' : 'pi pi-volume-off'}>
          {isPlaying ? 'Mute' : 'Unmute'}
        </Button>
      </div>
      <OfflineGame
        key={gameKey}
        user={user}
        piecePrediction={piecePrediction}
        increasedGravity={increasedGravity}
        invisiblePieces={invisiblePieces}
        startGameTransition={startGameTransition}
        onGameOver={() => setShowOverlay(true)}
      />
    </div>
  );
};

export default OfflineMatchRoom;
