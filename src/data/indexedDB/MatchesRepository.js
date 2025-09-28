import { openDB } from 'idb';

const createMatchesRepository = () => {

  const DB_NAME = 'MatchesDB';
  const STORE_NAME = 'matches';

  const initDB = async () => {
    try {
      return openDB(DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          }
        },
      });
    } catch (error) {
      console.error('Error initializing MatchesDB:', error);
      throw error;
    }
  };

  const addMatch = async (matchData) => {
    try {
      const db = await initDB();
      return await db.add(STORE_NAME, matchData);
    } catch (error) {
      console.error('Error adding match to storage:', error);
      throw error;
    }
  };

  const getMatches = async () => {
    try {
      const db = await initDB();
      return await db.getAll(STORE_NAME);
    } catch (error) {
      console.error('Error loading matches from storage:', error);
      return [];
    }
  };

  const updateMatch = async (match) => {
    try {
      const db = await initDB();
      return await db.put(STORE_NAME, match);
    } catch (error) {
      console.error('Error updating match in storage:', error);
      throw error;
    }
  };

  return {
    addMatch,
    getMatches,
    updateMatch
  };
};

export { createMatchesRepository };