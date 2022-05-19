import React from 'react';
import styles from './StyledLink.module.css';

type StyledLinkProps = {
  onClick: React.MouseEventHandler;
};

const StyledLink: React.FC<StyledLinkProps> = ({ children, onClick }) => (
  <div className={styles.link} onClick={onClick}>
    {children}
  </div>
);

export default StyledLink;
