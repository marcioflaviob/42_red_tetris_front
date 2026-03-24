import React, { useCallback, useEffect, useState } from 'react';
import InputText from '../ui/Inputs/InputText';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectUser, setUsername } from '../../store/slices/userSlice';
import styles from './UserCard.module.css';
import Avatar from '../ui/Avatar/Avatar';
import Title from '../ui/Titles/Title';
import InfoCard from '../ui/Card/InfoCard';
import { USERNAME_REGEX } from '../../utils/constants';
import { createMatchesRepository } from '../../data/indexedDB/MatchesRepository';

const UserCard = ({ showStats = true, username, avatarClassName = '' }) => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(user.username || '');
  const [userStats, setUserStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    bestScore: 0,
    accuracy: 0,
  });

  const fetchStats = useCallback(() => {
    const matchesRepo = createMatchesRepository();
    matchesRepo.getMatches().then((matches) => {
      const gamesPlayed = matches.length;
      const gamesWon = matches.filter((match) => match.winner === user.sessionId && match.online).length;
      const bestScore = Math.max(0, ...matches.map((match) => match.score || 0));

      const accuracy = matches.length
        ? matches.reduce((acc, match) => acc + (match.accuracy || 0), 0) / matches.length
        : 0;

      setUserStats({
        gamesPlayed,
        gamesWon,
        bestScore,
        accuracy,
      });
    });
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const inputCallbackRef = (element) => {
    if (element) element.focus();
  };

  const handleUsernameClick = () => {
    setTempUsername(user.username);
    setIsEditingUsername(true);
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (USERNAME_REGEX.test(value) && value.length <= 30) setTempUsername(value);
  };

  const handleUsernameSubmit = () => {
    if (tempUsername.trim()) {
      dispatch(setUsername(tempUsername.trim()));
    }
    setIsEditingUsername(false);
  };

  const handleUsernameKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUsernameSubmit();
    } else if (e.key === 'Escape') {
      setTempUsername(user.username || '');
      setIsEditingUsername(false);
    }
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.profileSection}>
        <div className={styles.cardHeader}>
          <div className={styles.usernameSection}>
            {isEditingUsername ? (
              <InputText
                ref={inputCallbackRef}
                id="username"
                name="username"
                type="text"
                value={tempUsername}
                onChange={handleUsernameChange}
                onKeyDown={handleUsernameKeyPress}
                onBlur={handleUsernameSubmit}
                className={styles.usernameInput}
              />
            ) : (
              <div className={styles.usernameDisplay} onClick={handleUsernameClick} title="Click to edit username">
                {username || user.username || 'Click to set username'}
              </div>
            )}
          </div>
        </div>

        {user.username && showStats && (
          <div className={styles.statsSection}>
            <div className={styles.statsGrid}>
              <InfoCard className={styles.statItem}>
                <Title className={styles.statValue}>{userStats.gamesWon}</Title>
                <span className={styles.statLabel}>Multiplayer Wins</span>
              </InfoCard>
              <InfoCard className={styles.statItem}>
                <Title className={styles.statValue}>{userStats.bestScore}</Title>
                <span className={styles.statLabel}>Best Score</span>
              </InfoCard>
              <InfoCard className={styles.statItem}>
                <Title className={styles.statValue}>{userStats.gamesPlayed}</Title>
                <span className={styles.statLabel}>Games played</span>
              </InfoCard>
              <InfoCard className={styles.statItem}>
                <Title className={styles.statValue}>{userStats.accuracy.toFixed(2)}%</Title>
                <span className={styles.statLabel}>Accuracy</span>
              </InfoCard>
            </div>
          </div>
        )}
      </div>
      <Avatar editable={true} className={avatarClassName || styles.avatar} />
    </div>
  );
};

export default UserCard;
