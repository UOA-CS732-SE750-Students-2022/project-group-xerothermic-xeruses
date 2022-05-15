import React from 'react';
import styles from './Sidebar.module.css';
import Logo from '../Logo';
import Line from '../Line';
import StyledNavLink from '../StyledNavLink';
import ViewportHeightLayout from '../../layouts/ViewportHeightLayout';

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
    <ViewportHeightLayout>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            {getTitle()}
            <div className={styles.divider}>
              <Line />
            </div>
          </div>
          {children}
          <div className={styles.divider}>
            <Line />
          </div>
          <StyledNavLink to="/signout">Sign out</StyledNavLink>
        </div>
        <Logo size="footer" />
      </div>
    </ViewportHeightLayout>
  );
};

export default Sidebar;
