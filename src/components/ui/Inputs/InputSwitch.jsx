import React from 'react';
import styles from './InputSwitch.module.css'

import { InputSwitch as PrimeReactInputSwitch } from 'primereact/inputswitch';
        

const InputSwitch = ({ checked, onChange, disabled, className = '' }) => {
    return (
        <PrimeReactInputSwitch 
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={`${styles.switch} ${className}`}
        />
    );
};

export default InputSwitch;