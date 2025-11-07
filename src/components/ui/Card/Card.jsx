import React, { useEffect, useState } from 'react';
import styles from './Card.module.css';
import { useAppSelector } from '../../../store/hooks';
import { selectUsername } from '../../../store/slices/userSlice';

const Card = ({
  children,
  className = '',
  message = '',
  isUsernameRequired = false,
  loading = false,
  greyScale = false,
}) => {
  const username = useAppSelector(selectUsername);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          // Progress slows down as it approaches 100%
          // Never reaches 100% while loading is true
          const remaining = 100 - prev;
          const increment = remaining * 0.025;
          const newProgress = prev + increment;
          return newProgress >= 99.5 ? 99.5 : newProgress;
        });
      }, 400);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);

  const isUsernameEmpty =
    isUsernameRequired && (!username || username.trim() === '');

  const shouldShowOverlay =
    isUsernameEmpty || (greyScale && message) || loading;
  const shouldApplyGreyScale = isUsernameEmpty || greyScale || loading;

  const cardClassName = `${styles.card} ${className} ${
    shouldShowOverlay ? styles.usernameRequired : ''
  } ${shouldApplyGreyScale ? styles.greyScale : ''}`;

  const getOverlayContent = () => {
    if (isUsernameEmpty) {
      return { type: 'message', content: 'Please set a username first' };
    }
    if (loading) {
      return { type: 'loading' };
    }
    if (greyScale && message) {
      return { type: 'message', content: message };
    }
    return null;
  };

  const overlayContent = getOverlayContent();

  return (
    <div className={cardClassName}>
      {children}
      {shouldShowOverlay && (
        <div className={styles.overlay}>
          {overlayContent?.type === 'loading' ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingText}>Loading...</div>
              <div className={styles.loadingBar}>
                <div
                  className={styles.loadingBarFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className={styles.loadingPercentage}>
                {Math.floor(progress)}%
              </div>
            </div>
          ) : overlayContent?.type === 'message' ? (
            <div className={styles.overlayMessage}>
              {overlayContent.content}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Card;
