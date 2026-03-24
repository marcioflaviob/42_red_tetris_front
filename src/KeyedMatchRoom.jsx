import { useParams } from 'react-router-dom';
import MatchRoom from './pages/MatchRoom';

export const KeyedMatchRoom = () => {
  const { roomId } = useParams();
  return <MatchRoom key={roomId} />;
};
