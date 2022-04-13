import { Module } from '@nestjs/common';
import { FlockDatabaseModule } from '~/database/flock/flock.module';
import { UserDatabaseModule } from '~/database/user/user.module';
import { UserResolver } from './user.resolver';

@Module({
  imports: [FlockDatabaseModule, UserDatabaseModule],
  providers: [UserResolver],
})
export class UserGraphQLModule {}
