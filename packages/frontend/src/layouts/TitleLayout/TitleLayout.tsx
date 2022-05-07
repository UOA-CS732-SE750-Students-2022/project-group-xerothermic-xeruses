import React from 'react';
import styles from './TitleLayout.module.css';

type TitleLayoutProps = {
  title: string;
  content: React.ReactNode;
};

const TitleLayout: React.FC<TitleLayoutProps> = ({ title, content }) => (
  <div className={styles.container}>
    <h1 className={styles.title}>{title}</h1>
    {content}
  </div>
);

export default TitleLayout;
