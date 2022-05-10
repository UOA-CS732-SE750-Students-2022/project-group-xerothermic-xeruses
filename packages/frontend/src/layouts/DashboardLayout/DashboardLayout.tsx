import React from 'react';
import SidebarLayout from '../SidebarLayout';
import StyledNavLink from '../../components/StyledNavLink';
import styles from './DashboardLayout.module.css';
import { Outlet } from 'react-router-dom';

const Navigation = () => (
  <nav className={styles.nav}>
    {/* TODO: Uncomment these as the views become available */}
    <StyledNavLink to="meetings">My Meetings</StyledNavLink>
    {/* <StyledNavLink to="create">Create New Meeting</StyledNavLink> */}
  </nav>
);

const DashboardLayout: React.FC = () => <SidebarLayout sidebarContent={<Navigation />} bodyContent={<Outlet />} />;

export default DashboardLayout;
