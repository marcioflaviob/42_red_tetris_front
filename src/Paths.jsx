import HomePage from './base/HomePage';
import { KeyedMatchRoom } from './KeyedMatchRoom';
import ErrorPage from './pages/ErrorPage';
import OfflineMatchRoom from './pages/OfflineMatchRoom';

export const PATHS = [
  { path: '', component: <HomePage /> },
  { path: ':roomId', component: <KeyedMatchRoom /> },
  { path: ':roomId/:host', component: <KeyedMatchRoom /> },
  { path: 'offline', component: <OfflineMatchRoom /> },
  { path: '*', component: <ErrorPage /> },
  { path: 'error', component: <ErrorPage /> },
];
