import styles from './StyledDivider.module.css'
import Divider from '@mui/material/Divider'

type LineProps = {
  orText?: Boolean;
  size: LineSize;
};

type LineSize = 'main' | 'side';

const computeSizeClass = (type: LineSize): string => {
  if (type === 'main') return styles.main;
  if (type === 'side') return styles.side;
  return '';
}

const Line = ({ orText=false, size }: LineProps) => {
  const sizeClass = computeSizeClass(size);
  if (orText) return <Divider className={`${styles.divider} ${sizeClass}`}>or</Divider>;
  return <Divider className={`${styles.divider} ${sizeClass}`}/>;
}

export default Line;