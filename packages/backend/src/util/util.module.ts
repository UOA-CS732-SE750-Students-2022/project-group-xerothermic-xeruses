import { forwardRef, Module } from '@nestjs/common';
import { FlockDatabaseModule } from '~/database/flock/flock.module';
import { GoogleCalendarModule } from '~/googleCalendar/googleCalendar.module';
import { CalendarUtil } from './calendar.util';
import { FlockUtil } from './flock.util';

@Module({
  imports: [forwardRef(() => FlockDatabaseModule), GoogleCalendarModule],
  providers: [CalendarUtil, FlockUtil],
  exports: [CalendarUtil, FlockUtil],
})
export class UtilModule {}
