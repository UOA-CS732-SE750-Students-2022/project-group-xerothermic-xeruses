import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseDatabaseModule } from '../baseDatabase.module';
import { USER_MODEL_NAME, UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [BaseDatabaseModule, MongooseModule.forFeature([{ name: USER_MODEL_NAME, schema: UserSchema }])],
  providers: [UserService],
  exports: [UserService],
})
export class UserDatabaseModule {}
