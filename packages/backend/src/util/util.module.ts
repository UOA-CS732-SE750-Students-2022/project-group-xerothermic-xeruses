import { Module } from '@nestjs/common';
import { CalendarUtil } from './calendar.util';
import { FlockUtil } from './flock.util';

@Module({
  providers: [CalendarUtil, FlockUtil],
  exports: [CalendarUtil, FlockUtil],
})
export class UtilModule {}
