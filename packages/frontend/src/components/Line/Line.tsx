import styles from './Line.module.css';
import Divider from '@mui/material/Divider';

type LineProps = {
  text?: string;
};

const Line = ({ text = '' }: LineProps) => {
  return (
    <div>
      {text ? <Divider className={`${styles.divider}`}>{text}</Divider> : <Divider className={`${styles.divider}`} />}
    </div>
  );
};

export default Line;
