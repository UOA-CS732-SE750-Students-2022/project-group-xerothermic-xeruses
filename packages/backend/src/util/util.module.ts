import { Module } from '@nestjs/common';
import { CalendarUtil } from './calendar.util';

@Module({
  providers: [CalendarUtil],
  exports: [CalendarUtil],
})
export class UtilModule {}
