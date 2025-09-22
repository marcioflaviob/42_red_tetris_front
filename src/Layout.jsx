import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './base/Header';
import Footer from './base/Footer';

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default Layout;