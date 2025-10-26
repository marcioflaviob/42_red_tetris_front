import { useState } from "react"
import Countdown from "../components/ui/Countdown/Countdown";
import styles from './MatchRoom.module.css'
import Card from "../components/ui/Card/Card";
import Button from "../components/ui/Buttons/Button";
import GameCard from "../components/cards/OfflineGameCard";
import useAudioManager from "../hooks/useAudioManager";
import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/slices/userSlice";

const OfflineMatchRoom = () => {
    const [showCountdown, setShowCountdown] = useState(false);
    const { isPlaying, play, pause, startGameTransition } = useAudioManager(true);
    const user = useAppSelector(selectUser);

    const handleCountdownComplete = () => {
        setShowCountdown(false);
        startGameTransition();
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
                        <Button onClick={isPlaying ? pause : play} icon={isPlaying ? 'pi pi-volume-up' : 'pi pi-volume-off'}></Button>
                    </Card>
                    <Card className="row-span-4">
                    </Card>
                </div>
                <GameCard player={user} key={user.sessionId} />
            </div>
        </div>
    )
}

export default OfflineMatchRoom;