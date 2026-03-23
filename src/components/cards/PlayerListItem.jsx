import React from 'react';
import Avatar from '../ui/Avatar/Avatar';
import styles from './PlayerListItem.module.css';

const PlayerListItem = ({ player, isCurrentUser, isHost }) => {
  return (
    <div className={styles.playerItem}>
      <div className={styles.avatarContainer}>
        <Avatar avatar={player.avatar} />
        {player.host && <div className={styles.hostBadge}>★</div>}
      </div>

      <div className={styles.playerInfo}>
        <div className={styles.playerName}>{player.username}</div>
        <div className={styles.playerRole}>{isCurrentUser ? 'You' : 'Opponent'}</div>
      </div>

      {isHost && (
        <div className={styles.statusIndicator}>
          <div className={styles.statusDot}></div>
          <span className={styles.statusText}>Ready</span>
        </div>
      )}
    </div>
  );
};

export default PlayerListItem;
