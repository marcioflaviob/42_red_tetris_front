import React from 'react';
import styles from './Button.module.css';
import { Button as PrimeReactButton } from 'primereact/button';

const Button = ({
  children,
  onClick,
  disabled = false,
  size = 'normal',
  variant = 'primary',
  className = '',
  tooltip = '',
  tooltipBool = false,
  ...props
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.normal;
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'play':
        return styles.play;
      default:
        return styles.primary;
    }
  };

  return (
    <PrimeReactButton
      className={`${styles.button} ${getSizeClass()} ${getVariantClass()} ${className}`}
      onClick={onClick}
      disabled={disabled}
      tooltip={tooltipBool ? tooltip : undefined}
      tooltipOptions={{ 
        position: 'top',
        showOnDisabled: true 
      }}
      {...props}
    >
      {children}
    </PrimeReactButton>
  );
};

export default Button;
