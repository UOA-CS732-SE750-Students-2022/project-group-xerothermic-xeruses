import { useState } from 'react';
import styles from 'react-day-picker/dist/style.module.css';
import customStyles from './Datepicker.module.css';
import { DayPicker } from 'react-day-picker';

const Datepicker = (datesPicked) => {
  const initialDays: Date[] = [];
  const [days, setDays] = useState<Date[] | undefined>(initialDays);

  const footer =
    days && days.length > 0 ? <p>You selected {days.length} day(s).</p> : <p>Please pick one or more days.</p>;

  return (
    <DayPicker
      classNames={styles}
      modifiersClassNames={{ selected: `${customStyles.selected}` }}
      mode="multiple"
      min={1}
      selected={days}
      onSelect={setDays}
      footer={footer}
    />
  );
};

export default Datepicker;
