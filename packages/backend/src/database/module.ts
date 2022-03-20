import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Flock, FlockSchema, FlockService } from './flock';

@Module({
  imports: [MongooseModule.forFeature([{ name: Flock.name, schema: FlockSchema }])],
  providers: [FlockService],
  exports: [MongooseModule, FlockService],
})
export class DatabaseModule {}
