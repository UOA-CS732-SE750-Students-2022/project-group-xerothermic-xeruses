import { forwardRef, Module } from '@nestjs/common';
import { FlockDatabaseModule } from '~/database/flock/flock.module';
import { UserDatabaseModule } from '~/database/user/user.module';
import { UserGraphQLModule } from '../user/user.module';
import { FlockResolver } from './flock.resolver';

@Module({
  imports: [FlockDatabaseModule, UserDatabaseModule, forwardRef(() => UserGraphQLModule)],
  providers: [FlockResolver],
})
export class FlockGraphQLModule {}
