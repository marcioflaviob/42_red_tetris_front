import React from 'react';
import styles from './Card.module.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUsername } from '../../../store/slices/userSlice';

const Card = ({ children, className = '', isUsernameRequired = false }) => {
  const username = useAppSelector(selectUsername);

  const isUsernameEmpty =
    isUsernameRequired && (!username || username.trim() === '');
  const cardClassName = `${styles.card} ${className} ${isUsernameEmpty ? styles.usernameRequired : ''}`;

  return (
    <div className={cardClassName}>
      {children}
      {isUsernameEmpty && (
        <div className={styles.usernamePrompt}>
          <div className={styles.usernamePromptMessage}>
            Please set a username first
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
