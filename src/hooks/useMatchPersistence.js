import { useCallback, useRef } from 'react';
import { createMatchService } from '../services/MatchService';

const useMatchPersistence = (matchId) => {
  const matchService = useRef(createMatchService()).current;
  const updateTimeoutRef = useRef(null);

  const updateMatch = useCallback(
    (matchData) => {
      if (!matchId) return;

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(async () => {
        try {
          await matchService.updateMatch({
            id: matchId,
            ...matchData,
          });
        } catch (error) {
          console.error('Error updating match:', error);
        }
      }, 1000);
    },
    [matchId, matchService]
  );

  const saveMatchImmediate = useCallback(
    async (matchData) => {
      if (!matchId) return;

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      try {
        await matchService.updateMatch({
          id: matchId,
          ...matchData,
        });
      } catch (error) {
        console.error('Error saving match:', error);
      }
    },
    [matchId, matchService]
  );

  return { updateMatch, saveMatchImmediate };
};

export default useMatchPersistence;
