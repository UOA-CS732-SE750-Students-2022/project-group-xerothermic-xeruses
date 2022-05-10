import React from 'react';
import SignInButtons from '../../components/SignInButtons';
import styles from './SignInToJoinView.module.css';

const SignInToJoin: React.FC = () => (
  <div className={styles.container}>
    <img className={`${styles.goose}`} src={`${process.env.PUBLIC_URL}/assets/images/flocker-goose.png`} alt="logo" />
    <h1 className={styles.title}>Please sign in to join the meeting</h1>
    <SignInButtons />
  </div>
);

export default SignInToJoin;
