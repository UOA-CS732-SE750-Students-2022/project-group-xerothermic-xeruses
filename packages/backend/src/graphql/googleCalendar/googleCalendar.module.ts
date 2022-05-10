import { Module } from '@nestjs/common';
import { GoogleCalendarModule } from '~/googleCalendar/googleCalendar.module';
import { GoogleCalendarResolver } from './googleCalendar.resolver';

@Module({
  imports: [GoogleCalendarModule],
  providers: [GoogleCalendarResolver],
})
export class GoogleCalendarGraphQLModule {}
