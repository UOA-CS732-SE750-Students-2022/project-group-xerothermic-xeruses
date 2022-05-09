import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import styles from './NotFoundView.module.css';

type NotFoundViewProps = {
  goBackLink: string;
};

const NotFoundView: React.FC<NotFoundViewProps> = ({ goBackLink }) => (
  <div className={styles.notFoundView}>
    <div className={styles.container}>
      <h1 className={styles.heading}>404</h1>
      <h2 className={styles.subtitle}>The goose stole the page you were looking for!</h2>
      <Link to={goBackLink}>
        <Button color="white" variant="outlined">
          Go Back
        </Button>
      </Link>
    </div>
    <img
      className={`${styles.goose} ${styles.goose}`}
      src={`${process.env.PUBLIC_URL}/assets/images/flocker-goose.png`}
      alt="logo"
    />
  </div>
);

export default NotFoundView;
