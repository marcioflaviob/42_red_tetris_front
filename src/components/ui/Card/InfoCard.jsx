import React from 'react';
import styles from './InfoCard.module.css';

const InfoCard = ({ children, className = '' }) => (
  <div className={`${styles.card} ${className}`}>{children}</div>
);

export default InfoCard;
