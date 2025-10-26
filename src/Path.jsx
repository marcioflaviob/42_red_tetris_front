import HomePage from './base/HomePage';
import ErrorPage from './pages/ErrorPage';
import MatchRoom from './pages/MatchRoom';
import OfflineMatchRoom from './pages/OfflineMatchRoom';

export const PATHS = [
  { path: '', component: <HomePage /> },
  { path: ':roomId', component: <MatchRoom /> },
  { path: ':roomId/:host', component: <MatchRoom /> },
  { path: 'offline', component: <OfflineMatchRoom /> },
  { path: '*', component: <ErrorPage /> },
  { path: 'error', component: <ErrorPage /> },
];
