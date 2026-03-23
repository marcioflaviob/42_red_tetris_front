import React from 'react';
import PlayerListItem from './PlayerListItem';
import styles from './PlayersList.module.css';

const PlayersList = ({ players, currentUser }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Players in Lobby</h3>
        <span className={styles.playerCount}>{players.length}</span>
      </div>

      <div className={styles.listContainer}>
        {players.map((player) => (
          <PlayerListItem
            key={player.sessionId}
            player={player}
            isCurrentUser={player.sessionId === currentUser.sessionId}
            isHost={player.host}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayersList;
