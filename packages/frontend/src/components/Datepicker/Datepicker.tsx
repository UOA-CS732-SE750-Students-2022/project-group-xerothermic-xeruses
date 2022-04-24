import { useState } from 'react';
import styles from 'react-day-picker/dist/style.module.css';
import customStyles from './Datepicker.module.css';
import { DayPicker } from 'react-day-picker';

type DatepickerProps = {
  datesPicked: (dates: Date[]) => void;
};

const Datepicker = ({ datesPicked }: DatepickerProps) => {
  const initialDays: Date[] = [];
  const [days, setDays] = useState<Date[] | undefined>(initialDays);

  const handleChange = (dates: Date[] | undefined) => {
    setDays(dates);
    if (dates) dates.sort((date1, date2) => date1.valueOf() - date2.valueOf());
    datesPicked(dates as Date[]);
  };

  const footer =
    days && days.length > 0 ? <p>You selected {days.length} day(s).</p> : <p>Please pick one or more days.</p>;

  return (
    <>
      <DayPicker
        classNames={styles}
        modifiersClassNames={{ selected: `${customStyles.selected}` }}
        mode="multiple"
        min={1}
        selected={days}
        onSelect={handleChange}
        footer={footer}
      />
    </>
  );
};

export default Datepicker;
