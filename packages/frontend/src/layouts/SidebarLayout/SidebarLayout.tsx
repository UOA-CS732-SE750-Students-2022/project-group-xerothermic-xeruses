import React from 'react';
import styles from './SidebarLayout.module.css';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

type SidebarLayoutProps = {
  title?: string;
  sidebarContent?: React.ReactNode;
  bodyContent?: React.ReactNode;
};

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ title, sidebarContent, bodyContent }) => {
  const { user } = useAuth();
  const username = user?.displayName;

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar username={username}>{sidebarContent}</Sidebar>
      </div>
      <div className={styles.content}>
        {<h1 className={styles.title}>{title}</h1>}
        {bodyContent}
      </div>
    </div>
  );
};

export default SidebarLayout;
