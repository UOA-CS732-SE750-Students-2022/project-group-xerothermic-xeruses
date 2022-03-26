import { Module } from '@nestjs/common';
import { UserDatabaseModule } from '~/database/user/user.module';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserDatabaseModule, UserResolver],
})
export class UserGraphqlModule {}
