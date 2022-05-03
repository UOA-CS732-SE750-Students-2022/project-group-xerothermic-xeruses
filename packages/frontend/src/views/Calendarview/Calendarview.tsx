import styles from './Calendarview.module.css';
import { useAuth } from '../../contexts/AuthContext';

type CalendarviewProps = {
  prop1: string;
};

const Calendarview = ({ prop1 }: CalendarviewProps) => {
  const { setUser } = useAuth();

  return <div className={styles.calendarView}></div>;
};

export default Calendarview;
