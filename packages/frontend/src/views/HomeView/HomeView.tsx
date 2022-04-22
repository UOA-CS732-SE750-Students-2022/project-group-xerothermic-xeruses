import styles from './HomeView.module.css';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import Line from '../../components/Line';
import { auth } from '../../auth/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';

const HomeView = () => {
  const { setUser } = useAuth();

  const googleSignInClicked = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((userCred) => setUser(userCred.user));
  };

  return (
    <div className={styles.homeView}>
      <div className={styles.heading}>
        <Logo size="display" />
        <p className={styles.subtitle}>Find a time for you and your group</p>
      </div>
      <div className={styles.buttons}>
        <Button onClick={googleSignInClicked} color="white" variant="outlined">
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
      <img
        className={`${styles.goose} ${styles.goose1}`}
        src={`${process.env.PUBLIC_URL}/assets/images/flocker-goose.png`}
        alt="logo"
      />
      <img
        className={`${styles.goose} ${styles.goose2}`}
        src={`${process.env.PUBLIC_URL}/assets/images/flocker-goose.png`}
        alt="logo"
      />
    </div>
  );
};

export default HomeView;
