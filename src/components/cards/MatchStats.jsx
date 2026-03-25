import React from 'react';
import styles from './MatchStats.module.css';
import Button from '../ui/Buttons/Button';

const MatchStats = ({
  roomId,
  playerCount,
  hostName,
  onStartGame,
  isHost,
  gameStarted,
  players = [],
  accuracy,
  score,
  className = '',
  children,
}) => {
  return (
    <div className={`${styles.statsContainer} ${className}`}>
      {children}

      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Match Room</h2>
        <div className={styles.statusBadge} data-status={gameStarted ? 'running' : 'waiting'}>
          {gameStarted ? 'Running' : 'Waiting'}
        </div>
      </div>

      {/* Room Info */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Room ID</span>
          <span className={styles.value}>{roomId}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Players</span>
          <span className={styles.value}>{playerCount}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Host</span>
          <span className={styles.value}>{hostName}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Status</span>
          <span className={styles.value}>{gameStarted ? '●' : '◯'}</span>
        </div>
      </div>

      {/* Players List */}
      <div className={styles.playersList}>
        <div className={styles.playersHeader}>Players in Lobby</div>
        <div className={styles.playersContainer}>
          {players.map((player) => (
            <div key={player.sessionId} className={styles.playerCard}>
              <div className={styles.playerCardHeader}>
                <div className={styles.playerIdentity}>
                  <div
                    className={`${styles.avatarWrapper} ${player.avatar?.includes('evil') ? styles.evilAvatarWrapper : ''}`}>
                    <img
                      src={player.avatar?.replace('/avatarsUi/', '/avatarsCircled/')}
                      alt={player.username}
                      className={styles.avatarCircle}
                    />
                  </div>
                  <div className={styles.playerName}>{player.username}</div>
                </div>

                <div className={styles.statsAndBadges}>
                  <div className={styles.playerStatsRow}>
                    <div className={styles.playerStatItem}>
                      <span className={styles.playerStatLabel}>Score</span>
                      <span className={styles.playerStatValue}>{score ?? 0}</span>
                    </div>
                    <div className={styles.playerStatItem}>
                      <span className={styles.playerStatLabel}>Acc</span>
                      <span className={styles.playerStatValue}>{accuracy ?? 0}%</span>
                    </div>
                  </div>

                  <div className={styles.badgeContainer}>
                    {player.host && <span className={styles.hostBadge}>★ Host</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Host Controls */}
      {isHost && !gameStarted && (
        <Button className={styles.startButton} onClick={onStartGame} disabled={players.length < 2}>
          <span className={styles.buttonIcon}>▶</span>
          Start Game
        </Button>
      )}

      {isHost && gameStarted && <div className={styles.runningBadge}>Game in progress...</div>}

      {!isHost && <div className={styles.waitingBadge}>Waiting for host to start...</div>}
    </div>
  );
};

export default MatchStats;
