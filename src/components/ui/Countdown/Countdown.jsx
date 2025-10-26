import React, { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

const Countdown = ({ onComplete, isVisible = false }) => {
  const [count, setCount] = useState(3);
  const [phase, setPhase] = useState('counting'); // 'counting', 'go', 'complete'
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(3);
      setPhase('counting');
      setAnimationKey(0);
      return;
    }

    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount > 1) {
          setAnimationKey((prev) => prev + 1);
          return prevCount - 1;
        } else if (prevCount === 1) {
          setPhase('go');
          setAnimationKey((prev) => prev + 1);
          setTimeout(() => {
            setPhase('complete');
            if (onComplete) onComplete();
          }, 1000);
          return 1;
        }
        return prevCount;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onComplete]);

  if (!isVisible || phase === 'complete') return null;

  const displayText = phase === 'go' ? 'GO!' : count;
  const countdownClass = phase === 'go' ? styles.go : styles.number;

  return (
    <div className={styles.overlay}>
      <div className={styles.background}></div>
      <div className={styles.container}>
        <div
          className={`${styles.countdown} ${countdownClass}`}
          key={animationKey}
        >
          {displayText}
        </div>
        {phase === 'go' && (
          <div className={styles.particles}>
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className={styles.particle}
                style={{
                  '--delay': `${i * 0.05}s`,
                  '--angle': `${i * 12}deg`,
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Countdown;
