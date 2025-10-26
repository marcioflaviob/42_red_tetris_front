import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Buttons/Button";
import useAudioManager from "../hooks/useAudioManager";
import styles from './MatchRoom.module.css'
import Card from "../components/ui/Card/Card";
import Avatar from "../components/ui/Avatar/Avatar";
import Countdown from "../components/ui/Countdown/Countdown";
import { useAppSelector } from "../store/hooks";
import { useDispatch } from "react-redux";
import { useJoinRoomMutation } from "../store/slices/apiSlice";
import useSocket from "../hooks/useSocket";
import { socketService } from '../services/SocketService';
import { selectUser } from "../store/slices/userSlice";
import GameCard from "../components/cards/OnlineGameCard";

const MatchRoom = () => {
    const dispatch = useDispatch();
    const { roomId, host } = useParams();
    const [gameStarted, setGameStarted] = useState(false);
    const user = useAppSelector(selectUser);
    const [players, setPlayers] = useState([user]);
    const [showCountdown, setShowCountdown] = useState(false);
    const { isPlaying, play, pause, startGameTransition } = useAudioManager(true);
    const [joinRoom, { data: roomData, isSuccess }] = useJoinRoomMutation();
    const { emit, on, off, isConnected } = useSocket();

    const addPlayerIfNotExists = (player) => {
        if (!players.some(savedPlayer => savedPlayer.sessionId === player.sessionId)) {
            setPlayers(prev => [...prev, player]);
        }
    }

    const onRoomUpdate = (data) => {
        // console.log("Message received", data);
        switch (data.type) {
            case 'player_joined':
                addPlayerIfNotExists(data.player);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (roomId && isConnected) {
            // console.log(roomId);
            socketService.on('room_update', onRoomUpdate);
            // console.log("Sending user", user);
            joinRoom({user, roomId});
        }
    }, [roomId, joinRoom, isConnected]);

    useEffect(() => {
        // console.log("hereeeee", isSuccess, roomData);
        if (isSuccess && roomData) {
            // console.log("Setting players here with", roomData);
            setPlayers(roomData.players);
        }
    }, [roomData, isSuccess])

    const handleStartGame = () => {
        setShowCountdown(true);
        startGameTransition();
    };

    const handleCountdownComplete = () => {
        setShowCountdown(false);
        setGameStarted(true);
    };

    useEffect(() => {
        // console.log("players", players);
    }, [players])

    const increasePlayers = (add) => {
        if (add) {
            const num = Math.floor(Math.random() * 1000);
            const player = {
                sessionId: num,
                username: `user${num}`,
                avatar: '/assets/avatars/default.webp',
                fake: true
            }
            setPlayers(prev => [...prev, player]);
        } else {
            setPlayers(prev => {
            const idx = prev.findIndex(p => p.fake);
            if (idx === -1) return prev;
            return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        });
        }
    }

    const getMultiplayerClassname = () => {
        switch (players.length) {
            case 2:
                return '';
            case 3:
                return 'grid grid-rows-2 gap-4';
            default:
                return 'grid grid-rows-2 grid-cols-2 gap-4'
        }
    }

    return (
        <div className={`${styles.content} flex flex-col h-full`}>
            <Countdown 
                isVisible={showCountdown} 
                onComplete={handleCountdownComplete} 
            />
            <div className="container mx-auto grid grid-cols-3 row-span-10 gap-8 flex-1 p-8">
                <div className="grid grid-rows-7 gap-4">
                    <Card className="row-span-3">
                        <div>Room: {roomId}</div>
                        <Button variant="play" onClick={handleStartGame}>Start game</Button>
                        <Button onClick={isPlaying ? pause : play} icon={isPlaying ? 'pi pi-volume-up' : 'pi pi-volume-off'}></Button>
                        <div>
                            Number of players {players.length}
                            <Button onClick={() => increasePlayers(false)}>-</Button>
                            <Button onClick={() => increasePlayers(true)}>+</Button>
                        </div>
                    </Card>
                    <Card className="row-span-4">
                        List of players
                        {players.map((player) => {
                            // console.log("rendering player", player)
                            return (
                            <div key={player.sessionId}>
                                <Avatar avatar={player.avatar} />
                                {player.username} {player.host ? 'HOST' : ''}
                            </div>
                        )})}
                    </Card>
                </div>
                <GameCard player={user} key={user.sessionId} />
                <div className={getMultiplayerClassname()}>
                    {players.map(player => {
                        if (player.sessionId !== user.sessionId) {
                            return (
                                <GameCard player={player} key={player.sessionId} />
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export default MatchRoom;