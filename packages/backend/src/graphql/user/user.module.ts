import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserDatabaseModule } from '~/database/user/user.module';

@Module({
  imports: [UserDatabaseModule],
  providers: [UserResolver],
})
export class UserGraphqlModule {}
