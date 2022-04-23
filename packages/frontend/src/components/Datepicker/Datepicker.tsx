import { useState } from 'react';
import styles from 'react-day-picker/dist/style.module.css';
import customStyles from './Datepicker.module.css';
import { DayPicker } from 'react-day-picker';

/* Empty type needed due to Typescript's checker.ts */
type DatepickerProps = {};

// eslint-disable-next-line no-empty-pattern
const Datepicker = ({}: DatepickerProps, datesPicked: (dates: Date[]) => Date[] | undefined) => {
  const initialDays: Date[] = [];
  const [days, setDays] = useState<Date[] | undefined>(initialDays);

  const footer =
    days && days.length > 0 ? <p>You selected {days.length} day(s).</p> : <p>Please pick one or more days.</p>;

  datesPicked = (dates: Date[]) => {
    return days;
  };

  return (
    <>
      <DayPicker
        classNames={styles}
        modifiersClassNames={{ selected: `${customStyles.selected}` }}
        mode="multiple"
        min={1}
        selected={days}
        onSelect={setDays}
        footer={footer}
      />
    </>
  );
};

export default Datepicker;
