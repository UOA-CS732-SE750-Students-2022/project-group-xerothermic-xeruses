import { forwardRef, Module } from '@nestjs/common';
import { FlockDatabaseModule } from '~/database/flock/flock.module';
import { UserDatabaseModule } from '~/database/user/user.module';
import { FlockGraphQLModule } from '../flock/flock.module';
import { UserResolver } from './user.resolver';

@Module({
  imports: [FlockDatabaseModule, UserDatabaseModule, forwardRef(() => FlockGraphQLModule)],
  providers: [UserResolver],
})
export class UserGraphQLModule {}
