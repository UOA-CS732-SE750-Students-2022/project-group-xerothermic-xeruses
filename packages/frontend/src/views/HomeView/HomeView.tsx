import styles from './HomeView.module.css';
import Logo from '../../components/Logo';
import SignInButtons from '../../components/SignInButtons';
import ViewportHeightLayout from '../../layouts/ViewportHeightLayout';

type HomeViewProps = {
  showButtons?: boolean;
};

const HomeView: React.FC<HomeViewProps> = ({ showButtons = true }) => {
  const buttonVisibility = showButtons ? undefined : 'hidden';
  return (
    <ViewportHeightLayout>
      <div className={styles.homeView}>
        <div className={styles.heading}>
          <Logo size="display" />
          <p className={styles.subtitle}>Find a time for you and your group</p>
        </div>
        <div className={styles.buttons} style={{ visibility: buttonVisibility }}>
          <SignInButtons />
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
    </ViewportHeightLayout>
  );
};

export default HomeView;
