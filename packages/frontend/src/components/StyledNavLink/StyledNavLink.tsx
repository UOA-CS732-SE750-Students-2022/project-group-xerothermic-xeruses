import React from 'react';
import styles from './StyledNavLink.module.css';
import { NavLink } from 'react-router-dom';

const computeActiveClassName = (isActive: boolean) => (isActive ? styles.activeLink : '');

type StyledNavLinkProps = {
  to: string;
};

const StyledNavLink: React.FC<StyledNavLinkProps> = ({ to, children }) => (
  <NavLink to={to} className={({ isActive }) => `${styles.link} ${computeActiveClassName(isActive)}`}>
    {children}
  </NavLink>
);

export default StyledNavLink;
