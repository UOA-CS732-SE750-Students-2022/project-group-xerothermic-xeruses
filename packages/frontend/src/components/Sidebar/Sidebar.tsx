import React from 'react';
import styles from './Sidebar.module.css';
import Logo from '../Logo';
import Line from '../Line';
import StyledNavLink from '../StyledNavLink';
import { useQuery } from '@apollo/client';
import { GET_GOOGLE_CALENDAR_AUTH_URL, GoogleCalendarAuthUrlResult } from '../../apollo';
import StyledExternalLink from '../StyledExternalLink';

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

  const { loading, data } = useQuery<GoogleCalendarAuthUrlResult>(GET_GOOGLE_CALENDAR_AUTH_URL);

  // TODO: Better detection of mobile devices.
  const popupOrNewTab = window.screen.availWidth > window.screen.availHeight ? 'popup' : 'new-tab';

  return (
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
        <StyledExternalLink href={(!loading && data?.googleCalendarAuthUrl) || '#'} openIn={popupOrNewTab}>
          Add calendars from Google
        </StyledExternalLink>
        <div className={styles.divider}>
          <Line />
        </div>
        <StyledNavLink to="/signout">Sign out</StyledNavLink>
      </div>
      <Logo size="footer" />
    </div>
  );
};

export default Sidebar;
