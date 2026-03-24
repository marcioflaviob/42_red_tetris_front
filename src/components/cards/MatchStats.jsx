import React from 'react';
import Avatar from '../ui/Avatar/Avatar';
import styles from './MatchStats.module.css';

const MatchStats = ({ roomId, playerCount, hostName, onStartGame, isHost, gameStarted, players = [], currentUser }) => {
  return (
    <div className={styles.statsContainer}>
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
            <div key={player.sessionId} className={styles.playerRow}>
              {/* <Avatar avatar={player.avatar} /> */}
              <div className={styles.playerDetails}>
                <div className={styles.playerName}>{player.username}</div>
                <div className={styles.playerRole}>
                  {player.sessionId === currentUser.sessionId ? 'You' : 'Opponent'}
                </div>
              </div>
              {player.host && <span className={styles.hostBadge}>★ Host</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Host Controls */}
      {isHost && !gameStarted && (
        <button className={styles.startButton} onClick={onStartGame}>
          <span className={styles.buttonIcon}>▶</span>
          Start Game
        </button>
      )}

      {isHost && gameStarted && <div className={styles.runningBadge}>Game in progress...</div>}

      {!isHost && <div className={styles.waitingBadge}>Waiting for host to start...</div>}
    </div>
  );
};

export default MatchStats;
