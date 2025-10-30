import React, { forwardRef } from 'react';
import { InputText as PrimeInputText } from 'primereact/inputtext';
import styles from './InputText.module.css';

const InputText = forwardRef(
  ({ value = '', id = '', onChange, placeholder = '', type = 'text', keyFilter = '', name, disabled = false, className = '', ...props }, ref) => {
    return (
      <PrimeInputText
        ref={ref}
        value={value}
        id={id}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        name={name}
        keyfilter={keyFilter}
        disabled={disabled}
        className={`${styles.input} ${className}`}
        {...props}
      />
    );
  }
);

InputText.displayName = 'InputText';

export default InputText;
