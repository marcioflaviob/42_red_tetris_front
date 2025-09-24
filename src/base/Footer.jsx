import React from 'react';
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer
      className={styles.footer}
    >
      <div className="container mx-auto px-4">
        <span>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
