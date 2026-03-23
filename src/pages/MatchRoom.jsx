import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Buttons/Button';
import useAudioManager from '../hooks/useAudioManager';
import styles from './MatchRoom.module.css';
import Card from '../components/ui/Card/Card';
import Countdown from '../components/ui/Countdown/Countdown';
import { useAppSelector } from '../store/hooks';
import { useJoinRoomMutation } from '../store/slices/apiSlice';
import useSocket from '../hooks/useSocket';
import { socketService } from '../services/SocketService';
import { selectUser } from '../store/slices/userSlice';
import GameCard from '../components/cards/OfflineGameCard';
import OnlineGameCard from '../components/cards/OnlineGameCard';
import HomePageBg from '../components/ui/Backgrounds/HomePageBg';
import useGameState from '../hooks/useGameState';
import useMatchPersistence from '../hooks/useMatchPersistence';
import DebugServerGameCard from '../components/cards/DebugServerGameCard';
import MatchStats from '../components/cards/MatchStats';

const MatchRoom = () => {
  const {
    roomId,
    // host
  } = useParams();
  const [gameStarted, setGameStarted] = useState(false);
  const user = useAppSelector(selectUser);
  const [players, setPlayers] = useState([user]);
  const opponents = players.filter((player) => player.sessionId !== user.sessionId);
  const [showCountdown, setShowCountdown] = useState(false);
  const { isPlaying, play, pause, startGameTransition } = useAudioManager(false);
  const navigate = useNavigate();
  const [joinRoom, { data: roomData, isSuccess, error, isError }] = useJoinRoomMutation();
  const {
    emit,
    // on,
    // off,
    isConnected,
  } = useSocket();

  const { setScore, level, setLevel, setRowsCleared, gameOver, setGameOver, getGameState } = useGameState({
    initialLevel: 1,
    matchId: roomId,
  });

  const { updateMatch, saveMatchImmediate } = useMatchPersistence(roomId);

  useEffect(() => {
    if (isError && error) {
      navigate('/error', {
        state: {
          error,
        },
      });
    }
  }, [isError, error, navigate]);

  const addPlayerIfNotExists = useCallback((player) => {
    setPlayers((prev) => {
      // Check if player already exists in current state
      if (prev.some((savedPlayer) => savedPlayer.sessionId === player.sessionId)) {
        return prev; // Player already exists, don't add
      }
      return [...prev, player];
    });
  }, []);

  const onRoomUpdate = useCallback(
    (data) => {
      switch (data.type) {
        case 'player_joined':
          addPlayerIfNotExists(data.player);
          break;
        case 'game_started':
          setShowCountdown(false);
          setGameStarted(true);
          startGameTransition();
          break;
        default:
          break;
      }
    },
    [addPlayerIfNotExists, startGameTransition]
  );

  useEffect(() => {
    if (roomId && isConnected) {
      socketService.on('room_update', onRoomUpdate);
      joinRoom({ user, roomId });
    }

    return () => {
      socketService.off('room_update', onRoomUpdate);
    };
    // TODO: remove eslint disable after fixing dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, joinRoom, isConnected]);

  useEffect(() => {
    if (isSuccess && roomData) {
      setPlayers(roomData.players);
    }
  }, [roomData, isSuccess]);

  const handleStartGame = () => {
    emit('start_game', { roomId });
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setGameStarted(true);
    // TODO update startedAt
  };

  const handlePieceLocked = useCallback(
    (tetrisGameState) => {
      // Get opponent names (up to 4 for online matches)
      const opponentNames = opponents
        ?.slice(0, 4)
        .map((player) => player.username)
        .filter(Boolean);

      const fullMatchState = {
        ...getGameState(),
        ...tetrisGameState,
        type: 'online',
        opponentNames,
        opponentCount: opponents?.length,
      };

      updateMatch(fullMatchState);
    },
    [getGameState, updateMatch, opponents]
  );

  const handleGameOver = useCallback(async () => {
    // Get opponent names (up to 4 for online matches)
    const opponentNames = opponents
      .slice(0, 4)
      .map((player) => player.username)
      .filter(Boolean);

    const finalState = {
      ...getGameState(),
      gameOver: true,
      endedAt: new Date().toISOString(),
      type: 'online',
      opponentNames,
      opponentCount: opponents.length,
    };

    await saveMatchImmediate(finalState);
  }, [getGameState, saveMatchImmediate, opponents]);

  const getMultiplayerClassname = () => {
    const opponentsCount = players.length - 1;

    switch (opponentsCount) {
      case 0:
      case 1:
        return 'flex flex-col gap-4 h-full';
      case 2:
        return 'grid grid-cols-2 gap-4 h-full';
      default:
        return 'grid grid-rows-2 grid-cols-2 gap-4 h-full';
    }
  };

  const hostPlayer = players.find((player) => player.host);
  const isHost = Boolean(hostPlayer && hostPlayer.sessionId === user.sessionId);

  return (
    <div className={`${styles.content} flex flex-col h-screen overflow-hidden`}>
      <HomePageBg />
      <Countdown isVisible={showCountdown} onComplete={handleCountdownComplete} />
      <div className="container mx-auto grid grid-cols-3 gap-8 flex-1 p-8 min-h-0 overflow-hidden">
        <div className="flex flex-col gap-4 min-h-0 overflow-hidden">
          {/* Match Stats Card with integrated player list */}
          <Card className="flex-shrink-0 p-0">
            <MatchStats
              roomId={roomId}
              playerCount={players.length}
              hostName={hostPlayer?.username || 'Unknown'}
              onStartGame={handleStartGame}
              isHost={isHost}
              gameStarted={gameStarted}
              players={players}
              currentUser={user}
            />
          </Card>

          {/* Audio Toggle */}
          <div className="flex-shrink-0">
            <Button
              onClick={isPlaying ? pause : play}
              icon={isPlaying ? 'pi pi-volume-up' : 'pi pi-volume-off'}
              className="w-full">
              {isPlaying ? 'Mute' : 'Unmute'}
            </Button>
          </div>
        </div>
        <div className="min-h-0 overflow-hidden">
          <GameCard
            player={user}
            setScore={setScore}
            level={level}
            setLevel={setLevel}
            setRowsCleared={setRowsCleared}
            gameOver={gameOver}
            setGameOver={setGameOver}
            startGame={gameStarted}
            matchData={roomData}
            onPieceLocked={handlePieceLocked}
            onGameOver={handleGameOver}
            emit={emit}
            onGameStateChange={(state) => {
              emit('game-update', state);
            }}
          />
        </div>
        <div className={`${getMultiplayerClassname()} min-h-0 overflow-hidden`}>
          {/* <div className="min-h-0 overflow-hidden flex-1">
            <OnlineGameCard
              player={user}
              matchData={roomData}
              startGame={gameStarted}
              compact={players.length >= 3}
              playerCount={players.length}
            />
          </div>
          <div className="min-h-0 overflow-hidden flex-1">
            <DebugServerGameCard 
              player={user} 
              compact={players.length >= 3}
              playerCount={players.length}
            />
          </div> */}
          {opponents.map((player) => {
            const opponentCount = opponents.length;

            return (
              <div
                key={player.sessionId}
                className={`min-h-0 overflow-hidden ${opponentCount === 1 ? 'h-full flex-1' : 'h-full'}`}>
                <OnlineGameCard
                  player={player}
                  matchData={roomData}
                  startGame={gameStarted}
                  compact={players.length >= 3}
                  playerCount={players.length}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchRoom;
