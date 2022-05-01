import { Module } from '@nestjs/common';
import { FlockDatabaseModule } from '~/database/flock/flock.module';
import { UserDatabaseModule } from '~/database/user/user.module';
import { UtilModule } from '~/util/util.module';
import { FlockResolver } from './flock.resolver';

@Module({
  imports: [FlockDatabaseModule, UserDatabaseModule, UtilModule],
  providers: [FlockResolver],
})
export class FlockGraphQLModule {}
