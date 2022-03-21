import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseDatabaseModule } from '../baseDatabase.module';
import { FLOCK_MODEL_NAME, FlockSchema } from './flock.schema';
import { FlockService } from './flock.service';

@Module({
  imports: [BaseDatabaseModule, MongooseModule.forFeature([{ name: FLOCK_MODEL_NAME, schema: FlockSchema }])],
  providers: [FlockService],
  exports: [FlockService],
})
export class FlockDatabaseModule {}
