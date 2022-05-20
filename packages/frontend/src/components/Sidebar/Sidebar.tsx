import React from 'react';
import styles from './Sidebar.module.css';
import Logo from '../Logo';
import Line from '../Line';
import StyledNavLink from '../StyledNavLink';
import ViewportHeightLayout from '../../layouts/ViewportHeightLayout';
import { useQuery } from '@apollo/client';
import { GET_GOOGLE_CALENDAR_AUTH_URL, GoogleCalendarAuthUrlResult } from '../../apollo';
import StyledExternalLink from '../StyledExternalLink';
import StyledLink from '../StyledLink';
import ImportCalModal from '../ImportCalModal';

type SidebarProps = {
  username?: string | null | undefined;
  returnTo?: { route: string; name: string };
};

const Sidebar: React.FC<SidebarProps> = ({ username, returnTo, children }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

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
    <ViewportHeightLayout>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            {getTitle()}
            {returnTo && (
              <StyledNavLink to={returnTo.route}>
                {'<'} Return to {returnTo.name}
              </StyledNavLink>
            )}
            <div className={styles.divider}>
              <Line />
            </div>
          </div>
          {children}
          <div className={styles.divider}>
            <Line />
          </div>
          <div className={styles.links}>
            <StyledLink onClick={handleModalOpen}>Import iCal</StyledLink>
            <StyledExternalLink href={(!loading && data?.googleCalendarAuthUrl) || '#'} openIn={popupOrNewTab}>
              Add calendars from Google
            </StyledExternalLink>
          </div>
          <div className={styles.divider}>
            <Line />
          </div>
          <StyledNavLink to="/signout">Sign out</StyledNavLink>
        </div>
        <Logo size="footer" />
      </div>
      <ImportCalModal open={modalOpen} onClose={handleModalClose} />
    </ViewportHeightLayout>
  );
};

export default Sidebar;
