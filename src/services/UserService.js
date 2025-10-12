import { createUserRepository } from '../data/localStorage/UserRepository';
import { createMatchesRepository } from '../data/indexedDB/MatchesRepository';

const createUserService = (
  userRepo = createUserRepository(),
  matchesRepo = createMatchesRepository()
) => {
  const getUsername = () => {
    return userRepo.loadUsernameFromStorage();
  };

  const saveUsername = (username) => {
    return userRepo.saveUsernameToStorage(username);
  };

  const getAvatar = () => {
    return userRepo.loadAvatarFromStorage();
  };

  const saveAvatar = (avatar) => {
    return userRepo.saveAvatarToStorage(avatar);
  };

  const getMatches = async () => {
    return await matchesRepo.getMatches();
  };

  const getSessionId = () => {
    return userRepo.loadSessionIdFromStorage();
  };

  return {
    getUsername,
    saveUsername,
    getAvatar,
    saveAvatar,
    getMatches,
    getSessionId
  };
};

export { createUserService };
