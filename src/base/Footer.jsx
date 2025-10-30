import React from 'react';
import styles from './Footer.module.css';
import LegoPiece from '../components/ui/Backgrounds/LegoPiece';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerContent} container`}>
        <a
          href="https://42.fr/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.schoolLink}
        >
          <img
            src="https://42.fr/wp-content/uploads/2021/05/42-Final-sigle-seul.svg"
            alt="42 Logo"
            className={styles.schoolLogo}
          />
        </a>

        <div className={styles.footerLinks}>
          <a
            href="https://github.com/marcioflaviob/42_red_tetris_front/"
            target="_blank"
            rel="noopener noreferrer"
          >
            frontend
          </a>
          <span className={styles.separator}>|</span>
          <a
            href="https://github.com/marcioflaviob/42_red_tetris_back/"
            target="_blank"
            rel="noopener noreferrer"
          >
            backend
          </a>
          <span className={styles.separator}>|</span>
          <a href="https://42.fr/" target="_blank" rel="noopener noreferrer">
            42 school
          </a>
        </div>

        <p className={styles.copyright}>
          red tetris is a school project written in 2025 by{' '}
          <a
            href="https://www.linkedin.com/in/marcioflavio/"
            target="_blank"
            rel="noopener noreferrer"
          >
            marcio flavio
          </a>{' '}
          and{' '}
          <a
            href="https://www.linkedin.com/in/t%C3%A9o-rimize-378b3222a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            teo rimize
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
