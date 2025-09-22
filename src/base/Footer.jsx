import React from 'react';

const Footer = () => {
    return (
        <footer style={{ padding: '1rem', textAlign: 'center', background: '#f5f5f5' }}>
            <span>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</span>
        </footer>
    );
};

export default Footer;