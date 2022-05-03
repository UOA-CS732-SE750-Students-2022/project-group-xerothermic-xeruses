import styles from './Calendarview.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_USER_INTERVALS } from '../../apollo/queries';

type CalendarviewProps = {
  prop1: string;
};

const Calendarview = ({ prop1 }: CalendarviewProps) => {
  const { setUser } = useAuth();

  const [error, data] = useQuery(GET_USER_INTERVALS, {
    variables: {
      userIntervalInput: {
        intervals: [
          {
            start: new Date(),
            end: new Date(),
          },
        ],
      },
      availabilityIds: [availabilityIds],
    },
  });

  return <div className={styles.calendarView}></div>;
};

export default Calendarview;
