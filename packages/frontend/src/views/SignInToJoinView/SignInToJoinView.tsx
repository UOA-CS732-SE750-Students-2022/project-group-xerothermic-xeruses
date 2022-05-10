import React from 'react';
import Logo from '../../components/Logo';
import SignInButtons from '../../components/SignInButtons';
import styles from './SignInToJoinView.module.css';

const SignInToJoin: React.FC = () => (
  <div className={styles.container}>
    <img className={`${styles.goose}`} src={`${process.env.PUBLIC_URL}/assets/images/flocker-goose.png`} alt="logo" />
    <h1 className={styles.title}>Please sign in to join the meeting</h1>
    <SignInButtons />
    <div className={styles.logo}>
      <Logo size="footer" colored={false} />
    </div>
  </div>
);

export default SignInToJoin;
