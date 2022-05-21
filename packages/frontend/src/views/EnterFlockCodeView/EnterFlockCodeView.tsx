import React from 'react';
import EnterFlockCodeInput from '../../components/EnterFlockCodeInput';
import Logo from '../../components/Logo';
import StyledNavLink from '../../components/StyledNavLink';
import ViewportHeightLayout from '../../layouts/ViewportHeightLayout';
import styles from './EnterFlockCodeView.module.css';

const EnterFlockCodeView: React.FC = () => (
  <ViewportHeightLayout>
    <div className={styles.container}>
      <h1 className={styles.title}>Enter a flock code to join a flock</h1>
      <div className={styles.input}>
        <EnterFlockCodeInput centered />
      </div>
      <StyledNavLink to="/dashboard" colored>
        Or go to Dashboard
      </StyledNavLink>
      <div className={styles.logo}>
        <Logo size="footer" colored />
      </div>
    </div>
  </ViewportHeightLayout>
);

export default EnterFlockCodeView;
