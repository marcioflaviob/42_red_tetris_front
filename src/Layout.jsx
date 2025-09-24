import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './base/Header';
import Footer from './base/Footer';
import styles from './Layout.module.css';

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Header className={styles.header} />
      <main className={`${styles.main} container mx-auto`}>
        <Outlet />
      </main>
      <Footer className={styles.footer} />
    </div>
  );
};

export default Layout;
