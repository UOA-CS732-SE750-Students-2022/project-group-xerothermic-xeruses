import React from 'react';
import Sidebar from '../../components/Sidebar';
import Timematcher from '../../components/Timematcher';
import SidebarLayout from '../../layouts/SidebarLayout';
import TitleLayout from '../../layouts/TitleLayout';
import styles from './CalendarView.module.css';

type CalendarViewProps = {};

const CalendarView: React.FC<CalendarViewProps> = () => (
  <SidebarLayout
    sidebarContent={<Sidebar />}
    bodyContent={
      <TitleLayout
        title="Flock"
        content={
          <Timematcher
            datesPicked={[]}
            timeRange={[new Date(), new Date()]}
            userAvailability={[]}
            othersAvailability={[]}
          />
        }
      />
    }
  />
);

export default CalendarView;
