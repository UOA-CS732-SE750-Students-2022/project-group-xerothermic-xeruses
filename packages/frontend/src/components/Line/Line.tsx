import styles from './Line.module.css';
import Divider from '@mui/material/Divider';

type LineProps = {
  text?: string;
};

const Line = ({ text = '' }: LineProps) => {
  if (text) return <Divider className={`${styles.divider}`}>{text}</Divider>;
  return <Divider className={`${styles.divider}`} />;
};

export default Line;
