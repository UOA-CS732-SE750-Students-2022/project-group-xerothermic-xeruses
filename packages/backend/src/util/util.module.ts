import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalendarUtil } from './calendar.util';

/**
 * Module for managing Users in the database.
 * A User represents a single unique person with their Flocks, availability & settings.
 */
@Module({
  providers: [CalendarUtil],
  exports: [CalendarUtil],
})
export class UtilModule {}
