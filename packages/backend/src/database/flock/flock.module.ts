import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilModule } from '~/util/util.module';
import { BaseDatabaseModule } from '../baseDatabase.module';
import { FLOCK_MODEL_NAME, FlockSchema } from './flock.schema';
import { FlockService } from './flock.service';

/**
 * Module for managing Flocks in the database.
 * A Flock represents a multi-user ('flock') availability schedule.
 */
@Module({
  imports: [
    BaseDatabaseModule,
    MongooseModule.forFeature([{ name: FLOCK_MODEL_NAME, schema: FlockSchema }]),
    forwardRef(() => UtilModule),
  ],
  providers: [FlockService],
  exports: [FlockService],
})
export class FlockDatabaseModule {}
