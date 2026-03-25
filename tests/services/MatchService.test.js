import { createMatchService } from '../../src/services/MatchService';

jest.mock('uuid', () => ({
  v4: jest.fn(() => '12345678-abcd')
}));

describe('MatchService', () => {
  let mockMatchesRepo;
  let service;

  beforeEach(() => {
    mockMatchesRepo = {
      addMatch: jest.fn(match => Promise.resolve(match)),
      updateMatch: jest.fn(match => Promise.resolve(match)),
      getMatch: jest.fn(id => Promise.resolve({ id })),
      getMatches: jest.fn(() => Promise.resolve([{ id: 1 }]))
    };
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01T00:00:00.000Z'));
    service = createMatchService(mockMatchesRepo);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('creates match with defaults', async () => {
    const data = { players: 2 };
    const match = await service.createMatch(data);
    expect(match).toEqual({
      id: '12345678',
      startedAt: '2023-01-01T00:00:00.000Z',
      score: 0,
      level: 1,
      rowsCleared: 0,
      players: 2
    });
  });

  it('updates match with updatedAt', async () => {
    const data = { id: 1, score: 100 };
    const updated = await service.updateMatch(data);
    expect(updated).toEqual({
      id: 1,
      score: 100,
      updatedAt: '2023-01-01T00:00:00.000Z'
    });
  });

  it('gets match by id', async () => {
    const match = await service.getMatch('123');
    expect(match).toEqual({ id: '123' });
  });

  it('gets all matches', async () => {
    const matches = await service.getMatches();
    expect(matches).toEqual([{ id: 1 }]);
  });
});
