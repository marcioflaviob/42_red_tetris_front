import React from 'react';
import styles from './Footer.module.css';
import LegoPiece from '../components/ui/Backgrounds/LegoPiece';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container mx-auto px-4">
        <span>
          &copy; {new Date().getFullYear()} 42 school project.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
