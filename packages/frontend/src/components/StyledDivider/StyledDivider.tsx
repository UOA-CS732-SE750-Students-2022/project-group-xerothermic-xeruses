import styles from './StyledDivider.module.css'
import Divider from '@mui/material/Divider'

type DividerProps = {
  orText?: Boolean;
  size: DividerSize;
};

type DividerSize = 'main' | 'side';

const computeSizeClass = (type: DividerSize): string => {
  if (type === 'main') return styles.main;
  if (type === 'side') return styles.side;
  return '';
}

const StyledDivider = ({ orText=false, size }: DividerProps) => {
  const sizeClass = computeSizeClass(size);
  if (orText) return <Divider className={`${styles.divider} ${sizeClass}`}>or</Divider>;
  return <Divider className={`${styles.divider} ${sizeClass}`}/>;
}

export default StyledDivider;