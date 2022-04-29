import { Module } from '@nestjs/common';
import { UserAvailabilityUtil } from './userAvailability.util';

/**
 * Module for utility functions for the database.
 */
@Module({
  providers: [UserAvailabilityUtil],
  exports: [UserAvailabilityUtil],
})
export class UserDatabaseUtilModule {}
