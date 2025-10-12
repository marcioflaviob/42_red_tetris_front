import { v4 as uuidv4 } from 'uuid';

const createUserRepository = () => {
  const DEFAULT_AVATAR = 'assets/avatars/default.webp';

  const loadUsernameFromStorage = () => {
    try {
      const username = localStorage.getItem('username');
      return username || '';
    } catch (error) {
      console.error('Error loading username from localStorage:', error);
      return '';
    }
  };

  const saveUsernameToStorage = (username) => {
    try {
      if (username) {
        localStorage.setItem('username', username);
      } else {
        localStorage.removeItem('username');
      }
    } catch (error) {
      console.error('Error saving username to localStorage:', error);
    }
  };

  const loadAvatarFromStorage = () => {
    try {
      const avatar = localStorage.getItem('avatar');
      return avatar || DEFAULT_AVATAR;
    } catch (error) {
      console.error('Error loading avatar from localStorage:', error);
      return DEFAULT_AVATAR;
    }
  };

  const saveAvatarToStorage = (avatar) => {
    try {
      if (avatar) {
        localStorage.setItem('avatar', avatar);
      } else {
        localStorage.removeItem('avatar');
      }
    } catch (error) {
      console.error('Error saving avatar to localStorage:', error);
    }
  };

  const loadSessionIdFromStorage = (avatar) => {
    let sessionId = localStorage.getItem('tetris-session-id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('tetris-session-id', sessionId);
    }
    return sessionId;
  };

  return {
    loadUsernameFromStorage,
    saveUsernameToStorage,
    loadAvatarFromStorage,
    saveAvatarToStorage,
    loadSessionIdFromStorage
  };
};

export { createUserRepository };
