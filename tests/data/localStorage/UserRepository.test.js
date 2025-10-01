import { createUserRepository } from '../../../src/data/localStorage/UserRepository';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.fn();
console.error = mockConsoleError;

describe('UserRepository', () => {
  let userRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    userRepository = createUserRepository();
  });

  describe('loadUsernameFromStorage', () => {
    test('should return stored username', () => {
      mockLocalStorage.setItem('username', 'testuser');

      const result = userRepository.loadUsernameFromStorage();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('username');
      expect(result).toBe('testuser');
    });

    test('should return empty string when no username stored', () => {
      const result = userRepository.loadUsernameFromStorage();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('username');
      expect(result).toBe('');
    });

    test('should handle localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = userRepository.loadUsernameFromStorage();

      expect(result).toBe('');
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error loading username from localStorage:',
        expect.any(Error)
      );
    });

    test('should handle null values from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = userRepository.loadUsernameFromStorage();

      expect(result).toBe('');
    });
  });

  describe('saveUsernameToStorage', () => {
    test('should save username to localStorage', () => {
      const username = 'testuser';

      userRepository.saveUsernameToStorage(username);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('username', username);
    });

    test('should remove username when empty string provided', () => {
      userRepository.saveUsernameToStorage('');

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('username');
    });

    test('should remove username when null provided', () => {
      userRepository.saveUsernameToStorage(null);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('username');
    });

    test('should remove username when undefined provided', () => {
      userRepository.saveUsernameToStorage(undefined);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('username');
    });

    test('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => userRepository.saveUsernameToStorage('testuser')).not.toThrow();
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error saving username to localStorage:',
        expect.any(Error)
      );
    });

    test('should handle removeItem errors gracefully', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => userRepository.saveUsernameToStorage('')).not.toThrow();
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error saving username to localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('loadAvatarFromStorage', () => {
    test('should return stored avatar', () => {
      const customAvatar = 'custom-avatar.webp';
      mockLocalStorage.getItem.mockReturnValue(customAvatar);

      const result = userRepository.loadAvatarFromStorage();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('avatar');
      expect(result).toBe(customAvatar);
    });

    test('should return default avatar when no avatar stored', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = userRepository.loadAvatarFromStorage();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('avatar');
      expect(result).toBe('assets/avatars/default.webp');
    });

    test('should handle localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = userRepository.loadAvatarFromStorage();

      expect(result).toBe('assets/avatars/default.webp');
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error loading avatar from localStorage:',
        expect.any(Error)
      );
    });

    test('should handle null values from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = userRepository.loadAvatarFromStorage();

      expect(result).toBe('assets/avatars/default.webp');
    });
  });

  describe('saveAvatarToStorage', () => {
    test('should save avatar to localStorage', () => {
      const avatar = 'new-avatar.webp';

      userRepository.saveAvatarToStorage(avatar);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('avatar', avatar);
    });

    test('should remove avatar when empty string provided', () => {
      userRepository.saveAvatarToStorage('');

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('avatar');
    });

    test('should remove avatar when null provided', () => {
      userRepository.saveAvatarToStorage(null);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('avatar');
    });

    test('should remove avatar when undefined provided', () => {
      userRepository.saveAvatarToStorage(undefined);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('avatar');
    });

    test('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => userRepository.saveAvatarToStorage('avatar.webp')).not.toThrow();
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error saving avatar to localStorage:',
        expect.any(Error)
      );
    });

    test('should handle removeItem errors gracefully', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => userRepository.saveAvatarToStorage('')).not.toThrow();
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error saving avatar to localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('createUserRepository', () => {
    test('should return repository object with all methods', () => {
      const repo = createUserRepository();

      expect(repo).toHaveProperty('loadUsernameFromStorage');
      expect(repo).toHaveProperty('saveUsernameToStorage');
      expect(repo).toHaveProperty('loadAvatarFromStorage');
      expect(repo).toHaveProperty('saveAvatarToStorage');

      expect(typeof repo.loadUsernameFromStorage).toBe('function');
      expect(typeof repo.saveUsernameToStorage).toBe('function');
      expect(typeof repo.loadAvatarFromStorage).toBe('function');
      expect(typeof repo.saveAvatarToStorage).toBe('function');
    });

    test('should be exported correctly', () => {
      expect(createUserRepository).toBeDefined();
      expect(typeof createUserRepository).toBe('function');
    });

    test('should create independent repository instances', () => {
      const repo1 = createUserRepository();
      const repo2 = createUserRepository();

      expect(repo1).not.toBe(repo2);
      expect(repo1.loadUsernameFromStorage).not.toBe(repo2.loadUsernameFromStorage);
    });
  });

  describe('DEFAULT_AVATAR constant', () => {
    test('should use correct default avatar path', () => {
      const result = userRepository.loadAvatarFromStorage();
      expect(result).toBe('assets/avatars/default.webp');
    });
  });

  describe('edge cases', () => {
    test('should handle whitespace-only usernames', () => {
      userRepository.saveUsernameToStorage('   ');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('username', '   ');
    });

    test('should handle special characters in usernames', () => {
      const specialUsername = 'user@#$%^&*()';
      userRepository.saveUsernameToStorage(specialUsername);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('username', specialUsername);
    });

    test('should handle special characters in avatar paths', () => {
      const specialAvatar = 'avatars/special@avatar.webp';
      userRepository.saveAvatarToStorage(specialAvatar);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('avatar', specialAvatar);
    });

    test('should handle very long usernames', () => {
      const longUsername = 'a'.repeat(1000);
      userRepository.saveUsernameToStorage(longUsername);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('username', longUsername);
    });
  });
});