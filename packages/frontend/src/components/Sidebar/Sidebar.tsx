import React from 'react';
import styles from './Sidebar.module.css';
import Logo from '../Logo';
import Line from '../Line';

type SidebarProps = {
  username?: string | null | undefined;
};

const Sidebar: React.FC<SidebarProps> = ({ username, children }) => {
  const getTitle = () => {
    return username ? (
      <p className={styles.title}>
        Hi <span className={styles.username}>{username}</span>
      </p>
    ) : (
      <p className={styles.title}>Hello!</p>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          {getTitle()} <Line />
        </div>
        {children}
      </div>
      <Logo size="footer"></Logo>
    </div>
  );
};

export default Sidebar;
