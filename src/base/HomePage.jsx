import styles from './HomePage.module.css';
import Card from '../components/ui/Card/Card';
import UserCard from '../components/cards/UserCard';
import OfflineCard from '../components/cards/OfflineCard';
import { useAppSelector } from '../store/hooks';
import { selectUsername } from '../store/slices/userSlice';
import HomePageBg from '../components/ui/Backgrounds/HomePageBg';
import OnlineCard from '../components/cards/OnlineCard';

const HomePage = () => {
  const username = useAppSelector(selectUsername);

  return (
    <div className={`${styles.content} flex flex-col h-full`}>
      <HomePageBg />
      {!username && ( // TODO: Design a card to welcome new users
        <div className="container mx-auto flex-none h-1/6 p-8 pb-0">
          <Card className="">Welcome, set a username and invite others to play</Card>
        </div>
      )}
      <div className={`${styles.grid} container grid mx-auto grid-cols-3 row-span-10 gap-8 flex-1 pt-8 pb-1 w-full`}>
        <div className={`${styles.userCardContainer} grid grid-rows-7 gap-4`}>
          <Card className="row-span-2">
            <UserCard />
          </Card>
          <Card className={`${styles.historyCard} row-span-5`}>History of matches here</Card>
        </div>
        <Card isUsernameRequired={true}>
          <OfflineCard />
        </Card>
        <Card isUsernameRequired={true}>
          <OnlineCard />
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
