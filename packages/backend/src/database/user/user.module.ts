import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseDatabaseModule } from '../baseDatabase.module';
import { USER_MODEL_NAME, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserDatabaseUtilModule } from './util/userDatabaseUtil.module';

/**
 * Module for managing Users in the database.
 * A User represents a single unique person with their Flocks, availability & settings.
 */
@Module({
  imports: [
    BaseDatabaseModule,
    UserDatabaseUtilModule,
    MongooseModule.forFeature([{ name: USER_MODEL_NAME, schema: UserSchema }]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserDatabaseModule {}
