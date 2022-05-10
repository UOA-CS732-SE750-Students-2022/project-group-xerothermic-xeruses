import { Module } from '@nestjs/common';
import { GoogleCalendarModule } from '~/googleCalendar/googleCalendar.module';
import { GoogleCalendarController } from './googleCalendar.controller';

@Module({
  imports: [GoogleCalendarModule],
  controllers: [GoogleCalendarController],
})
export class GoogleCalendarRestModule {}
