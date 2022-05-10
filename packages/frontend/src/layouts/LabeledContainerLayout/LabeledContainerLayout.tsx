import React from 'react';
import styles from './LabeledContainerLayout.module.css';

type LabeledContainerLayoutProps = {
  label?: string;
  content?: React.ReactNode;
};

const LabeledContainerLayout: React.FC<LabeledContainerLayoutProps> = ({ label, content }) => (
  <div className={styles.container}>
    <p className={styles.label}>{label}</p>
    <div className={styles.content}>{content}</div>
  </div>
);

export default LabeledContainerLayout;
