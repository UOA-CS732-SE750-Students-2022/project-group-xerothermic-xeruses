import { Module } from '@nestjs/common';
import { GoogleConfigModule } from '~/config/googleConfig.module';
import { UserDatabaseModule } from '~/database/user/user.module';
import { FirebaseModule } from '~/firebase/firebase.module';
import { GoogleCalendarService } from './googleCalendar.service';

@Module({
  imports: [FirebaseModule, GoogleConfigModule, UserDatabaseModule],
  providers: [GoogleCalendarService],
  exports: [GoogleCalendarService],
})
export class GoogleCalendarModule {}
