import { createUserService } from '../../src/services/UserService';

const mockUserRepo = {
  loadUsernameFromStorage: jest.fn(),
  saveUsernameToStorage: jest.fn(),
  loadAvatarFromStorage: jest.fn(),
  saveAvatarToStorage: jest.fn(),
};

const mockMatchesRepo = {
  getMatches: jest.fn(),
  addMatch: jest.fn(),
  updateMatch: jest.fn(),
};

jest.mock('../../src/data/localStorage/UserRepository', () => ({
  createUserRepository: () => mockUserRepo,
}));

jest.mock('../../src/data/indexedDB/MatchesRepository', () => ({
  createMatchesRepository: () => mockMatchesRepo,
}));

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = createUserService();
  });

  test('should create service with default repositories', () => {
    expect(userService).toBeDefined();
    expect(typeof userService).toBe('object');
  });

  test('should create service with custom repositories', () => {
    const customUserRepo = { ...mockUserRepo };
    const customMatchesRepo = { ...mockMatchesRepo };
    
    const customService = createUserService(customUserRepo, customMatchesRepo);
    expect(customService).toBeDefined();
  });

  test('getUsername should call userRepo.loadUsernameFromStorage', () => {
    const expectedUsername = 'testuser';
    mockUserRepo.loadUsernameFromStorage.mockReturnValue(expectedUsername);

    const result = userService.getUsername();

    expect(mockUserRepo.loadUsernameFromStorage).toHaveBeenCalledTimes(1);
    expect(result).toBe(expectedUsername);
  });

  test('saveUsername should call userRepo.saveUsernameToStorage', () => {
    const username = 'newuser';

    userService.saveUsername(username);

    expect(mockUserRepo.saveUsernameToStorage).toHaveBeenCalledTimes(1);
    expect(mockUserRepo.saveUsernameToStorage).toHaveBeenCalledWith(username);
  });

  test('getAvatar should call userRepo.loadAvatarFromStorage', () => {
    const expectedAvatar = 'avatar.webp';
    mockUserRepo.loadAvatarFromStorage.mockReturnValue(expectedAvatar);

    const result = userService.getAvatar();

    expect(mockUserRepo.loadAvatarFromStorage).toHaveBeenCalledTimes(1);
    expect(result).toBe(expectedAvatar);
  });

  test('saveAvatar should call userRepo.saveAvatarToStorage', () => {
    const avatar = 'new-avatar.webp';

    userService.saveAvatar(avatar);

    expect(mockUserRepo.saveAvatarToStorage).toHaveBeenCalledTimes(1);
    expect(mockUserRepo.saveAvatarToStorage).toHaveBeenCalledWith(avatar);
  });

  test('getMatches should call matchesRepo.getMatches', () => {
    const expectedMatches = [{ id: 1, score: 100 }];
    mockMatchesRepo.getMatches.mockReturnValue(expectedMatches);

    const result = userService.getMatches();

    expect(mockMatchesRepo.getMatches).toHaveBeenCalledTimes(1);
    expect(result).toBe(expectedMatches);
  });

  test('should return all required methods', () => {
    expect(userService).toHaveProperty('getUsername');
    expect(userService).toHaveProperty('saveUsername');
    expect(userService).toHaveProperty('getAvatar');
    expect(userService).toHaveProperty('saveAvatar');
    expect(userService).toHaveProperty('getMatches');

    expect(typeof userService.getUsername).toBe('function');
    expect(typeof userService.saveUsername).toBe('function');
    expect(typeof userService.getAvatar).toBe('function');
    expect(typeof userService.saveAvatar).toBe('function');
    expect(typeof userService.getMatches).toBe('function');
  });

  test('saveUsername should return the result from repository', () => {
    const expectedResult = 'save_result';
    mockUserRepo.saveUsernameToStorage.mockReturnValue(expectedResult);

    const result = userService.saveUsername('testuser');

    expect(result).toBe(expectedResult);
  });

  test('saveAvatar should return the result from repository', () => {
    const expectedResult = 'save_result';
    mockUserRepo.saveAvatarToStorage.mockReturnValue(expectedResult);

    const result = userService.saveAvatar('avatar.webp');

    expect(result).toBe(expectedResult);
  });

  test('should handle null/undefined values', () => {
    userService.saveUsername(null);
    userService.saveUsername(undefined);
    userService.saveAvatar(null);
    userService.saveAvatar(undefined);

    expect(mockUserRepo.saveUsernameToStorage).toHaveBeenCalledWith(null);
    expect(mockUserRepo.saveUsernameToStorage).toHaveBeenCalledWith(undefined);
    expect(mockUserRepo.saveAvatarToStorage).toHaveBeenCalledWith(null);
    expect(mockUserRepo.saveAvatarToStorage).toHaveBeenCalledWith(undefined);
  });

  test('should handle empty string values', () => {
    userService.saveUsername('');
    userService.saveAvatar('');

    expect(mockUserRepo.saveUsernameToStorage).toHaveBeenCalledWith('');
    expect(mockUserRepo.saveAvatarToStorage).toHaveBeenCalledWith('');
  });

  test('createUserService should be exported correctly', () => {
    expect(createUserService).toBeDefined();
    expect(typeof createUserService).toBe('function');
  });

  test('should create multiple independent service instances', () => {
    const service1 = createUserService();
    const service2 = createUserService();

    expect(service1).toBeDefined();
    expect(service2).toBeDefined();
    expect(service1).not.toBe(service2);
  });

  test('should work with partially mocked repositories', () => {
    const partialUserRepo = {
      loadUsernameFromStorage: jest.fn(() => 'partial'),
      saveUsernameToStorage: jest.fn(),
      loadAvatarFromStorage: jest.fn(() => 'partial.webp'),
      saveAvatarToStorage: jest.fn(),
    };

    const partialService = createUserService(partialUserRepo, mockMatchesRepo);
    
    expect(partialService.getUsername()).toBe('partial');
    expect(partialService.getAvatar()).toBe('partial.webp');
  });

  test('methods should maintain correct context', () => {
    const { getUsername, saveUsername, getAvatar, saveAvatar, getMatches } = userService;

    mockUserRepo.loadUsernameFromStorage.mockReturnValue('context-test');
    
    expect(getUsername()).toBe('context-test');
    expect(() => saveUsername('test')).not.toThrow();
    expect(() => getAvatar()).not.toThrow();
    expect(() => saveAvatar('test.webp')).not.toThrow();
    expect(() => getMatches()).not.toThrow();
  });
});