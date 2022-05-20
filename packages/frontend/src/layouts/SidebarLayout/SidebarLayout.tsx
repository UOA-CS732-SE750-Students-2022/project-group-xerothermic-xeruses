import React from 'react';
import styles from './SidebarLayout.module.css';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

type SidebarLayoutProps = {
  sidebarContent?: React.ReactNode;
  bodyContent?: React.ReactNode;
  returnTo?: { route: string; name: string };
};

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ sidebarContent, bodyContent, returnTo }) => {
  const { user } = useAuth();
  const username = user?.displayName;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar username={username} returnTo={returnTo}>
          {sidebarContent}
        </Sidebar>
      </div>
      <div className={styles.content}>{bodyContent}</div>
    </div>
  );
};

export default SidebarLayout;
