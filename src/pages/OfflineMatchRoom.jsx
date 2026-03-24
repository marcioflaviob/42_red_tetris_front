import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Countdown from '../components/ui/Countdown/Countdown';
import styles from './MatchRoom.module.css';
import statsStyles from '../components/cards/MatchStats.module.css';
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

const OfflineMatchRoom = () => {
  const [showCountdown, setShowCountdown] = useState(true);
  const [match, setMatch] = useState(null);
  const matchService = useRef(createMatchService()).current;
  const isCreatingMatch = useRef(false);
  const { isPlaying, play, pause, startGameTransition } = useAudioManager(false);
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const { piecePrediction, increasedGravity, invisiblePieces } = location.state || {};

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
    if (!match || !isCreatingMatch.current) {
      createMatch();
    }
  }, [createMatch, match]);

  const handleCountdownComplete = async () => {
    setShowCountdown(false);
    startGameTransition();
  };

  const handlePieceLocked = useCallback(
    (tetrisGameState) => {
      if (!match) return;

      const fullMatchState = {
        ...getGameState(),
        ...tetrisGameState,
        type: 'offline',
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
      type: 'offline',
    };

    await saveMatchImmediate(finalState);
  }, [match, getGameState, saveMatchImmediate]);

  return (
    <div className={`${styles.content} flex flex-col h-full`}>
      <HomePageBg />
      <Countdown isVisible={showCountdown} onComplete={handleCountdownComplete} />
      <div className={`${styles.content} container mx-auto grid grid-cols-3 row-span-10 gap-8 flex-1 p-8`}>
        <div className="grid grid-rows-7 gap-4">
          <div className="row-span-1 flex items-center px-2">
            <button
              onClick={isPlaying ? pause : play}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-300 group ${
                isPlaying
                  ? 'bg-green-500/10 border-green-500/40 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                  : 'bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              } hover:scale-105 active:scale-95`}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  isPlaying ? 'bg-green-500/20' : 'bg-blue-500/20'
                } group-hover:animate-pulse`}>
                <i className={`${isPlaying ? 'pi pi-volume-up' : 'pi pi-volume-off'} text-lg`}></i>
              </div>
              <span className="font-semibold tracking-wide uppercase text-xs">
                {isPlaying ? 'Now Playing' : 'Play Music'}
              </span>
            </button>
          </div>
          <div className={`${statsStyles.statsContainer} row-span-6`}>
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
        <GameCard
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
      </div>
    </div>
  );
};

export default OfflineMatchRoom;
