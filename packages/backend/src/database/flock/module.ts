import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FLOCK_MODEL_NAME, FlockSchema, FlockService } from '.';

@Module({
  imports: [MongooseModule.forFeature([{ name: FLOCK_MODEL_NAME, schema: FlockSchema }])],
  providers: [FlockService],
  exports: [MongooseModule, FlockService],
})
export class FlockDatabaseModule {}
