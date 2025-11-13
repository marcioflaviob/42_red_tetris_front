import { createMatchesRepository } from '../data/indexedDB/MatchesRepository';
import { v4 as uuidv4 } from 'uuid';

const createMatchService = (matchesRepo = createMatchesRepository()) => {
  const createMatch = async (matchData) => {
    return matchesRepo.addMatch({
      id: uuidv4().slice(0, 8),
      startedAt: new Date().toISOString(),
      score: 0,
      level: 1,
      rowsCleared: 0,
      ...matchData,
    });
  };

  const updateMatch = async (matchData) => {
    return matchesRepo.updateMatch({
      ...matchData,
      updatedAt: new Date().toISOString(),
    });
  };

  const getMatch = async (id) => {
    return matchesRepo.getMatch(id);
  };

  return {
    createMatch,
    updateMatch,
    getMatch,
  };
};

export { createMatchService };
