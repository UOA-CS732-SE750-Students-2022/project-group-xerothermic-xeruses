import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL_NAME, UserSchema, UserService } from '.';

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_MODEL_NAME, schema: UserSchema }])],
  providers: [UserService],
  exports: [UserService],
})
export class UserDatabaseModule {}
