import React from 'react';
import styles from './SignInButtons.module.css';
import Button from '../Button';
import Line from '../Line';
import { signInWithGoogle } from '../../auth/firebase';

const SignInButtons: React.FC = () => (
  <div className={styles.container}>
    <Button onClick={signInWithGoogle} color="white" variant="outlined">
      Sign in with Google
    </Button>
    <div className={styles.divider}>
      <Line text="or" />
    </div>
    {/* TODO: Add guest users */}
    <Button onClick={() => alert('Coming soon')} color="white">
      Continue as Guest
    </Button>
  </div>
);

export default SignInButtons;
