import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import ViewportHeightLayout from '../../layouts/ViewportHeightLayout';
import styles from './NotFoundView.module.css';

type NotFoundViewProps = {
  goBackLink: string;
};

const NotFoundView: React.FC<NotFoundViewProps> = ({ goBackLink }) => (
  <ViewportHeightLayout>
    <div className={styles.notFoundView}>
      <h1 className={styles.heading}>404</h1>
      <h2 className={styles.subtitle}>The goose stole the page you were looking for!</h2>
      <Link to={goBackLink}>
        <Button color="white" variant="filled">
          Go Back
        </Button>
      </Link>
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

export default NotFoundView;
