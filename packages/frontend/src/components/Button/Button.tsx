import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type ButtonVariant = 'filled' | 'outlined';
type ButtonColor = 'primary' | 'black' | 'white';

const computeVariantClass = (variant: ButtonVariant): string => {
  if (variant === 'filled') return styles.filled;
  if (variant === 'outlined') return styles.outlined;
  return '';
};

const computeColorClass = (color: ButtonColor): string => {
  if (color === 'primary') return styles.primary;
  if (color === 'black') return styles.black;
  if (color === 'white') return styles.white;
  return '';
};

const Button = ({ children, onClick, variant = 'filled', color = 'black', style }: ButtonProps) => {
  const variantClass = computeVariantClass(variant);
  const colorClass = computeColorClass(color);
  return (
    <button className={`${styles.button} ${variantClass} ${colorClass}`} onClick={onClick} style={style}>
      {children}
    </button>
  );
};

export default Button;
