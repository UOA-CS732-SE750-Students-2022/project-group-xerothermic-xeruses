import { forwardRef, Module } from '@nestjs/common';
import { FlockDatabaseModule } from '~/database/flock/flock.module';
import { CalendarUtil } from './calendar.util';
import { FlockUtil } from './flock.util';

@Module({
  imports: [forwardRef(() => FlockDatabaseModule)],
  providers: [CalendarUtil, FlockUtil],
  exports: [CalendarUtil, FlockUtil],
})
export class UtilModule {}
