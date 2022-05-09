import { Module } from '@nestjs/common';
import { GoogleConfigModule } from '~/config/googleConfig.module';
import { UserDatabaseModule } from '~/database/user/user.module';
import { FirebaseModule } from '~/firebase/firebase.module';
import { GoogleCalendarController } from './googlecalendar.controller';
import { GoogleCalendarService } from './googlecalendar.service';

@Module({
  imports: [FirebaseModule, GoogleConfigModule, UserDatabaseModule],
  controllers: [GoogleCalendarController],
  providers: [GoogleCalendarService],
})
export class GoogleCalendarModule {}
