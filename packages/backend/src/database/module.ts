import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Flock, FlockSchema, FlockService } from './flock';
import { User, UserSchema, UserService } from './user';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Flock.name, schema: FlockSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [FlockService, UserService],
  exports: [MongooseModule, FlockService, UserService],
})
export class DatabaseModule {}
