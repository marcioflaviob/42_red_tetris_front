import React from 'react';
import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className="container mx-auto">
        <h1>Header</h1>
      </div>
    </header>
  );
};

export default Header;
