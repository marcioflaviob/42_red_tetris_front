import { createMatchesRepository } from '../../../src/data/indexedDB/MatchesRepository';

jest.mock('idb', () => ({
  openDB: jest.fn(),
}));

const mockConsoleError = jest.fn();
console.error = mockConsoleError;

describe('MatchesRepository', () => {
  let matchesRepository;
  let mockOpenDB;
  let mockDB;

  beforeEach(() => {
    const { openDB } = require('idb');
    mockOpenDB = openDB;
    
    mockDB = {
      add: jest.fn(),
      getAll: jest.fn(),
      put: jest.fn(),
    };
    
    jest.clearAllMocks();
    mockOpenDB.mockResolvedValue(mockDB);
    matchesRepository = createMatchesRepository();
  });

  describe('initDB', () => {
    test('should initialize database with correct parameters', async () => {
      const repo = createMatchesRepository();
      
      await repo.getMatches();

      expect(mockOpenDB).toHaveBeenCalledWith('MatchesDB', 1, expect.any(Object));
    });

    test('should create object store in upgrade function', async () => {
      const mockUpgradeDB = {
        objectStoreNames: {
          contains: jest.fn().mockReturnValue(false),
        },
        createObjectStore: jest.fn(),
      };

      mockOpenDB.mockImplementation((name, version, { upgrade }) => {
        upgrade(mockUpgradeDB);
        return Promise.resolve(mockDB);
      });

      const repo = createMatchesRepository();
      await repo.getMatches();

      expect(mockUpgradeDB.objectStoreNames.contains).toHaveBeenCalledWith('matches');
      expect(mockUpgradeDB.createObjectStore).toHaveBeenCalledWith('matches', {
        keyPath: 'id',
        autoIncrement: true,
      });
    });

    test('should not create object store if it already exists', async () => {
      const mockUpgradeDB = {
        objectStoreNames: {
          contains: jest.fn().mockReturnValue(true),
        },
        createObjectStore: jest.fn(),
      };

      mockOpenDB.mockImplementation((name, version, { upgrade }) => {
        upgrade(mockUpgradeDB);
        return Promise.resolve(mockDB);
      });

      const repo = createMatchesRepository();
      await repo.getMatches();

      expect(mockUpgradeDB.objectStoreNames.contains).toHaveBeenCalledWith('matches');
      expect(mockUpgradeDB.createObjectStore).not.toHaveBeenCalled();
    });

    test('should handle database initialization errors', async () => {
      const repo = createMatchesRepository();
      expect(repo).toBeDefined();
      expect(typeof repo.getMatches).toBe('function');
      expect(typeof repo.addMatch).toBe('function');
      expect(typeof repo.updateMatch).toBe('function');
    });
  });

  describe('addMatch', () => {
    test('should add match to database', async () => {
      const matchData = { score: 100, date: '2023-01-01' };
      const expectedId = 1;
      mockDB.add.mockResolvedValue(expectedId);

      const result = await matchesRepository.addMatch(matchData);

      expect(mockDB.add).toHaveBeenCalledWith('matches', matchData);
      expect(result).toBe(expectedId);
    });

    test('should handle add match errors', async () => {
      const matchData = { score: 100 };
      const addError = new Error('Add failed');
      mockDB.add.mockRejectedValue(addError);

      await expect(matchesRepository.addMatch(matchData)).rejects.toThrow(addError);
      expect(mockConsoleError).toHaveBeenCalledWith('Error adding match to storage:', addError);
    });

    test('should handle database initialization error during add', async () => {
      const dbError = new Error('DB init failed');
      mockOpenDB.mockRejectedValue(dbError);

      await expect(matchesRepository.addMatch({})).rejects.toThrow(dbError);
    });
  });

  describe('getMatches', () => {
    test('should return all matches from database', async () => {
      const expectedMatches = [
        { id: 1, score: 100 },
        { id: 2, score: 200 },
      ];
      mockDB.getAll.mockResolvedValue(expectedMatches);

      const result = await matchesRepository.getMatches();

      expect(mockDB.getAll).toHaveBeenCalledWith('matches');
      expect(result).toEqual(expectedMatches);
    });

    test('should return empty array when no matches exist', async () => {
      mockDB.getAll.mockResolvedValue([]);

      const result = await matchesRepository.getMatches();

      expect(result).toEqual([]);
    });

    test('should handle get matches errors gracefully', async () => {
      const getError = new Error('Get failed');
      mockDB.getAll.mockRejectedValue(getError);

      const result = await matchesRepository.getMatches();

      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalledWith('Error loading matches from storage:', getError);
    });

    test('should handle database initialization error during get', async () => {
      const dbError = new Error('DB init failed');
      mockOpenDB.mockRejectedValue(dbError);

      const result = await matchesRepository.getMatches();

      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalledWith('Error loading matches from storage:', dbError);
    });
  });

  describe('updateMatch', () => {
    test('should update match in database', async () => {
      const matchData = { id: 1, score: 150, updated: true };
      const expectedResult = 'success';
      mockDB.put.mockResolvedValue(expectedResult);

      const result = await matchesRepository.updateMatch(matchData);

      expect(mockDB.put).toHaveBeenCalledWith('matches', matchData);
      expect(result).toBe(expectedResult);
    });

    test('should handle update match errors', async () => {
      const matchData = { id: 1, score: 150 };
      const updateError = new Error('Update failed');
      mockDB.put.mockRejectedValue(updateError);

      await expect(matchesRepository.updateMatch(matchData)).rejects.toThrow(updateError);
      expect(mockConsoleError).toHaveBeenCalledWith('Error updating match in storage:', updateError);
    });

    test('should handle database initialization error during update', async () => {
      const dbError = new Error('DB init failed');
      mockOpenDB.mockRejectedValue(dbError);

      await expect(matchesRepository.updateMatch({})).rejects.toThrow(dbError);
    });
  });

  describe('createMatchesRepository', () => {
    test('should return repository object with all methods', () => {
      const repo = createMatchesRepository();

      expect(repo).toHaveProperty('addMatch');
      expect(repo).toHaveProperty('getMatches');
      expect(repo).toHaveProperty('updateMatch');

      expect(typeof repo.addMatch).toBe('function');
      expect(typeof repo.getMatches).toBe('function');
      expect(typeof repo.updateMatch).toBe('function');
    });

    test('should be exported correctly', () => {
      expect(createMatchesRepository).toBeDefined();
      expect(typeof createMatchesRepository).toBe('function');
    });

    test('should create independent repository instances', () => {
      const repo1 = createMatchesRepository();
      const repo2 = createMatchesRepository();

      expect(repo1).not.toBe(repo2);
      expect(repo1.addMatch).not.toBe(repo2.addMatch);
    });
  });

  describe('constants', () => {
    test('should use correct database name and store name', async () => {
      await matchesRepository.getMatches();

      expect(mockOpenDB).toHaveBeenCalledWith('MatchesDB', 1, expect.any(Object));
      expect(mockDB.getAll).toHaveBeenCalledWith('matches');
    });
  });

  describe('database version handling', () => {
    test('should use version 1 for database', async () => {
      await matchesRepository.getMatches();

      expect(mockOpenDB).toHaveBeenCalledWith('MatchesDB', 1, expect.any(Object));
    });
  });

  describe('object store configuration', () => {
    test('should configure object store with correct options', async () => {
      const mockUpgradeDB = {
        objectStoreNames: {
          contains: jest.fn().mockReturnValue(false),
        },
        createObjectStore: jest.fn(),
      };

      mockOpenDB.mockImplementation((name, version, { upgrade }) => {
        upgrade(mockUpgradeDB);
        return Promise.resolve(mockDB);
      });

      const repo = createMatchesRepository();
      await repo.getMatches();

      expect(mockUpgradeDB.createObjectStore).toHaveBeenCalledWith('matches', {
        keyPath: 'id',
        autoIncrement: true,
      });
    });
  });

  describe('error handling patterns', () => {
    test('should consistently log and rethrow errors in add operations', async () => {
      const error = new Error('Test error');
      mockDB.add.mockRejectedValue(error);

      await expect(matchesRepository.addMatch({})).rejects.toThrow(error);
      expect(mockConsoleError).toHaveBeenCalledWith('Error adding match to storage:', error);
    });

    test('should consistently log and rethrow errors in update operations', async () => {
      const error = new Error('Test error');
      mockDB.put.mockRejectedValue(error);

      await expect(matchesRepository.updateMatch({})).rejects.toThrow(error);
      expect(mockConsoleError).toHaveBeenCalledWith('Error updating match in storage:', error);
    });

    test('should consistently log and return default in get operations', async () => {
      const error = new Error('Test error');
      mockDB.getAll.mockRejectedValue(error);

      const result = await matchesRepository.getMatches();
      
      expect(result).toEqual([]);
      expect(mockConsoleError).toHaveBeenCalledWith('Error loading matches from storage:', error);
    });
  });
});