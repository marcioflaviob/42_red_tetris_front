import { createUserService } from '../../src/services/UserService';

describe('UserService', () => {
  let mockUserRepo;
  let mockMatchesRepo;
  let service;

  beforeEach(() => {
    mockUserRepo = {
      loadUsernameFromStorage: jest.fn(() => 'testuser'),
      saveUsernameToStorage: jest.fn(),
      loadAvatarFromStorage: jest.fn(() => 'avatar.png'),
      saveAvatarToStorage: jest.fn(),
      loadSessionIdFromStorage: jest.fn(() => '1234')
    };
    mockMatchesRepo = {
      getMatches: jest.fn(() => Promise.resolve([{ id: 1 }]))
    };
    service = createUserService(mockUserRepo, mockMatchesRepo);
  });

  it('gets username from repo', () => {
    expect(service.getUsername()).toBe('testuser');
  });

  it('saves username to repo', () => {
    service.saveUsername('newuser');
    expect(mockUserRepo.saveUsernameToStorage).toHaveBeenCalledWith('newuser');
  });

  it('gets avatar from repo', () => {
    expect(service.getAvatar()).toBe('avatar.png');
  });

  it('saves avatar to repo', () => {
    service.saveAvatar('newavatar.png');
    expect(mockUserRepo.saveAvatarToStorage).toHaveBeenCalledWith('newavatar.png');
  });

  it('gets session id from repo', () => {
    expect(service.getSessionId()).toBe('1234');
  });

  it('gets matches from matches repo', async () => {
    const matches = await service.getMatches();
    expect(matches).toEqual([{ id: 1 }]);
  });
});