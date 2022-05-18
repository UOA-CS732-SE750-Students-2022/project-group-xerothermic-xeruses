import React, { useState } from 'react';
import styles from './SignInButtons.module.css';
import Button from '../Button';
import Line from '../Line';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../../auth/firebase';
import { Modal } from '@mui/material';
import { FirebaseError } from 'firebase/app';

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const SignInModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const [showSignUp, setShowSignUp] = useState<boolean>(true);

  const [signUpUsername, setSignUpUsername] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPassword, setSignUpPassword] = useState<string>('');
  const [signUpErrorText, setSignUpErrorText] = useState<string>('');

  const [signInEmail, setSignInEmail] = useState<string>('');
  const [signInPassword, setSignInPassword] = useState<string>('');
  const [signInErrorText, setSignInErrorText] = useState<string>('');

  const signUp = (e: React.FormEvent) => {
    e.preventDefault();

    setSignUpErrorText('');
    signUpWithEmail(signUpEmail, signUpPassword, signUpUsername).catch((err: FirebaseError) => {
      if (err.code === 'auth/email-already-in-use') setSignUpErrorText('Email already in use');
      else setSignUpErrorText('An error occurred');
    });
  };

  const signIn = (e: React.FormEvent) => {
    e.preventDefault();

    setSignInErrorText('');
    signInWithEmail(signInEmail, signInPassword).catch((err: FirebaseError) => {
      if (err.code === 'auth/user-not-found') setSignInErrorText('Email or password incorrect');
      else setSignInErrorText('An error occurred');
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
    >
      <div className={styles.modal}>
        <div className={showSignUp ? '' : styles.hide}>
          <h1>Sign Up</h1>
          <p className={styles.errorText}>{signUpErrorText}</p>
          <form className={styles.form} onSubmit={signUp}>
            <div>
              <label htmlFor="sign-up-username">Username</label>
              <input
                type="text"
                id="sign-up-username"
                value={signUpUsername}
                onChange={(e) => setSignUpUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="sign-up-email">Email</label>
              <input
                type="email"
                id="sign-up-email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="sign-up-password">Password</label>
              <input
                type="password"
                id="sign-up-password"
                minLength={6}
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
              />
            </div>
            <Button color="primary" type="submit">
              Sign Up
            </Button>
            <p className={styles.modalFooterText}>
              Already have an account?{' '}
              <button className={styles.modalSignInLink} onClick={() => setShowSignUp(false)}>
                Sign in
              </button>
            </p>
          </form>
        </div>

        <div className={showSignUp ? styles.hide : ''}>
          <h1>Sign In</h1>
          <p className={styles.errorText}>{signInErrorText}</p>
          <form className={styles.form} onSubmit={signIn}>
            <div>
              <label htmlFor="sign-in-email">Email</label>
              <input
                type="email"
                id="sign-in-email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="sign-in-password">Password</label>
              <input
                type="password"
                id="sign-in-password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                required
              />
            </div>
            <Button color="primary" type="submit">
              Sign In
            </Button>
            <p className={styles.modalFooterText}>
              Don't have an account?{' '}
              <button className={styles.modalSignUpLink} onClick={() => setShowSignUp(true)}>
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </Modal>
  );
};

const SignInButtons: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={styles.container}>
      <Button onClick={signInWithGoogle} color="white" variant="outlined">
        Sign in with Google
      </Button>
      <div className={styles.divider}>
        <Line text="or" />
      </div>
      <Button onClick={handleOpen} color="white">
        Continue with Email
      </Button>
      <SignInModal open={open} onClose={handleClose} />
    </div>
  );
};

export default SignInButtons;
