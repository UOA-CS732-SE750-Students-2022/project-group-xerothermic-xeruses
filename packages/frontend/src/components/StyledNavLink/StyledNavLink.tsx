import React from 'react';
import styles from './StyledNavLink.module.css';
import { NavLink } from 'react-router-dom';

const computeActiveClassName = (isActive: boolean) => (isActive ? styles.activeLink : '');

type StyledNavLinkProps = {
  to: string;
  colored?: boolean;
};

const StyledNavLink: React.FC<StyledNavLinkProps> = ({ to, colored = false, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `${styles.link} ${colored ? styles.colored : ''} ${computeActiveClassName(isActive)}`}
  >
    {children}
  </NavLink>
);

export default StyledNavLink;
