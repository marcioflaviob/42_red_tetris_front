import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Buttons/Button';
import useAudioManager from '../hooks/useAudioManager';
import styles from './MatchRoom.module.css';
import Card from '../components/ui/Card/Card';
import Countdown from '../components/ui/Countdown/Countdown';
import { useAppSelector } from '../store/hooks';
import { useJoinRoomMutation } from '../store/slices/apiSlice';
import useSocket from '../hooks/useSocket';
import { GARBAGE_LINES } from '../utils/constants';
import { socketService } from '../services/SocketService';
import { selectUser } from '../store/slices/userSlice';
import GameCard from '../components/cards/OfflineGameCard';
import OnlineGameCard from '../components/cards/OnlineGameCard';
import HomePageBg from '../components/ui/Backgrounds/HomePageBg';
import useGameState from '../hooks/useGameState';
import useMatchPersistence from '../hooks/useMatchPersistence';
import DebugServerGameCard from '../components/cards/DebugServerGameCard';
import MatchStats from '../components/cards/MatchStats';
import MatchEndOverlay from '../components/ui/MatchEndOverlay/MatchEndOverlay';

const MatchRoom = () => {
  const {
    roomId,
    // host
  } = useParams();
  const [gameStarted, setGameStarted] = useState(false);
  const [matchOver, setMatchOver] = useState(false);
  const [matchWinner, setMatchWinner] = useState(null);
  const [eliminatedIds, setEliminatedIds] = useState(new Set());
  const user = useAppSelector(selectUser);
  const [players, setPlayers] = useState([user]);
  const opponents = players.filter((player) => player.sessionId !== user.sessionId);

  // Garbage queue: target selection and addGarbage fn ref
  const [targetId, setTargetId] = useState(null);
  const addGarbageRef = useRef(null);
  const opponentsRef = useRef(opponents);
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

  const {
    score,
    setScore,
    level,
    setLevel,
    setRowsCleared,
    setAccuracy,
    accuracy,
    gameOver,
    setGameOver,
    getGameState,
  } = useGameState({
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
        case 'player_eliminated':
          setEliminatedIds((prev) => new Set([...prev, data.sessionId]));
          break;
        case 'match_over':
          setMatchOver(true);
          setMatchWinner(data.winner);
          break;
        case 'new_room':
          navigate(`/${data.roomId}`);
          break;
        default:
          break;
      }
    },
    [addPlayerIfNotExists, startGameTransition, navigate]
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

  // Keep opponentsRef in sync so Tab handler doesn't need re-registration
  useEffect(() => {
    opponentsRef.current = opponents;
  }, [opponents]);

  // Auto-select first opponent as initial target
  useEffect(() => {
    if (opponents.length > 0 && !targetId) {
      setTargetId(opponents[0].sessionId);
    }
  }, [opponents, targetId]);

  // Tab key: cycle target among opponents
  useEffect(() => {
    if (!gameStarted) return;

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;
      e.preventDefault();
      const ops = opponentsRef.current;
      if (ops.length === 0) return;
      setTargetId((prev) => {
        const currentIndex = ops.findIndex((p) => p.sessionId === prev);
        const nextIndex = (currentIndex + 1) % ops.length;
        return ops[nextIndex].sessionId;
      });
    };

    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, [gameStarted]);

  // Listen for incoming garbage lines from the server
  useEffect(() => {
    const handleGarbageQueued = ({ lines }) => {
      addGarbageRef.current?.(lines);
    };

    socketService.on('garbage-queued', handleGarbageQueued);
    return () => socketService.off('garbage-queued', handleGarbageQueued);
  }, []);

  const handleStartGame = () => {
    emit('start_game', { roomId });
  };

  // Keep a stable ref to targetId so handleLinesCleared doesn't change every render
  const targetIdRef = useRef(targetId);
  useEffect(() => {
    targetIdRef.current = targetId;
  }, [targetId]);

  // When player clears lines, send garbage to selected target
  // Uses refs for targetId and opponents to keep this callback stable
  const handleLinesCleared = useCallback(
    (lineCount) => {
      const garbageLines = GARBAGE_LINES[lineCount] ?? 0;
      if (!targetIdRef.current || garbageLines === 0 || opponentsRef.current.length === 0) return;
      emit('send-garbage', { targetId: targetIdRef.current, lines: garbageLines });
    },
    [emit]
  );

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
    emit('player-game-over');

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
  }, [emit, getGameState, saveMatchImmediate, opponents]);

  const handlePlayAgain = useCallback(() => {
    emit('play-again');
  }, [emit]);

  const getMultiplayerClassname = () => {
    const opponentsCount = players.length - 1;

    switch (opponentsCount) {
      case 0:
      case 1:
        return 'flex flex-col gap-4 h-full';
      case 2:
        return 'grid grid-rows-2 gap-4 h-full';
      default:
        return 'grid grid-rows-2 grid-cols-2 gap-4 h-full';
    }
  };

  const hostPlayer = players.find((player) => player.host);
  const isHost = Boolean(hostPlayer && hostPlayer.sessionId === user.sessionId);

  return (
    <div className={`${styles.content} flex flex-col h-screen overflow-hidden`}>
      {matchOver && (
        <MatchEndOverlay
          winner={matchWinner}
          currentUser={user}
          isHost={isHost}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={() => navigate('/')}
        />
      )}
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
              accuracy={accuracy}
              score={score}
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
        <div className="min-h-0">
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
            onLinesCleared={handleLinesCleared}
            onRegisterAddGarbage={(fn) => {
              addGarbageRef.current = fn;
            }}
            setAccuracy={setAccuracy}
          />
        </div>
        <div className={`${getMultiplayerClassname()} min-h-0`}>
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
              <div key={player.sessionId} className={`min-h-0 ${opponentCount === 1 ? 'h-full flex-1' : 'h-full'}`}>
                <OnlineGameCard
                  player={player}
                  matchData={roomData}
                  startGame={gameStarted}
                  compact={players.length >= 3}
                  playerCount={players.length}
                  isTargeted={player.sessionId === targetId}
                  setAccuracy={setAccuracy}
                  eliminated={eliminatedIds.has(player.sessionId)}
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
