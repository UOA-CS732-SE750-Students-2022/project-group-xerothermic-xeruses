import React from 'react';
import SidebarLayout from '../SidebarLayout';
import styles from './DashboardLayout.module.css';
import { Outlet, NavLink } from 'react-router-dom';

const computeActiveClassName = (isActive: boolean) => (isActive ? styles.activeLink : '');

type StyledNavLinkProps = {
  to: string;
};

const StyledNavLink: React.FC<StyledNavLinkProps> = ({ to, children }) => (
  <NavLink to={to} className={({ isActive }) => `${styles.link} ${computeActiveClassName(isActive)}`}>
    {children}
  </NavLink>
);

const Navigation = () => (
  <nav className={styles.nav}>
    {/* TODO: Uncomment these as the views become available */}
    <StyledNavLink to="meetings">My Meetings</StyledNavLink>
    {/* <StyledNavLink to="create">Create New Meeting</StyledNavLink> */}
  </nav>
);

const DashboardLayout: React.FC = () => <SidebarLayout sidebarContent={<Navigation />} bodyContent={<Outlet />} />;

export default DashboardLayout;
