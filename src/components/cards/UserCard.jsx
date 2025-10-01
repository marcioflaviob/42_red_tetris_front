import React, { useEffect, useRef, useState } from 'react';
import InputText from '../ui/Inputs/InputText';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectUsername, setUsername } from '../../store/slices/userSlice';
import styles from './UserCard.module.css';
import Avatar from '../ui/Avatar/Avatar';
import Title from '../ui/Titles/Title';
import InfoCard from '../ui/Card/InfoCard';

const UserCard = () => {
  const username = useAppSelector(selectUsername);
  const dispatch = useAppDispatch();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username || '');
  const inputRef = useRef(null);

  const userStats = {
    gamesPlayed: 42,
    gamesWon: 28,
    bestScore: 15420,
    level: 7,
  };

  useEffect(() => {
    setTempUsername(username || '');
  }, [username]);

  useEffect(() => {
    if (isEditingUsername && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingUsername]);

  const handleUsernameClick = () => {
    setIsEditingUsername(true);
  };

  const handleUsernameChange = (e) => {
    setTempUsername(e.target.value);
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
      setTempUsername(username || '');
      setIsEditingUsername(false);
    }
  };

  return (
    <div className={styles.profileSection}>
      <div className={styles.cardHeader}>
        <Avatar size="xlarge" editable="true" />
        <div className={styles.usernameSection}>
          {isEditingUsername ? (
            <InputText
              ref={inputRef}
              id="username"
              name="username"
              type="text"
              value={tempUsername}
              onChange={handleUsernameChange}
              onKeyDown={handleUsernameKeyPress}
              onBlur={handleUsernameSubmit}
              placeholder="Enter your username"
              className={styles.usernameInput}
            />
          ) : (
            <div
              className={styles.usernameDisplay}
              onClick={handleUsernameClick}
              title="Click to edit username"
            >
              {username || 'Click to set username'}
            </div>
          )}
        </div>
      </div>

      {username && (
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <InfoCard className={styles.statItem}>
              <Title className={styles.statValue}>{userStats.gamesWon}</Title>
              <span className={styles.statLabel}>Wins</span>
            </InfoCard>
            <InfoCard className={styles.statItem}>
              <Title className={styles.statValue}>
                {userStats.bestScore.toLocaleString()}
              </Title>
              <span className={styles.statLabel}>Best Score</span>
            </InfoCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
