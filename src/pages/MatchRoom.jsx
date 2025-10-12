import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Buttons/Button";
import useAudioManager from "../hooks/useAudioManager";
import styles from './MatchRoom.module.css'
import Card from "../components/ui/Card/Card";
import Countdown from "../components/ui/Countdown/Countdown";

const MatchRoom = () => {
    const { roomId, host } = useParams();
    const [gameStarted, setGameStarted] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const { isPlaying, play, pause, startGameTransition } = useAudioManager(false);

    const handleStartGame = () => {
        setShowCountdown(true);
        startGameTransition();
    };

    const handleCountdownComplete = () => {
        setShowCountdown(false);
        setGameStarted(true);
    };

    return (
        <div className={`${styles.content} flex flex-col h-full`}>
            <div className="container mx-auto grid grid-cols-3 row-span-10 gap-8 flex-1 p-8">
                <div className="grid grid-rows-7 gap-4">
                    <Card className="row-span-3">
                        <div>Room: {roomId}</div>
                        <Button variant="play" onClick={handleStartGame}>Start game</Button>
                        <Button onClick={isPlaying ? pause : play} icon={isPlaying ? 'pi pi-volume-up' : 'pi pi-volume-off'}></Button>
                    </Card>
                    <Card className="row-span-4">
                        List of players
                    </Card>
                </div>
            </div>
            <Countdown 
                isVisible={showCountdown} 
                onComplete={handleCountdownComplete} 
            />
        </div>
    );
};

export default MatchRoom;