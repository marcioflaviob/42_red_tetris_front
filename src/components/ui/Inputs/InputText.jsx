import React, { forwardRef } from 'react';
import { InputText as PrimeInputText } from 'primereact/inputtext';
import styles from './InputText.module.css';

const InputText = forwardRef(
  (
    {
      value = '',
      id = '',
      onChange,
      type = 'text',
      keyFilter = '',
      name,
      disabled = false,
      className = '',
      resizable = false,
      ...props
    },
    ref
  ) => {
    const handleFocus = (e) => {
      e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
    };
    return (
      <textarea
        ref={ref}
        value={value}
        id={id}
        onFocus={handleFocus}
        onChange={onChange}
        type={type}
        name={name}
        keyfilter={keyFilter}
        disabled={disabled}
        className={`${styles.input} ${resizable ? styles.resizable : ''} ${className}`}
        {...props}
      />
    );
  }
);

InputText.displayName = 'InputText';

export default InputText;
