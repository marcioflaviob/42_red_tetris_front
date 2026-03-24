import styles from './HomePage.module.css';
import Card from '../components/ui/Card/Card';
import UserCard from '../components/cards/UserCard';
import OfflineCard from '../components/cards/OfflineCard';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../store/slices/userSlice';
import HomePageBg from '../components/ui/Backgrounds/HomePageBg';
import OnlineCard from '../components/cards/OnlineCard';
import { useGetHealthQuery } from '../store/slices/apiSlice';
import MatchHistory from '../components/cards/MatchHistory';

const HomePage = () => {
  const user = useAppSelector(selectUser);
  const { error, isLoading } = useGetHealthQuery();

  return (
    <div className={`${styles.content} flex flex-col h-full`}>
      <HomePageBg />
      {!user?.username && ( // TODO: Design a card to welcome new users
        <div className="container mx-auto flex-none h-1/6 pt-8 pb-0">
          <Card className="">Welcome, set a username and invite others to play</Card>
        </div>
      )}
      <div className={`${styles.grid} container grid mx-auto grid-cols-3 gap-8 flex-1 pt-8 pb-8 w-full min-h-0`}>
        <div className={`${styles.userCardContainer} grid grid-rows-12 gap-4 min-h-0`}>
          <Card className={`row-span-3`}>
            <UserCard />
          </Card>
          <Card className={`${styles.historyCard} row-span-9 flex flex-col min-h-0`}>
            <MatchHistory />
          </Card>
        </div>
        <Card isUsernameRequired={true} className="min-h-0 h-full">
          <OfflineCard />
        </Card>
        <Card
          isUsernameRequired={true}
          greyScale={error}
          message="Multiplayer not available"
          loading={isLoading}
          className="min-h-0 h-full">
          <OnlineCard />
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
