import React from 'react';
import styles from './Title.module.css'

const Title = ({ children, className = '' }) => {



    return (
        <h2 className={`${styles.title} ${className}`}>
            {children}
        </h2>
    );
};

export default Title;