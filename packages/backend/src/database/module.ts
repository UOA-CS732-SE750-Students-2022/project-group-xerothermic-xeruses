import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FLOCK_MODEL_NAME, FlockSchema, FlockService } from './flock';
import { USER_MODEL_NAME, UserSchema, UserService } from './user';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FLOCK_MODEL_NAME, schema: FlockSchema }]),
    MongooseModule.forFeature([{ name: USER_MODEL_NAME, schema: UserSchema }]),
  ],
  providers: [FlockService, UserService],
  exports: [MongooseModule, FlockService, UserService],
})
export class DatabaseModule {}
