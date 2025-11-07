import { useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
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

const OfflineMatchRoom = () => {
  const [showCountdown, setShowCountdown] = useState(true);
  const [match, setMatch] = useState(null);
  const matchService = useRef(createMatchService()).current;
  const isCreatingMatch = useRef(false);

  const { isPlaying, play, pause, startGameTransition } = useAudioManager(true);
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const { piecePrediction, increasedGravity, invisiblePieces } =
    location.state || {};

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
  } = useGameState({ initialLevel: 1, matchId: match?.id });

  const { updateMatch, saveMatchImmediate } = useMatchPersistence(match?.id);

  const handleCountdownComplete = async () => {
    if (match || isCreatingMatch.current) return;

    isCreatingMatch.current = true;
    const matchData = await matchService.createMatch({
      type: 'offline',
      user,
      piecePrediction,
      increasedGravity,
      invisiblePieces,
    });
    setMatch(matchData);
    setShowCountdown(false);
    startGameTransition();
  };

  const handlePieceLocked = useCallback(
    (tetrisGameState) => {
      if (!match) return;

      const fullMatchState = {
        ...getGameState(),
        ...tetrisGameState,
      };

      updateMatch(fullMatchState);
    },
    [match, getGameState, updateMatch]
  );

  const handleGameOver = useCallback(async () => {
    if (!match) return;

    const finalState = {
      ...getGameState(),
      gameOver: true,
      endedAt: new Date().toISOString(),
    };

    await saveMatchImmediate(finalState);
  }, [match, getGameState, saveMatchImmediate]);

  return (
    <div className={`${styles.content} flex flex-col h-full`}>
      <Countdown
        isVisible={showCountdown}
        onComplete={handleCountdownComplete}
      />
      <div className="container mx-auto grid grid-cols-3 row-span-10 gap-8 flex-1 p-8">
        <div className="grid grid-rows-7 gap-4">
          <Card className="row-span-3">
            <Button
              onClick={isPlaying ? pause : play}
              icon={isPlaying ? 'pi pi-volume-up' : 'pi pi-volume-off'}
            ></Button>
          </Card>
          <Card className="row-span-4">
            <p>Match ID: {match?.id}</p>
            <p>Score: {score}</p>
            <p>Level: {level}</p>
            <p>Rows Cleared: {rowsCleared}</p>
          </Card>
        </div>
        <GameCard
          player={user}
          setScore={setScore}
          level={level}
          setLevel={setLevel}
          setRowsCleared={setRowsCleared}
          gameOver={gameOver}
          setGameOver={setGameOver}
          startGame={!showCountdown}
          piecePrediction={piecePrediction}
          increasedGravity={increasedGravity}
          invisiblePieces={invisiblePieces}
          onPieceLocked={handlePieceLocked}
          onGameOver={handleGameOver}
        />
      </div>
    </div>
  );
};

export default OfflineMatchRoom;
