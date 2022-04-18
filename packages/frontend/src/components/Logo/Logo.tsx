import styles from './Logo.module.css';

type LogoProps = {
  colored?: boolean;
  size: LogoSize;
};

type LogoSize = 'display' | 'footer';

const computeSizeClass = (type: LogoSize): string => {
  if (type === 'display') return styles.display;
  if (type === 'footer') return styles.footer;
  return '';
};

const Logo = ({ colored = false, size }: LogoProps) => {
  const coloredClass = colored ? styles.colored : '';
  const sizeClass = computeSizeClass(size);

  return <h1 className={`${styles.logo} ${coloredClass} ${sizeClass}`}>Flocker</h1>;
};

export default Logo;
