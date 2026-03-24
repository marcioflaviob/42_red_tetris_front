import { useEffect, useMemo, useRef, useState } from 'react';
import { createMatchService } from '../../services/MatchService';
import styles from './MatchHistory.module.css';

const formatDate = (isoDate) => {
  if (!isoDate) return 'Unknown date';

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Unknown date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getMatchStatus = (match) => {
  if (match?.gameOver || match?.endedAt) {
    return { label: 'Finished', className: styles.finished };
  }

  return { label: 'In progress', className: styles.inProgress };
};

const getMatchType = (type) => {
  if (type === 'online') return 'Online';
  if (type === 'offline') return 'Offline';
  return 'Unknown';
};

const MatchHistory = () => {
  const matchService = useRef(createMatchService()).current;
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadMatches = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const allMatches = await matchService.getMatches();
        if (!isMounted) return;

        const sortedMatches = [...allMatches].sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.endedAt || a.startedAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.endedAt || b.startedAt || 0).getTime();
          return dateB - dateA;
        });

        setMatches(sortedMatches);
      } catch (loadError) {
        console.error('Error loading matches history:', loadError);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMatches();

    return () => {
      isMounted = false;
    };
  }, [matchService]);

  const bestScore = useMemo(() => {
    if (matches.length === 0) return 0;
    return matches.reduce((maxScore, match) => Math.max(maxScore, match?.score || 0), 0);
  }, [matches]);

  return (
    <section className={styles.historyRoot}>
      <header className={styles.header}>
        <h3 className={styles.title}>Match History</h3>
        <div className={styles.summaryRow}>
          <span className={styles.summaryValue}>{matches.length} matches</span>
          <span className={styles.summaryValue}>best {bestScore.toLocaleString()}</span>
        </div>
      </header>

      <div className={styles.matchesViewport}>
        {isLoading ? <p className={styles.message}>Loading recent matches...</p> : null}
        {!isLoading && error ? <p className={styles.message}>Unable to load match history.</p> : null}
        {!isLoading && !error && matches.length === 0 ? (
          <p className={styles.message}>No matches yet. Start a game and your results will show up here.</p>
        ) : null}

        {!isLoading && !error && matches.length > 0 ? (
          <ul className={styles.matchesList}>
            {matches.map((match) => {
              const status = getMatchStatus(match);

              return (
                <li key={match.id} className={styles.matchItem}>
                  <div className={styles.itemHeader}>
                    <div className={styles.headerLeft}>
                      <span className={styles.matchId}>#{match.id}</span>
                      <span className={`${styles.statusBadge} ${status.className}`}>{status.label}</span>
                    </div>
                    <span className={styles.timestamp}>
                      {formatDate(match?.endedAt || match?.updatedAt || match?.startedAt)}
                    </span>
                  </div>

                  <div className={styles.itemContent}>
                    <div className={styles.mainSection}>
                      <div className={styles.scoreBlock}>
                        <span className={styles.scoreLabel}>Score</span>
                        <span className={styles.scoreValue}>{(match?.score || 0).toLocaleString()}</span>
                      </div>
                      <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Level</span>
                          <span className={styles.statValue}>{match?.level || 1}</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>Rows</span>
                          <span className={styles.statValue}>{match?.rowsCleared || 0}</span>
                        </div>
                      </div>
                    </div>
                    {(match?.opponentNames?.length > 0 || match?.opponentName || match?.opponent) && (
                      <div className={styles.opponentSection}>
                        <span className={styles.opponentLabel}>vs</span>
                        <div className={styles.opponentNamesList}>
                          {match?.opponentNames && match.opponentNames.length > 0 ? (
                            match.opponentNames.map((name, idx) => (
                              <span key={idx} className={styles.opponentNameItem}>
                                {name}
                              </span>
                            ))
                          ) : (
                            <span className={styles.opponentNameItem}>{match?.opponentName || match?.opponent}</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className={styles.typeSection}>
                      <span className={styles.typeBadge}>{getMatchType(match.type)}</span>
                    </div>
                  </div>

                  {(match?.piecePrediction || match?.increasedGravity || match?.invisiblePieces) && (
                    <div className={styles.modifiersSection}>
                      {match?.piecePrediction ? <span className={styles.modifierBadge}>🔮 Prediction</span> : null}
                      {match?.increasedGravity ? <span className={styles.modifierBadge}>⬇️ Gravity+</span> : null}
                      {match?.invisiblePieces ? <span className={styles.modifierBadge}>👁️ Invisible</span> : null}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
};

export default MatchHistory;
