import React from 'react';
import styles from './{{pascalcase name}}.module.css';

type {{pascalcase name}}Props = {
  prop1: string;
};

const {{pascalcase name}}: React.FC<{{pascalcase name}}Props> = ({ prop1 }) => (
  <div>
    <h1 className={styles.title}>{{pascalcase name}}</h1>
  </div>
);

export default {{pascalcase name}};
