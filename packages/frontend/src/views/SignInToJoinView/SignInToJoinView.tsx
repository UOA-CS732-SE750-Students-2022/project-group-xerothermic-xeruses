import React from 'react';
import Logo from '../../components/Logo';
import SignInButtons from '../../components/SignInButtons';
import ViewportHeightLayout from '../../layouts/ViewportHeightLayout';
import styles from './SignInToJoinView.module.css';

type SignInToJoinProps = {
  useThe?: boolean;
};

const SignInToJoin: React.FC<SignInToJoinProps> = ({ useThe = false }) => (
  <ViewportHeightLayout>
    <div className={styles.container}>
      <img className={`${styles.goose}`} src={`${process.env.PUBLIC_URL}/assets/images/flocker-goose.png`} alt="logo" />
      <h1 className={styles.title}>Please sign in to join {useThe ? 'the' : 'a'} meeting</h1>
      <SignInButtons />
      <div className={styles.logo}>
        <Logo size="footer" colored={false} />
      </div>
    </div>
  </ViewportHeightLayout>
);

export default SignInToJoin;
